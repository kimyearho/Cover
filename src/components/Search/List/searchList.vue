  <template>
  <v-card>
    <v-list subheader class="pd-0">
      <!-- 부제목 -->
      <v-subheader class="subheader">
        <v-icon>search</v-icon>
        <span>Youtube Search list</span>
      </v-subheader>

      <!-- 검색목록 템플릿 -->
      <template v-for="(item, index) in searchList">
        <v-list-tile :key="index" avatar @click="detail(item)">
          <!-- 썸네일 -->
          <v-list-tile-avatar>
            <img :src="getThumbnail(item)" />
          </v-list-tile-avatar>

          <!-- 제목 및 라벨 -->
          <v-list-tile-content>
            <v-list-tile-title class="font-14" v-html="item.title"></v-list-tile-title>
            <v-list-tile-sub-title v-if="item.duration" class="font-12">{{ item.duration }}</v-list-tile-sub-title>
            <v-list-tile-sub-title
              v-else-if="item.liveBroadcastContent !== 'none'"
              class="font-12 label-live"
            >{{ item.liveBroadcastContent }}</v-list-tile-sub-title>
            <v-list-tile-sub-title
              v-else-if="item.playlistId"
              class="font-12 label-playlist"
            >Playlist</v-list-tile-sub-title>
            <v-list-tile-sub-title v-else-if="item.channelId" class="font-12 label-channel">Channel</v-list-tile-sub-title>
          </v-list-tile-content>

          <!-- 확장메뉴 -->
          <v-list-tile-action>
            <video-menu :videoData="item" />
          </v-list-tile-action>
        </v-list-tile>

        <!-- 구분선 -->
        <v-divider v-if="index + 1 < searchList.length" :key="`item${index}`"></v-divider>
      </template>
      <v-btn
        block
        :loading="loadMoreLoading"
        :disabled="loadMoreLoading || searchList.length >= 200"
        @click="loadMore"
        color="primary"
      >{{ isNextToken ? 'Load More' : 'End' }}</v-btn>
    </v-list>
    <!-- 로딩 -->
    <loading :active.sync="isLoading" :is-full-page="true" loader="bars" color="#007bff" />
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Loading from "vue-loading-overlay";
import SearchMixin from "../Mixin/mixin";
import playerMixin from "../../Playerbar/Mixin/mixin";
import VideoMenu from "../../Commons/Menu/videoMenu";
export default {
  name: "List",
  mixins: [SearchMixin, playerMixin],
  components: {
    VideoMenu,
    Loading
  },
  data() {
    return {
      loadMoreLoading: false
    };
  },
  computed: {
    ...mapGetters({
      searchList: "GET_SEARCH_LIST",
      isNextToken: "GET_NEXT_TOKEN",
      playingVideo: "GET_PLAYING_VIDEO",
      isLoading: "GET_IS_LOADING"
    }),
    isLoading: {
      get() {
        return this.$store.getters.GET_IS_LOADING;
      },
      set(val) {
        this.$store.commit("SET_IS_LOADING", val);
      }
    },
    getThumbnail() {
      return item => {
        return item.thumbnails
          ? item.thumbnails.medium.url
          : "https://i.imgur.com/4MqP8kE.jpg";
      };
    }
  },
  mounted() {
    this.get();
  },
  methods: {
    ...mapActions({
      getListDispatch: "getApiSearch",
      getPlaylistDispatch: "getPlaylist",
      getChannelDispatch: "getChannel",
      getRelatedListDispatch: "getRelatedList",
      loadMoreDispatch: "getApiNextloadSearch",
      setPlayerSwitchDispatch: "playerSwitch",
      setVideoSettingDispatch: "playingVideoSetting"
    }),

    get() {
      // 처음 조회
      if (this.searchList.length === 0) {
        const params = { vm: this };
        this.getListDispatch(params);
      }
    },

    detail(data) {
      // 재생타입 구분
      const playType = this.playTypeReturn(data);
      // 나중에 아래 메소드 합칠것.
      if (playType === "Playlist") {
        this.playlistDetail(data, playType);
      } else if (playType === "Channel") {
        this.channelDetail(data, playType);
      } else if (playType === "Related") {
        this.$store.commit("SET_PLAYLIST_INFO", data);
        this.videoListSetting(data, playType);
      }
    },

    playlistDetail(data, playType) {
      this.$store.commit("SET_PLAYLIST_INFO", data);
      // 현재 재생중인 비디오가 있는지?
      const playingVideo = this.playingVideo;
      if (playingVideo.isUse) {
        const tempId = this.$store.getters.GET_TEMP_ID;
        if (playingVideo.coverData.playlistId === data.playlistId) {
          this.routeVideoListDetail(data, playType);
        } else {
          if (tempId !== "" && tempId === data.playlistId) {
            this.routeVideoListDetail(data, playType);
          } else {
            // 재생중인 비디오 없음, 처음실행
            this.videoListSetting(data, playType);
          }
        }
      } else {
        this.videoListSetting(data, playType);
      }
    },

    channelDetail(data) {
      this.$log.info(data);
    },

    videoListSetting(data, playType) {
      let params = { vm: this };
      if (playType === "Playlist") {
        params.playlistId = data.playlistId;
        this.getPlaylistDispatch(params).then(() => {
          if (data.channel) {
            this.getChannelDispatch({
              vm: this,
              channelId: data.channel
            }).then(() => {
              this.routeVideoListDetail(data, playType);
            });
          } else {
            this.routeVideoListDetail(data, playType);
          }
        });
      } else if (playType === "Related") {
        params.videoId = data.videoId;
        params.firstVideoData = data;
        this.isLoading = true;
        this.getRelatedListDispatch(params).then(() => {
          setTimeout(() => {
            this.setVideoSettingDispatch({ data: data }).then(result => {
              if (result) {
                this.setPlayerSwitchDispatch({ flag: true }).then(() => {
                  this.isLoading = false;
                  this.ipcSendPlayVideo(data);
                });
              }
            });
          }, 200);
        });
      }
    },

    routeVideoListDetail(data, playType) {
      let videoListId = "";
      if (playType === "Playlist") {
        videoListId = data.playlistId;
      } else if (playType === "Channel") {
        // videoListId = data.channelId;
      }
      this.$router.push({
        name: playType,
        params: {
          id: videoListId
        }
      });
    },

    loadMore() {
      this.loadMoreLoading = true;
      setTimeout(() => {
        const param = { vm: this };
        this.loadMoreDispatch(param);
      }, 1000);
    },

    playTypeReturn(data) {
      let playType = "";
      if (data.duration) {
        playType = "Related";
      } else if (data.liveBroadcastContent !== "none") {
        playType = "Live";
      } else if (data.playlistId) {
        playType = "Playlist";
      } else if (data.channelId) {
        playType = "Channel";
      }
      return playType;
    }
  }
};
</script>

<style lang="css" scoped>
.subheader {
  color: #ffffff !important;
  background: #d81b60;
}
.subheader i {
  color: #ffffff !important;
}
.subheader span {
  margin-left: 10px;
}
.font-14 {
  font-size: 14px;
}
.font-12 {
  font-size: 12px;
}
.label-channel {
  font-weight: 700;
  color: #3949ab !important;
}
.label-playlist {
  font-weight: 700;
  color: #00897b !important;
}
.label-live {
  font-weight: 700;
  color: #e53935 !important;
}
.pd-0 {
  padding: 0px;
}
</style>