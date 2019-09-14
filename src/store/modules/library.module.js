import { convertToSeconds, secondFormat } from "../../plugins/utils"

const state = {
    userData: {
        myRatingList: []
    }
}
const getters = {
    GET_MY_RATING_LIST: state => {
        return state.userData.myRatingList
    }
}
const mutations = {
    SET_MY_RATING_LIST(state, data) {
        state.userData.myRatingList = data
    }
}
const actions = {
    getMyRatingList({ dispatch, rootGetters }, { vm }) {
        let token = rootGetters['common/GET_ACCESS_TOKEN']
        const params = {
            part: 'snippet',
            myRating: 'like',
            maxResults: 30
        }
        vm.$axios
            .get('/videos', { headers: { Authorization: 'Bearer ' + token }, params })
            .then(({ data }) => {
                let videos = []
                vm._.forEach(data.items, (item, index) => {
                    let videoItem = Object.assign({}, item.snippet);
                    videoItem.videoId = item.id
                    videoItem.listIndex = index + 1;
                    delete videoItem.publishedAt;
                    videos.push(videoItem);
                    if ((data.items.length - 1) === index) {
                        vm.$log.info('getRelatedList | ', videos)
                        dispatch("getDuration",
                            {
                                vm: vm,
                                data: videos
                            }
                        )
                    }
                });
            })
    },

    getDuration({ commit, rootGetters }, { vm, data }) {
        const videoIds = vm._.map(data, "videoId");
        const apiKey = rootGetters['common/GET_SEARCH_KEY'].apiKey
        const url = `/videos?part=contentDetails,snippet&fields=items(id,contentDetails(duration))&id=${videoIds}&key=${apiKey}`;
        let array = [];
        vm.$axios.get(url).then(res => {
            vm._.forEach(data, item => {
                let videoId = item.videoId;
                vm._.forEach(res.data.items, videoIdArray => {
                    if (videoId === videoIdArray.id) {
                        item.duration_time = convertToSeconds(
                            videoIdArray.contentDetails.duration
                        );
                        item.duration = secondFormat(item.duration_time);
                    }
                });
                array.push(item);
            });
            commit('SET_MY_RATING_LIST', array)
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}