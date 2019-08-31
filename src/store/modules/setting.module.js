const state = {
    setting: {
        videoFrameVisible: false,
        mainFrameAlwaysTop: false
    }
}
const getters = {
    GET_SETTING_DATA: state => {
        return state.setting
    }
}
const mutations = {
    SET_VISIBLE_VIDEO_OPTION(state, data) {
        state.setting.videoFrameVisible = data
    },
    SET_MAINFRAME_ALWAYSTOP_OPTION(state, data) {
        state.setting.mainFrameAlwaysTop = data
    }
}
const actions = {
    setVisibleVideoOption({ commit }, { val }) {
        commit('SET_VISIBLE_VIDEO_OPTION', val)
    },
    setMainframeAlwaysTopOption({ commit }, { val }) {
        commit('SET_MAINFRAME_ALWAYSTOP_OPTION', val)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}