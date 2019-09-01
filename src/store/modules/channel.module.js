/*
* title:
* menu: 
* description: 
* author: 
*/

const state = {
  channelData: []
};
const getters = {
  GET_CHANNEL: state => {
    return state.channelData;
  }
};
const mutations = {
  SET_CHANNEL(state, payload) {
    state.channelData = payload;
  }
};
const actions = {
  getChannel({ commit, rootGetters }, { vm, channelId }) {
    const query = {
      part: "snippet",
      id: channelId,
      key: rootGetters.GET_VIDEO_ITEMS_KEY
    };
    return vm.$axios
      .get("/channels", { params: query })
      .then(({ data }) => {
        commit("SET_CHANNEL", data.items[0].snippet);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
