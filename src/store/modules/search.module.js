/*
* title:
* menu: 
* description: 
* author: 
*/

const state = {
  searchList: [],
  scrollPos: 0,
  nextToken: null,
  searchText: "audio library",
};

const getters = {
  GET_SEARCH_TEXT() {
    return state.searchText;
  },
  GET_SCROLL() {
    return state.scrollPos;
  },
  GET_SEARCH_LIST() {
    return state.searchList;
  },
  GET_NEXT_TOKEN() {
    return state.nextToken;
  }
};

const mutations = {
  SET_SEARCH_TEXT(state, payload) {
    state.searchText = payload;
  },
  SET_SCROLL(state, payload) {
    state.scrollPos = payload;
  },
  SET_SEARCH_LIST(state, payload) {
    state.searchList = Object.freeze(payload);
  },
  SET_NEXTLOAD(state, { vm, data }) {
    state.searchList = Object.freeze(vm._.concat(state.searchList, data));
  },
  SET_NEXT_TOKEN(state, payload) {
    state.nextToken = payload;
  }
};

const actions = {
  getApiSearch({ commit, dispatch, state, rootGetters }, { vm }) {
    const queryParams = {
      part: "snippet",
      q: state.searchText,
      type: "video,playlist,channel",
      maxResults: 25,
      safeSearch: "strict",
      key: rootGetters['common/GET_SEARCH_KEY'].apiKey
    };
    commit("common/SET_IS_LOADING", true);
    return vm.$axios.get(`/search`, { params: queryParams }).then(res => {
      if (res.status === 200) {
        if (res.data.nextPageToken)
          commit("SET_NEXT_TOKEN", res.data.nextPageToken);
        let array = [];
        vm._.forEach(res.data.items, item => {
          let videoItem = Object.assign({}, item.snippet);
          videoItem.channel = videoItem.channelId;
          videoItem.channelId = item.id.channelId;
          videoItem.playlistId = item.id.playlistId;
          videoItem.videoId = item.id.videoId;
          array.push(videoItem);
        });
        dispatch("getVideoDuration", { vm: vm, data: array, mode: "s" });
      }
    });
  },

  getApiNextloadSearch({ commit, dispatch, state, rootGetters }, { vm }) {
    const queryParams = {
      part: "snippet",
      q: state.searchText,
      type: "video,playlist,channel",
      maxResults: 25,
      safeSearch: "strict",
      pageToken: state.nextToken,
      key: rootGetters['common/GET_SEARCH_KEY'].apiKey
    };

    vm.$axios.get(`/search`, { params: queryParams }).then(res => {
      if (res.status === 200) {
        if (res.data.nextPageToken)
          commit("SET_NEXT_TOKEN", res.data.nextPageToken);
        let array = [];
        vm._.forEach(res.data.items, item => {
          let videoItem = Object.assign({}, item.snippet);
          videoItem.channelId = item.id.channelId;
          videoItem.playlistId = item.id.playlistId;
          videoItem.videoId = item.id.videoId;
          array.push(videoItem);
        });
        dispatch("getVideoDuration", { vm: vm, data: array, mode: "n" });
      }
    });
  },

  getVideoDuration({ commit, rootGetters }, { vm, data, mode }) {
    const videoIds = vm._.map(data, "videoId");
    const apiKey = rootGetters['common/GET_SEARCH_KEY'].apiKey
    const url = `/videos?part=contentDetails,snippet&fields=items(id,contentDetails(duration))&id=${videoIds}&key=${apiKey}`;
    let array = [];
    vm.$axios.get(url).then(res => {
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
        commit("common/SET_IS_LOADING", false);
        vm.$event.$emit("topList", { data: 0 });
      } else {
        commit("SET_NEXTLOAD", { vm: vm, data: array });
        vm.loadMoreLoading = false;
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
