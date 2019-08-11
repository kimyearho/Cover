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
    playIndex: 0,
    duration: 0
  },
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
    state.playingVideoInfo.playIndex = payload.listIndex
    state.playingVideoInfo.duration = payload.duration;
  }
};
const actions = {
  playingVideoSetting({ commit }, { data }) {
    commit("SET_PLAYING_VIDEO", data);
    return true;
  },
  playerSwitch({ commit }, { flag }) {
    commit("SET_SHOW_PLAYER", flag);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
