/*
 * title:
 * menu:
 * description:
 * author:
 */

const state = {
  playingVideoInfo: {
    coverData: {
      channelId: "",
      playlistId: "",
      videoId: "",
      videoTitle: ""
    },
    thumbnails: null,
    playTime: 0,
    position: 0,
    duration: 0
  }
};
const getters = {
  GET_PLAYING_VIDEO: state => {
    return state.playingVideoInfo;
  }
};
const mutations = {
  SET_PLAYING_VIDEO(state, payload) {
    state.playingVideoInfo.coverData.channelId = payload.channelId
    state.playingVideoInfo.coverData.playlistId = payload.playlistId
    state.playingVideoInfo.coverData.videoId = payload.videoId
    state.playingVideoInfo.coverData.videoTitle = payload.title
    state.playingVideoInfo.thumbnails = payload.thumbnails
    state.playingVideoInfo.position = payload.position
    state.playingVideoInfo.duration = payload.duration
  }
};
const actions = {
  playingVideoSetting({ commit }, { data }) {
    commit("SET_PLAYING_VIDEO", data);
    return true
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
