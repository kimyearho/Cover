import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie';

import Vue from "vue"
import Vuex from "vuex"
import modules from "./modules"
Vue.use(Vuex)

const options = {
  storage: {
    getItem: key => Cookies.get(key),
    setItem: (key, value) => Cookies.set(key, value, { secure: false }),
    removeItem: key => Cookies.remove(key)
  },
  'paths': ['common.authKeys', 'common.token', 'common.user']
}

const store = new Vuex.Store({
  modules,
  strict: false,
  plugins: [createPersistedState(options)]
})

export default store
