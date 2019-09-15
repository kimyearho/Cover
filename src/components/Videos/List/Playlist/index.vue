<template>
  <v-card>
    <video-info />
    <v-divider></v-divider>
    <!-- 검색목록 템플릿 -->
    <v-list
      :style="{background: '#f5f5f59c'}"
      class="max-height"
      :class="{playmaxheight:playingVideo.coverData.videoId}"
    >
      <template v-for="(item, index) in playlist">
        <v-list-tile :key="index" avatar @click="openPlayer(item)">
          <!-- 썸네일 -->
          <v-list-tile-avatar>
            <img :src="item.thumbnails.medium.url" />
          </v-list-tile-avatar>

          <!-- 제목 및 라벨 -->
          <v-list-tile-content>
            <v-list-tile-title class="font-14" v-html="item.title"></v-list-tile-title>
            <v-list-tile-sub-title v-if="item.duration" class="font-12">{{ item.duration }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <!-- 확장메뉴 -->
          <v-list-tile-action>
            <video-menu :videoData="item" />
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index + 1 < playlist.length" :key="`item${index}`"></v-divider>
      </template>
      <!-- <v-btn
        block
        :loading="loadMoreLoading"
        :disabled="loadMoreLoading || playlist.length >= 100 || !isNextToken"
        @click="loadMore"
        color="primary"
      >{{ isNextToken ? 'Load More' : 'End' }}</v-btn>-->
    </v-list>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import playerMixin from "../../../Playerbar/Mixin/mixin";
import searchMixin from "../../../Search/Mixin/mixin";
import VideoInfo from "../../Info/index";
import VideoMenu from "../../../Commons/Menu/videoMenu";

export default {
  name: "PlayList",
  mixins: [searchMixin, playerMixin],
  components: {
    VideoInfo,
    VideoMenu
  },
  data() {
    return {
      show: false,
      showPlayer: false,
      loadMoreLoading: false
    };
  },
  computed: {
    ...mapGetters({
      playlist: "GET_PLAY_LIST",
      isNextToken: "GET_PLAYLIST_TOKEN",
      playingVideo: "GET_PLAYING_VIDEO"
    })
  },
  methods: {
    ...mapActions({
      getPlaylistDispatch: "getPlaylist",
      getNextListDispatch: "getPlaylistNextSearch",
      getPlaybackDispatch: "getPlaybackWithList",
      getNewUpdatePlaybackDispatch: "getNewUpdatePlayback",
      setPlayerSwitchDispatch: "playerSwitch",
      setVideoSettingDispatch: "playingVideoSetting"
    }),
    openPlayer(item) {
      if (this.playingVideo.isUse) {
        this.$log.info("현재 재생중인가?", true);
        const playingListId = this.playingVideo.coverData.playlistId;
        const routePlaylistId = this.$route.params.id;
        if (routePlaylistId === playingListId) {
          this.$log.info("재생 목록 동일함, 재생 대기 목록 갱신 후 재생");
          this.getPlaybackDispatch().then(() => {
            this.setVideoSettingDispatch({ data: item }).then(() => {
              this.setPlayerSwitchDispatch({ flag: true }).then(() => {
                this.ipcSendPlayVideo(item);
              });
            });
          });
        } else {
          this.$log.info("재생 목록 다름, 재생 대기 목록 갱신 후 재생");
          this.getNewUpdatePlaybackDispatch().then(() => {
            this.setVideoSettingDispatch({ data: item }).then(() => {
              this.setPlayerSwitchDispatch({ flag: true }).then(() => {
                this.ipcSendPlayVideo(item);
              });
            });
          });
        }
      } else {
        // 최초, 재생중이 아닐때
        this.$log.info("현재 재생중이지 않음", false);
        this.setVideoSettingDispatch({ data: item }).then(() => {
          this.setPlayerSwitchDispatch({ flag: true }).then(() => {
            this.ipcSendPlayVideo(item);
          });
        });
      }
    }
    // loadMore() {
    //   this.loadMoreLoading = true;
    //   const routePlaylistId = this.$route.params.id;
    //   this.$log.info("현재 재생목록 아이디", routePlaylistId);
    //   setTimeout(() => {
    //     let param = {
    //       vm: this,
    //       playlistId: routePlaylistId,
    //       type: ""
    //     };
    //     if (this.playingVideo.isUse) {
    //       const playingListId = this.playingVideo.coverData.playlistId;
    //       this.$log.info("현재 재생중인가?", true);
    //       this.$log.info("재생중인 재생목록 아이디", playingListId);
    //       if (playingListId) {
    //         // 동일한 재생목록 일 경우
    //         if (playingListId === routePlaylistId) {
    //           this.$log.info("동일한 재생목록");
    //           param.type = true;
    //         } else {
    //           this.$log.info("동일하지 않은 재생목록");
    //           param.type = false;
    //         }
    //       } else {
    //         this.$log.info("재생목록이 아님");
    //         param.type = false;
    //       }
    //       this.getNextListDispatch(param);
    //     } else {
    //       this.$log.info("현재 재생중인가?", false);
    //       this.getNextListDispatch(param);
    //     }
    //   }, 1000);
    // }
  }
};
</script>

<style lang="css" scoped>
.subheader {
  color: #ffffff !important;
  background: #d32f2f;
}
.avatar-right {
  float: right;
  margin-top: 10px;
}
.headline {
  font-size: 17px !important;
  line-height: 32px !important;
}
.grow >>> .v-list__tile {
  padding: 0px !important;
}
.max-height {
  max-height: 310px;
  overflow-y: scroll;
}
.playmaxheight {
  max-height: 230px !important;
}
</style>