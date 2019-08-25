// playback namespace enable

const state = {
    playbackList: {
        id: "",
        list: [],
        nextToken: "",
        playbackType: ""
    }
}
const getters = {
    GET_PLAYBACK_LIST: state => {
        return state.playbackList.list;
    },
    GET_PLAYBACK_TOKEN: state => {
        return state.playbackList.nextToken;
    },
}
const mutations = {
    SET_PLAYBACK_LIST(state, payload) {
        state.playbackList.list = payload;
    },
    SET_PLAYBACK_NEXTLOAD(state, { vm, data }) {
        state.playbackList.list = vm._.concat(
            state.playbackList.list,
            data
        );
    }
}
const actions = {
    setPlaybackList({ commit, state }, { data }) {
        commit("SET_PLAYBACK_LIST", data);
        return new Promise((resolve) => {
            if (state.playbackList.list.length > 0) {
                resolve(true)
            }
        })
    },

    getUpdatePlaybackWithList({ commit, state }) {
        const playbackWithList = state.playbackList.list;
        commit("SET_PLAYBACK_LIST", playbackWithList);
        return true
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}