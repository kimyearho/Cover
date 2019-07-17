const API_KEY = "AIzaSyBXQrLCFWgip6navZZfww_LhsyjbaW0vIQ";

const state = {
  playList: {
    list: [],
    nextToken: ""
  },
  channelList: {
    list: [],
    nextToken: ""
  },
  relatedList: {
    list: [],
    nextToken: ""
  }
};

const getters = {
  GET_PLAY_LIST: state => {
    return state.playList.list
  }
};

const mutations = {
  SET_PLAY_LIST(state, payload) {
    state.playList.list = payload.items;
    state.playList.nextToken = payload.nextPageToken;
  }
};

const actions = {
  getPlaylist({ commit }, { vm, playlistId }) {
    const params = {
      part: "snippet",
      playlistId: playlistId,
      maxResults: 30,
      key: API_KEY
    };
    return vm.axios
      .get("/playlistItems", { params: params })
      .then(({ data }) => {
        commit("SET_PLAY_LIST", data);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
