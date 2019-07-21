const API_KEY = "AIzaSyBXQrLCFWgip6navZZfww_LhsyjbaW0vIQ";

const state = {
  playList: {
    id: "",
    list: [],
    nextToken: ""
  }
};

const getters = {
  GET_ID: state => {
    return state.playList.id;
  },
  GET_PLAY_LIST: state => {
    return state.playList.list;
  },
  GET_PLAYLIST_TOKEN: state => {
    return state.playList.nextToken;
  }
};

const mutations = {
  SET_PLAYLIST_ID(state, payload) {
    state.playList.id = payload;
  },
  SET_D_PLAY_LIST(state, payload) {
    state.playList.list = Object.freeze(payload);
  },
  SET_PLAY_LIST(state, payload) {
    state.playList.list = Object.freeze(payload);
  },
  SET_PLAYLIST_TOKEN(state, payload) {
    state.playList.nextToken = payload;
  },
  SET_PLAYLIST_NEXTLOAD(state, { vm, data }) {
    state.playList.list = vm._.concat(state.playList.list, data);
  }
};

const actions = {

  getPlaylist({ commit, dispatch }, { vm, playlistId }) {
    commit("SET_PLAYLIST_ID", playlistId);
    const params = {
      part: "snippet",
      playlistId: playlistId,
      maxResults: 25,
      key: API_KEY
    };
    return vm.axios
      .get("/playlistItems", { params: params })
      .then(({ data }) => {
        commit("SET_PLAYLIST_TOKEN", data.nextPageToken);
        let array = [];
        vm._.forEach(data.items, item => {
          let videoItem = Object.assign({}, item.snippet);
          videoItem.videoId = videoItem.resourceId.videoId;
          delete videoItem.resourceId;
          array.push(videoItem);
        });
        dispatch("getPlaylistVideoDuration", {
          vm: vm,
          data: array,
          mode: "s"
        });
      });
  },

  getPlaylistNextSearch({ commit, dispatch, state }, { vm, playlistId }) {
    const queryParams = {
      part: "snippet",
      playlistId: playlistId,
      maxResults: 25,
      pageToken: state.playList.nextToken,
      key: API_KEY
    };
    vm.axios.get(`/playlistItems`, { params: queryParams }).then(({ data }) => {
      commit("SET_PLAYLIST_TOKEN", data.nextPageToken);
      let array = [];
      vm._.forEach(data.items, item => {
        let videoItem = Object.assign({}, item.snippet);
        videoItem.videoId = videoItem.resourceId.videoId;
        delete videoItem.resourceId;
        array.push(videoItem);
      });
      dispatch("getPlaylistVideoDuration", { vm: vm, data: array, mode: "n" });
    });
  },
  
  getPlaylistVideoDuration({ commit }, { vm, data, mode }) {
    const videoIds = vm._.map(data, "videoId");
    const url = `/videos?part=contentDetails,snippet&fields=items(id,contentDetails(duration))&id=${videoIds}&key=${API_KEY}`;
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
        commit("SET_PLAY_LIST", array);
      } else {
        commit("SET_PLAYLIST_NEXTLOAD", { vm: vm, data: array });
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
