/*
 * title:
 * menu:
 * description:
 * author:
 */

const state = {
  playingVideoInfo: {
    isUse: false,
    coverData: {
      channelId: "",
      playlistId: "",
      videoId: "",
      videoTitle: ""
    },
    thumbnails: null,
    playIndex: 0,
    duration: 0,
    durationTime: 0
  },
  playTime: 0,
  showPlayer: false
};
const getters = {
  GET_PLAYING_VIDEO: state => {
    return state.playingVideoInfo;
  },
  GET_SHOW_PLAYER: state => {
    return state.showPlayer;
  }
};
const mutations = {
  SET_SHOW_PLAYER(state, payload) {
    state.showPlayer = payload;
  },
  SET_PLAYING_VIDEO(state, payload) {
    state.playingVideoInfo.coverData.channelId = payload.channelId;
    state.playingVideoInfo.coverData.playlistId = payload.playlistId;
    state.playingVideoInfo.coverData.videoId = payload.videoId;
    state.playingVideoInfo.coverData.videoTitle = payload.title;
    state.playingVideoInfo.thumbnails = payload.thumbnails;
    state.playingVideoInfo.playIndex = payload.listIndex ? payload.listIndex : 1
    state.playingVideoInfo.duration = payload.duration;
    state.playingVideoInfo.durationTime = payload.duration_time;
    state.playingVideoInfo.isUse = true
  }
};
const actions = {
  playingVideoSetting({ commit, state }, { data }) {
    commit("SET_PLAYING_VIDEO", data);
    return new Promise((resolve) => {
      if (state.playingVideoInfo.isUse) {
        resolve(true)
      }
    })
  },
  playerSwitch({ commit }, { flag }) {
    commit("SET_SHOW_PLAYER", flag);
    return true
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
