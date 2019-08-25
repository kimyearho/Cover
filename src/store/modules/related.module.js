const API_KEY = "AIzaSyBXQrLCFWgip6navZZfww_LhsyjbaW0vIQ";

const state = {
    relatedList: {
        id: "",
        list: [],
        type: "related"
    }
}
const getters = {
    GET_RELATED_ID: state => {
        return state.relatedList.id;
    }
}
const mutations = {
    SET_RELATED_LIST_ID(state, payload) {
        state.relatedList.id = payload
    }
}
const actions = {

    // 연관 재생목록 생성
    getRelatedList({ dispatch, commit }, { vm, videoId, firstVideoData }) {
        const params = {
            part: "snippet",
            type: "video",
            relatedToVideoId: videoId,
            maxResults: 15,
            key: API_KEY
        };
        return vm.$axios
            .get('/search', { params: params })
            .then(({ data }) => {
                commit("SET_RELATED_LIST_ID", videoId);
                const firstData = {
                    id: { videoId: firstVideoData.videoId },
                    snippet: {
                        channelId: firstVideoData.channel,
                        channelTitle: firstVideoData.channelTitle,
                        description: firstVideoData.description,
                        liveBroadcastContent: firstVideoData.liveBroadcastContent,
                        publishedAt: firstVideoData.publishedAt,
                        thumbnails: firstVideoData.thumbnails,
                        title: firstVideoData.title
                    }
                }
                data.items.unshift(firstData)
                let videos = [];
                vm._.forEach(data.items, (item, index) => {
                    let videoItem = Object.assign({}, item.snippet);
                    videoItem.videoId = item.id.videoId
                    videoItem.listIndex = index + 1;
                    delete videoItem.publishedAt;
                    videos.push(videoItem);
                    if ((data.items.length - 1) === index) {
                        vm.$log.info('getRelatedList | ', videos)
                        dispatch("getRelatedVideoDuration",
                            {
                                vm: vm,
                                data: videos
                            }
                        )
                    }
                });
            })
    },

    getRelatedVideoDuration({ commit }, { vm, data, type }) {
        const videoIds = vm._.map(data, "videoId");
        const url = `/videos?part=contentDetails,snippet&fields=items(id,contentDetails(duration))&id=${videoIds}&key=${API_KEY}`;
        let videos = [];
        vm.$axios.get(url).then(res => {
            vm._.forEach(data, (item, index) => {
                let videoId = item.videoId;
                vm._.forEach(res.data.items, videoIdArray => {
                    if (videoId === videoIdArray.id) {
                        item.duration_time = vm.convertToSeconds(
                            videoIdArray.contentDetails.duration
                        );
                        item.duration = vm.secondFormat(item.duration_time);
                    }
                });
                videos.push(item);
                if ((data.length - 1) === index) {
                    vm.$log.info('duration', videos)
                    commit("playback/SET_PLAYBACK_LIST", videos)
                }
            });
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}