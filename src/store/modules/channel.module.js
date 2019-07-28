const API_KEY = "AIzaSyBXQrLCFWgip6navZZfww_LhsyjbaW0vIQ";

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
  getChannel({ commit }, { vm, channelId }) {
    const query = {
      part: "snippet",
      id: channelId,
      key: API_KEY
    };
    return vm.axios.get("/channels", { params: query }).then(({ data }) => {
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
