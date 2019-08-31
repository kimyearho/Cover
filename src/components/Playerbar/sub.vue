<template>
  <div class="text-xs-center" v-if="playingVideo.coverData.videoId && !isPlayer">
    <v-card tile class="frame">
      <v-progress-linear :value="playTime" class="my-0" height="3"></v-progress-linear>

      <v-list>
        <v-list-tile @click="switchOnPlayer">
          <v-list-tile-avatar>
            <img :src="getThumbnail" />
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ playingVideo.coverData.videoTitle }}</v-list-tile-title>
            <v-list-tile-sub-title>Youtube & Cover</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-spacer></v-spacer>

          <v-list-tile-action :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
            <v-btn icon @click.native.stop="playToggle">
              <v-icon>{{ playStatusIcon }}</v-icon>
            </v-btn>
          </v-list-tile-action>

          <v-list-tile-action :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }">
            <v-btn icon @click.native.stop="nextVideo">
              <v-icon>fast_forward</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import playerMixin from "./Mixin/mixin";

export default {
  name: "SubPlayerBar",
  mixins: [playerMixin],
  data() {
    return {
      visible: true,
      playTime: 0
    };
  },
  computed: {
    ...mapGetters({
      playingVideo: "GET_PLAYING_VIDEO",
      playStatus: "GET_PLAYER_STATUS",
      playbackWaitList: "playback/GET_PLAYBACK_LIST",
      isPlayer: "GET_SHOW_PLAYER"
    }),
    getThumbnail() {
      const videoInfo = this.playingVideo.thumbnails;
      return videoInfo === null ? "" : videoInfo.medium.url;
    }
  },
  mounted() {
    this.$event.$on("currentTime", this.currentTime);
  },
  methods: {
    ...mapActions({
      setPlayerSwitchDispatch: "playerSwitch",
      setVideoSettingDispatch: "playingVideoSetting",
      setListUpdateDispatch: "playback/setUpdatePlaybackList"
    }),

    switchOnPlayer() {
      this.setPlayerSwitchDispatch({ flag: true });
    }
  }
};
</script>

<style lang="css" scoped>
.frame {
  width: 100%;
  position: absolute;
  top: 566px;
  border-bottom: 1px solid #ddd;
  -webkit-box-shadow: unset;
  box-shadow: unset;
}
.v-list {
  padding: 3px 0 3px;
}
</style>