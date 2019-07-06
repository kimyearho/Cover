const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = "AIzaSyAcNGab-jHH_79rEhgFFFy_4oS46yUMNds";

import { getField } from "vuex-map-fields";

const state = {
  searchList: [],
  scrollPos: 0,
  nextToken: null,
  searchText: "top music"
};

const getters = {
  getField
};

const mutations = {
  SET_SEARCH_TEXT(state, payload) {
    state.searchText = payload;
  },
  SET_SCROLL(state, payload) {
    state.scrollPos = payload;
  },
  SET_SEARCH_LIST(state, payload) {
    state.searchList = payload;
  },
  SET_NEXTLOAD(state, { vm, data }) {
    state.searchList = vm._.concat(state.searchList, data);
  },
  SET_NEXT_TOKEN(state, payload) {
    state.nextToken = payload;
  }
};

const actions = {
  getApiSearch({ commit, dispatch, state }, { vm, text }) {
    const queryParams = {
      part: "snippet",
      q: text ? text : state.searchText,
      type: "video,playlist,channel",
      maxResults: "50",
      safeSearch: "strict",
      key: API_KEY
    };
    vm.axios.get(`${BASE_URL}/search`, { params: queryParams }).then(res => {
      if (res.status === 200) {
        if (res.data.nextPageToken)
          commit("SET_NEXT_TOKEN", res.data.nextPageToken);
        let array = [];
        vm._.forEach(res.data.items, item => {
          let videoItem = Object.assign({}, item.snippet);
          videoItem.channelId = item.id.channelId;
          videoItem.playlistId = item.id.playlistId;
          videoItem.videoId = item.id.videoId;
          videoItem.etag = item.etag;
          array.push(videoItem);
        });
        dispatch("getVideoDuration", { vm: vm, data: array, mode: "s" });
      }
    });
  },

  getApiNextloadSearch({ commit, dispatch, state }, { vm, text }) {
    const queryParams = {
      part: "snippet",
      q: text ? text : state.searchText,
      type: "video,playlist,channel",
      maxResults: "50",
      safeSearch: "strict",
      pageToken: state.nextToken,
      key: API_KEY
    };

    vm.axios.get(`${BASE_URL}/search`, { params: queryParams }).then(res => {
      if (res.status === 200) {
        if (res.data.nextPageToken)
          commit("SET_NEXT_TOKEN", res.data.nextPageToken);
        let array = [];
        vm._.forEach(res.data.items, item => {
          let videoItem = Object.assign({}, item.snippet);
          videoItem.channelId = item.id.channelId;
          videoItem.playlistId = item.id.playlistId;
          videoItem.videoId = item.id.videoId;
          videoItem.etag = item.etag;
          array.push(videoItem);
        });
        dispatch("getVideoDuration", { vm: vm, data: array, mode: "n" });
      }
    });
  },

  getVideoDuration({ commit }, { vm, data, mode }) {
    const videoIds = vm._.map(data, "videoId");
    const url = `${BASE_URL}/videos?part=contentDetails,snippet&fields=items(id,contentDetails(duration))&id=${videoIds}&key=${API_KEY}`;
    let array = [];
    vm.axios.get(url).then(res => {
      vm._.forEach(data, item => {
        let videoId = item.videoId;
        vm._.forEach(res.data.items, videoIdArray => {
          if (videoId === videoIdArray.id) {
            item.duration_time = vm.convertToSeconds(
              videoIdArray.contentDetails.duration
            );
            item.duration = vm.secondFormat(item.duration_time);
          }
        });
        array.push(item);
      });
      if (mode === "s") {
        commit("SET_SEARCH_LIST", array);
      } else {
        commit("SET_NEXTLOAD", { vm: vm, data: array });
      }
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
