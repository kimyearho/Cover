/*
 * title:
 * menu:
 * description:
 * author:
 */

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
    nextToken: "",
    type: "playlist"
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
  }
};

const actions = {
  playlistInit({ commit }, { playlistId, data }) {
    // 현재 재생중인 비디오 정보
    return new Promise(resolve => {
      commit("SET_PLAYLIST_ID", playlistId);
      commit("SET_PLAYLIST_TOKEN", data.nextPageToken);
      resolve(true);
    });
  },

  getPlaylist({ dispatch, rootGetters }, { vm, playlistId }) {
    const params = {
      part: "snippet",
      playlistId: playlistId,
      maxResults: 30,
      key: rootGetters['common/GET_VIDEO_ITEMS_KEY'].apiKey
    };
    return vm.$axios
      .get("/playlistItems", { params: params })
      .then(({ data }) => {
        dispatch("playlistInit", { playlistId: playlistId, data: data })
          .then(
            result => {
              const type = result;
              vm.$log.info(type);

              let array = [];
              vm._.forEach(data.items, (item, index) => {
                let videoItem = Object.assign({}, item.snippet);
                videoItem.videoId = videoItem.resourceId.videoId;
                videoItem.listIndex = index + 1;
                delete videoItem.resourceId;
                delete videoItem.publishedAt;
                array.push(videoItem);
                if ((data.items.length - 1) === index) {
                  dispatch("getPlaylistVideoDuration", {
                    vm: vm,
                    data: array,
                    mode: "list",
                    type
                  });
                }
              });
            }
          );
      });
  },

  getPlaylistNextSearch({ commit, dispatch, state, rootGetters }, { vm, playlistId, type }) {
    const nextToken = state.playList.nextToken;
    const queryParams = {
      part: "snippet",
      playlistId: playlistId,
      maxResults: 30,
      pageToken: nextToken,
      key: rootGetters['common/GET_VIDEO_ITEMS_KEY'].apiKey
    };

    vm.$axios.get(`/playlistItems`, { params: queryParams }).then(({ data }) => {
      let playlist = state.playList.list;
      let listMaxIndex = playlist[playlist.length - 1].listIndex;
      commit("SET_PLAYLIST_TOKEN", data.nextPageToken);

      let array = [];
      vm._.forEach(data.items, (item, index) => {
        let assignIndex = index + 1;
        let videoItem = Object.assign({}, item.snippet);
        videoItem.videoId = videoItem.resourceId.videoId;
        videoItem.listIndex = listMaxIndex + assignIndex;
        delete videoItem.resourceId;
        delete videoItem.publishedAt;
        array.push(videoItem);
        if ((data.items.length - 1) === index) {
          dispatch("getPlaylistVideoDuration", {
            vm: vm,
            data: array,
            mode: "nextLoad",
            type: type
          });
        }
      });
    });
  },

  getPlaylistVideoDuration({ commit, rootGetters }, { vm, data, mode, type }) {
    const playingVideoInfo = rootGetters.GET_PLAYING_VIDEO;
    const isPlaying = playingVideoInfo.isUse;
    const videoIds = vm._.map(data, "videoId");
    const apiKey = rootGetters['common/GET_VIDEO_ITEMS_KEY'].apiKey
    const url = `/videos?part=contentDetails,snippet&fields=items(id,contentDetails(duration))&id=${videoIds}&key=${apiKey}`;

    let array = [];
    vm.$axios.get(url).then(res => {
      vm._.forEach(data, (item, index) => {
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
        if ((data.length - 1) === index) {
          // 재생목록 조회일때
          if (mode === "list") {
            commit("SET_PLAY_LIST", array);
            if (!isPlaying) {
              commit("playback/SET_PLAYBACK_LIST", array);
            }
          } else {
            if (type === "" || type === true) {
              commit("SET_PLAYLIST_NEXTLOAD", { vm: vm, data: array });
              commit("playback/SET_PLAYBACK_NEXTLOAD", { vm: vm, data: array });
            } else {
              commit("SET_PLAYLIST_NEXTLOAD", { vm: vm, data: array });
            }
            vm.loadMoreLoading = false;
          }
        }
      });

    });
  },

  getNewUpdatePlayback({ commit, state }) {
    const newPlayback = state.playList.list;
    const newPlaybackToken = state.playList.nextToken;
    const newPlaybackId = state.playList.id
    commit("SET_PLAY_LIST", newPlayback);
    commit("SET_PLAYLIST_TOKEN", newPlaybackToken);
    commit("SET_PLAYLIST_ID", newPlaybackId)
    commit("playback/SET_PLAYBACK_LIST", newPlayback);
    return true;
  },

  getPlaybackWithList({ commit, state }) {
    const playList = state.playList.list;
    commit("playback/SET_PLAYBACK_LIST", playList);
    return true;
  }

};

export default {
  state,
  getters,
  mutations,
  actions
};
