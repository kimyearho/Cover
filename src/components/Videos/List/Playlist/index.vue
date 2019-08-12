<template>
  <v-card>
    <video-info />
    <v-divider></v-divider>
    <!-- 검색목록 템플릿 -->
    <v-list class="max-height" :class="{playmaxheight:playingVideo.coverData.videoId}">
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
      <v-btn
        block
        :loading="loadMoreLoading"
        :disabled="loadMoreLoading || playlist.length >= 100 || !isNextToken"
        @click="loadMore"
        color="primary"
      >{{ isNextToken ? 'Load More' : 'End' }}</v-btn>
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
      id: "GET_ID",
      playlist: "GET_PLAY_LIST",
      isNextToken: "GET_PLAYLIST_TOKEN",
      playingVideo: "GET_PLAYING_VIDEO"
    })
  },
  methods: {
    ...mapActions({
      getPlaylistDispatch: "getPlaylist",
      getNextListDispatch: "getPlaylistNextSearch",
      setPlayerSwitchDispatch: "playerSwitch",
      setVideoSettingDispatch: "playingVideoSetting"
    }),
    get() {
      const params = {
        vm: this,
        playlistId: this.$route.params.id
      };
      this.getPlaylistDispatch(params).then(() => {
        this.$log.info("Done!");
      });
    },
    openPlayer(item) {
      this.setVideoSettingDispatch({ data: item }).then(() => {
        this.setPlayerSwitchDispatch({ flag: true }).then(() => {
          this.ipcSendPlayVideo(item);
        });
      });
    },
    loadMore() {
      this.loadMoreLoading = true;
      setTimeout(() => {
        const param = {
          vm: this,
          playlistId: this.$route.params.id
        };
        this.getNextListDispatch(param);
      }, 1000);
    }
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
  max-height: 253px !important;
}
</style>