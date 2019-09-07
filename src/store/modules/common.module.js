/*
* title:
* menu: 
* description: 
* author: 
*/

const state = {
  menuId: 0,
  authKeys: [],
  isLoading: false
};
const getters = {
  GET_MENU_ID: state => {
    return state.menuId;
  },
  GET_SEARCH_KEY: state => {
    return state.authKeys[0]
  },
  GET_VIDEO_ITEMS_KEY: state => {
    return state.authKeys[1]
  },
  GET_IS_LOADING() {
    return state.isLoading;
  }
};
const mutations = {
  SET_MENU_ID(state, payload) {
    state.menuId = payload;
  },
  SET_AUTH_KEYS(state, payload) {
    state.authKeys = []
    state.authKeys = payload
  },
  SET_IS_LOADING(state, payload) {
    state.isLoading = payload;
  }
};
const actions = {

  setMenuAsync({ commit }, { menuId }) {
    commit("SET_MENU_ID", menuId);
  },

  setAuthKey({ commit }, { vm }) {
    commit('SET_IS_LOADING', true)
    return vm.$auth.get("cfb9d27f0b59d3fbc55073830f01db05").then(result => {
      const auth = result.auth
      const envType = process.env.NODE_ENV === "development" ? "dev" : "production"
      const service = vm._.find(auth, { type: envType })
      if (service.type === envType) {
        const keyList = service.key_list
        commit("SET_AUTH_KEYS", keyList)
        vm.$log.info('Commit API KEY | Done | ', state.authKeys)
      }
    })
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
