/*
* title:
* menu: 
* description: 
* author: 
*/

const state = {
  menuId: 0,
  authKeys: [],
  token: {},
  user: {},
  userData: {
    ratingCount: 0,
    playlistCount: 0
  },
  cache: [],
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
  GET_IS_LOADING: state => {
    return state.isLoading;
  },
  GET_ACCESS_TOKEN: state => {
    return state.token.access_token
  },
  GET_REFRESH_TOKEN: state => {
    return state.token.refresh_token
  },
  GET_USER: state => {
    return state.user
  },
  GET_USER_RATING_COUNT: state => {
    return state.userData.ratingCount
  },
  GET_CACHE_URI: state => {
    return state.cache
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
  },
  SET_OAUTH2_TOKEN(state, payload) {
    state.token = payload
  },
  SET_USER(state, payload) {
    state.user = payload.data
  },
  SET_USER_RATING_COUNT(state, count) {
    state.userData.ratingCount = count
  },
  SET_CACHE_URI(state, data) {
    state.cache.push(data)
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

  async setOauth2Token({ commit, dispatch }, { vm, data }) {
    commit('SET_OAUTH2_TOKEN', await data)
    return dispatch('setUser', { vm: vm })
  },

  setUser({ state, commit }, { vm }) {
    return vm.$authAxios.get("/userinfo", {
      headers: { Authorization: 'Bearer ' + state.token.access_token }
    }).then(data => {
      commit('SET_USER', data)
    })
  },

  setUserRating({ commit, state }, { count }) {
    commit('SET_USER_RATING_COUNT', count)
    return new Promise((resolve) => {
      if (state.userData.ratingCount > 0) {
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
