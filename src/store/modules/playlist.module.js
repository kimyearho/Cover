/*
 * title:
 * menu:
 * description:
 * author:
 */

const API_KEY = "AIzaSyBXQrLCFWgip6navZZfww_LhsyjbaW0vIQ";

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
      maxResults: 30,
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
      maxResults: 30,
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
      } else {
        commit("SET_PLAYLIST_NEXTLOAD", { vm: vm, data: array });
        vm.loadMoreLoading = false;
      }
    });
  },

  getPlaybackWaitList({ commit, state }, { vm, position }) {
    /**
     * 사용자가 선택한 비디오의 순번보다 높은 비디오를 필터링한뒤,
     * 필터링된 데이터에 index를 부여한다. 시작은 1부터
     */
    const playlist = state.playList.list;
    const list = vm._.chain(playlist)
      .filter(item => {
        return item.position > position;
      })
      .forEach((item, index) => {
        item.listIndex = index + 1;
      })
      .value();
    commit("SET_PLAYBACK_WAIT_LIST", list);
    return true;
  },

  getUpdatePlaybackWithList({ commit, state }, { vm, listIndex }) {
    /**
     * 사용자가 재생대기목록을 선택했을때 선택한 listIndex 보다 큰 순번만
     * 필터링 되도록한다. 필터링 된 목록의 lintIndex를 1부터 다시 설정한다.
     */
    const playbackWithList = state.playbackWaitList.list;
    const list = vm._.chain(playbackWithList)
      .filter(item => {
        return item.listIndex > listIndex;
      })
      .forEach((item, index) => {
        item.listIndex = index + 1;
      })
      .value();
    commit("SET_PLAYBACK_WAIT_LIST", list);
    return true
  }

};

export default {
  state,
  getters,
  mutations,
  actions
};
