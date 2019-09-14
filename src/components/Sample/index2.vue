<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <!-- 부제목 -->
        <v-subheader class="subheader">
          <v-icon style="color:#ffffff;">library_music</v-icon>
          <span style="margin-left: 10px;">Library</span>
        </v-subheader>

        <v-btn @click="login" v-show="!isVisible">
          <v-icon>close</v-icon>Login
        </v-btn>

        <v-list subheader>
          <v-subheader>User information</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="userData.picture" />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ userData.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ userData ? userData.email : '' }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider />

        <v-list subheader :style="listStyle">
          <template v-for="(item, index) in userRatingList">
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
                <v-list-tile-sub-title
                  v-else-if="item.channelId"
                  class="font-12 label-channel"
                >Channel</v-list-tile-sub-title>
              </v-list-tile-content>

              <!-- 확장메뉴 -->
              <v-list-tile-action>
                <!-- <video-menu :videoData="item" /> -->
              </v-list-tile-action>
            </v-list-tile>

            <!-- 구분선 -->
            <v-divider v-if="index + 1 < userRatingList.length" :key="`item${index}`"></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import playerMixin from "../Playerbar/Mixin/mixin";

export default {
  name: "Library",
  mixins: [playerMixin],
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapGetters({
      userData: "common/GET_USER",
      playingVideo: "GET_PLAYING_VIDEO"
    }),
    userRatingList: {
      get() {
        return this.$store.getters.GET_MY_RATING_LIST;
      },
      set(val) {
        this.$store.commit("SET_MY_RATING_LIST", val);
      }
    },
    isVisible() {
      return this.userData.id ? true : false;
    },
    getThumbnail() {
      return item => {
        return item.thumbnails
          ? item.thumbnails.medium.url
          : "https://i.imgur.com/4MqP8kE.jpg";
      };
    },
    listStyle() {
      if (this.playingVideo.isUse) {
        return {
          maxHeight: "330px",
          overflowY: "scroll"
        };
      } else {
        return {
          maxHeight: "390px",
          overflowY: "scroll"
        };
      }
    }
  },
  mounted() {
    if (this.isElectron) {
      this.ipcRenderer.on("googleOauth2_callback", (ev, data) => {
        this.successOnCallback(data);
      });
    }
  },
  methods: {
    ...mapActions({
      getRelatedListDispatch: "getRelatedList",
      setPlayerSwitchDispatch: "playerSwitch",
      setVideoSettingDispatch: "playingVideoSetting"
    }),

    login() {
      this.ipcRenderer.send("googleOauth2");
    },

    detail(data) {
      this.$store.commit("SET_PLAYLIST_INFO", data);
      let params = { vm: this };
      params.videoId = data.videoId;
      params.firstVideoData = data;

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
    },

    successOnCallback(data) {
      this.$store
        .dispatch("common/setOauth2Token", { data: data.result })
        .then(() => {
          const token = "Bearer " + data.result.access_token;
          this.$log.info(token);
          this.$authAxios
            .get("/userinfo", {
              headers: { Authorization: token }
            })
            .then(data => {
              this.$store.commit("common/SET_USER", data);
              this.$store.dispatch("getMyRatingList", { vm: this }).then(() => {
                setTimeout(() => {
                  this.userRatingList = this.$store.getters.GET_MY_RATING_LIST;
                  this.$log.info(data);
                }, 1500);
              });
              this.$log.info("userInfo | ", data);
            });
        });
    }
  }
};
</script>

<style lang="css" scoped>
.container2 {
  max-width: 400px !important;
  max-height: 500px;
  margin: auto !important;
  overflow-y: scroll;
}
.subheader {
  color: #ffffff !important;
  background: #039be5;
}
</style>