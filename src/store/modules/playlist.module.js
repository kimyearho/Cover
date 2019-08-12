/*
 * title:
 * menu:
 * description:
 * author:
 */

const API_KEY = "AIzaSyAcNGab-jHH_79rEhgFFFy_4oS46yUMNds";

const state = {
  playlistInfo: {
    id: "",
    title: "",
    channelTitle: "",
    description: "",
    thumbnails: null
  },
  playList: {
    id: "",
    list: [],
    nextToken: ""
  },
  playbackWaitList: {
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
  },
  GET_PLAYLIST_INFO: state => {
    return state.playlistInfo;
  },
  GET_PLAYBACK_WAIT_LIST: state => {
    return state.playbackWaitList.list;
  },
  GET_PLAYBACK_WAIT_TOKEN: state => {
    return state.playbackWaitList.nextToken;
  }
};

const mutations = {
  SET_PLAYLIST_ID(state, payload) {
    state.playList.id = payload;
  },
  SET_PLAY_LIST(state, payload) {
    state.playList.list = Object.freeze(payload);
  },
  SET_PLAYLIST_TOKEN(state, payload) {
    state.playList.nextToken = payload;
  },
  SET_PLAYLIST_NEXTLOAD(state, { vm, data }) {
    state.playList.list = vm._.concat(state.playList.list, data);
    state.playbackWaitList.list = vm._.concat(state.playbackWaitList.list, data);
  },
  SET_PLAYLIST_INFO(state, payload) {
    state.playlistInfo.id = payload.playlistId;
    state.playlistInfo.title = payload.title;
    state.playlistInfo.channelTitle = payload.channelTitle;
    state.playlistInfo.description = payload.description;
    state.playlistInfo.thumbnails = payload.thumbnails;
  },
  SET_PLAYBACK_WAIT_LIST(state, payload) {
    state.playbackWaitList.list = payload;
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
        vm._.forEach(data.items, (item, index) => {
          let videoItem = Object.assign({}, item.snippet);
          videoItem.videoId = videoItem.resourceId.videoId;
          videoItem.listIndex = index + 1
          delete videoItem.resourceId;
          delete videoItem.publishedAt;
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

      let playlist = state.playList.list
      let listMaxIndex = playlist[playlist.length - 1].listIndex

      let array = [];
      vm._.forEach(data.items, (item, index) => {
        let assignIndex = index + 1
        let videoItem = Object.assign({}, item.snippet);
        videoItem.videoId = videoItem.resourceId.videoId;
        videoItem.listIndex = listMaxIndex + assignIndex
        delete videoItem.resourceId;
        delete videoItem.publishedAt;
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
        commit("SET_PLAYBACK_WAIT_LIST", array);
      } else {
        commit("SET_PLAYLIST_NEXTLOAD", { vm: vm, data: array });
        vm.loadMoreLoading = false;
      }
    });
  },

  getUpdatePlaybackWithList({ commit, state }) {
    const playbackWithList = state.playbackWaitList.list;
    commit("SET_PLAYBACK_WAIT_LIST", playbackWithList);
    return true
  }

};

export default {
  state,
  getters,
  mutations,
  actions
};
