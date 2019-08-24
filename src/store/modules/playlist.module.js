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
    nextToken: "",
    type: "playlist"
  },
  playbackWaitList: {
    id: "",
    list: [],
    nextToken: "",
    type: "playlist"
  },
  playListTemp: {
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
  },
  GET_PLAYBACK_WAIT_LIST: state => {
    return state.playbackWaitList.list;
  },
  GET_PLAYBACK_WAIT_TOKEN: state => {
    return state.playbackWaitList.nextToken;
  },
  GET_TEMP_ID: state => {
    return state.playListTemp.id;
  },
  GET_TEMP_PLAYLIST: state => {
    return state.playListTemp.list;
  },
  GET_TEMP_PLAYLIST_TOKEN: state => {
    return state.playListTemp.nextToken;
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
  },
  SET_PLAYBACK_NEXTLOAD(state, { vm, data }) {
    state.playbackWaitList.list = vm._.concat(
      state.playbackWaitList.list,
      data
    );
  },
  SET_PLAYLIST_TEMP_ID(state, payload) {
    state.playListTemp.id = payload;
  },
  SET_PLAYLIST_TEMP(state, payload) {
    state.playListTemp.list = payload;
  },
  SET_PLAYLIST_TEMP_TOKEN(state, payload) {
    state.playListTemp.nextToken = payload;
  },
  SET_PLAYLIST_TEMP_NEXTLOAD(state, { vm, data }) {
    state.playListTemp.list = vm._.concat(state.playListTemp.list, data);
  },
  SET_PLAYLIST_TEMP_CLEAR(state) {
    state.playListTemp.id = ""
    state.playListTemp.list = []
    state.playListTemp.nextToken = ""
  }
};

const actions = {
  playlistInit({ commit, rootGetters }, { playlistId, data }) {
    // 현재 재생중인 비디오 정보
    const playingVideoInfo = rootGetters.GET_PLAYING_VIDEO;
    const isPlaying = playingVideoInfo.isUse;
    return new Promise(resolve => {
      if (isPlaying) {
        const playingVideoListId = playingVideoInfo.coverData.playlistId;
        if (playingVideoListId === playlistId) {
          commit("SET_PLAYLIST_ID", playlistId);
          commit("SET_PLAYLIST_TOKEN", data.nextPageToken);
          resolve(true);
        } else {
          commit("SET_PLAYLIST_TEMP_ID", playlistId);
          commit("SET_PLAYLIST_TEMP_TOKEN", data.nextPageToken);
          resolve(false);
        }
      } else {
        commit("SET_PLAYLIST_ID", playlistId);
        commit("SET_PLAYLIST_TOKEN", data.nextPageToken);
        resolve(true);
      }
    });
  },

  getPlaylist({ dispatch }, { vm, playlistId }) {
    const params = {
      part: "snippet",
      playlistId: playlistId,
      maxResults: 25,
      key: API_KEY
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

  getPlaylistNextSearch({ commit, dispatch, state }, { vm, playlistId, type }) {
    let nextToken = "";

    if (type === "") {
      vm.$log.info("재생중 아님, 페이징 조회");
      nextToken = state.playList.nextToken;
    } else if (type) {
      vm.$log.info("재생중, 동일 재생목록 페이징 조회");
      nextToken = state.playList.nextToken;
    } else if (!type) {
      vm.$log.info("재생중, 임시 재생목록 페이징 조회");
      nextToken = state.playListTemp.nextToken;
    }

    const queryParams = {
      part: "snippet",
      playlistId: playlistId,
      maxResults: 25,
      pageToken: nextToken,
      key: API_KEY
    };

    vm.$axios.get(`/playlistItems`, { params: queryParams }).then(({ data }) => {
      let playlist,
        listMaxIndex = "";
      if (type === "" || type === true) {
        playlist = state.playList.list;
        listMaxIndex = playlist[playlist.length - 1].listIndex;
        commit("SET_PLAYLIST_TOKEN", data.nextPageToken);
      } else if (!type) {
        playlist = state.playListTemp.list;
        listMaxIndex = playlist[playlist.length - 1].listIndex;
        commit("SET_PLAYLIST_TEMP_TOKEN", data.nextPageToken);
      }
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
    const url = `/videos?part=contentDetails,snippet&fields=items(id,contentDetails(duration))&id=${videoIds}&key=${API_KEY}`;

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
            if (type === "" || type === true) {
              vm.$log.info("원본 재생목록의 저장");
              commit("SET_PLAY_LIST", array);
              if (!isPlaying) {
                commit("SET_PLAYBACK_WAIT_LIST", array);
              }
            } else {
              vm.$log.info("임시 재생목록의 저장");
              commit("SET_PLAYLIST_TEMP", array);
            }
          } else {
            // 페이징 조회 일대
            if (type === "" || type === true) {
              commit("SET_PLAYLIST_NEXTLOAD", { vm: vm, data: array });
              commit("SET_PLAYBACK_NEXTLOAD", { vm: vm, data: array });
            } else {
              commit("SET_PLAYLIST_TEMP_NEXTLOAD", { vm: vm, data: array });
            }
            vm.loadMoreLoading = false;
          }
        }
      });

    });
  },

  getNewUpdatePlayback({ commit, state }) {
    const newPlayback = state.playListTemp.list;
    const newPlaybackToken = state.playListTemp.nextToken;
    const newPlaybackId = state.playListTemp.id
    commit("SET_PLAY_LIST", newPlayback);
    commit("SET_PLAYLIST_TOKEN", newPlaybackToken);
    commit("SET_PLAYLIST_ID", newPlaybackId)
    commit("SET_PLAYBACK_WAIT_LIST", newPlayback);
    commit("SET_PLAYLIST_TEMP_CLEAR")
    return true;
  },

  getPlaybackWithList({ commit, state }) {
    const playList = state.playList.list;
    commit("SET_PLAYBACK_WAIT_LIST", playList);
    return true;
  },

  getUpdatePlaybackWithList({ commit, state }) {
    const playbackWithList = state.playbackWaitList.list;
    commit("SET_PLAYBACK_WAIT_LIST", playbackWithList);
    return true
  },

  updateRelatedPlaybackWithList({ commit, state }, { data }) {
    const playbackWithList = data;
    commit("SET_PLAYBACK_WAIT_LIST", playbackWithList);
    return new Promise((resolve) => {
      if (state.playbackWaitList.list.length > 0) {
        resolve(true)
      }
    })
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
