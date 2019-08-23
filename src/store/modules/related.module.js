const API_KEY = "AIzaSyAcNGab-jHH_79rEhgFFFy_4oS46yUMNds";

const state = {
    relatedInfo: {
        id: "",
        title: "",
        channelTitle: "",
        description: "",
        thumbnails: null
    },
    relatedList: {
        id: "",
        list: [],
        nextToken: "",
        type: "related"
    },
    playbackWaitList: {
        id: "",
        list: [],
        nextToken: "",
        type: "related"
    },
    relatedListTemp: {
        id: "",
        list: [],
        nextToken: "",
        type: "related"
    }
}
const getters = {
    GET_RELATED_ID: state => {
        return state.relatedList.id;
    },
    GET_RELATED_LIST: state => {
        return state.relatedList.list;
    },
    GET_RELATEDLIST_TOKEN: state => {
        return state.relatedList.nextToken;
    },
    GET_RELATEDLIST_INFO: state => {
        return state.relatedInfo;
    },
    GET_RELATED_PLAYBACK_WAIT_LIST: state => {
        return state.playbackWaitList.list;
    },
    GET_RELATED_PLAYBACK_WAIT_TOKEN: state => {
        return state.playbackWaitList.nextToken;
    },
    GET_TEMP_RELATED_ID: state => {
        return state.relatedListTemp.id;
    },
    GET_TEMP_RELATED_PLAYLIST: state => {
        return state.relatedListTemp.list;
    },
    GET_TEMP_RELATED_TOKEN: state => {
        return state.relatedListTemp.nextToken;
    }
}
const mutations = {
    SET_RELATED_LIST_ID(state, payload) {
        state.relatedList.id = payload
    },
    SET_RELATED_LIST_TOKEN(state, payload) {
        state.relatedList.nextToken = payload;
    }
}
const actions = {

    relatedInit({ commit, rootGetters }, { videoId, data }) {
        // 현재 재생중인 비디오 정보
        const playingVideoInfo = rootGetters.GET_PLAYING_VIDEO;
        const isPlaying = playingVideoInfo.isUse;
        return new Promise(resolve => {
            if (isPlaying) {
                const playingVideoId = playingVideoInfo.coverData.videoId;
                if (playingVideoId === videoId) {
                    commit("SET_RELATED_LIST_ID", videoId);
                    commit("SET_RELATED_LIST_TOKEN", data.nextPageToken);
                    resolve(true);
                } else {
                    // commit("SET_PLAYLIST_TEMP_ID", playlistId);
                    // commit("SET_PLAYLIST_TEMP_TOKEN", data.nextPageToken);
                    // resolve(false);
                }
            } else {
                commit("SET_RELATED_LIST_ID", videoId);
                commit("SET_RELATED_LIST_TOKEN", data.nextPageToken);
                resolve(true);
            }
        });
    },

    // 연관 재생목록 생성
    getRelatedList({ dispatch }, { vm, videoId }) {
        const params = {
            part: "snippet",
            type: "video",
            relatedToVideoId: videoId,
            maxResults: 25,
            key: API_KEY
        };
        return vm.axios
            .get('/search', { params: params })
            .then(({ data }) => {
                vm.$log.info('getRelatedList', data)
                // 연관 재생목록 아이디와 토큰을 먼저 세팅함.
                dispatch("relatedInit", { videoId: videoId, data: data })
                    .then(result => {
                        const type = result;
                        vm.$log.info('relatedInit | type | ', type);
                    })
            })
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}