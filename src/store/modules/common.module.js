/*
* title:
* menu: 
* description: 
* author: 
*/

const state = {
  menuId: 0
};
const getters = {
  GET_MENU_ID: state => {
    return state.menuId;
  }
};
const mutations = {
  SET_MENU_ID(state, payload) {
    state.menuId = payload;
  }
};
const actions = {
  setMenuAsync({ commit }, { menuId }) {
    commit("SET_MENU_ID", menuId);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
