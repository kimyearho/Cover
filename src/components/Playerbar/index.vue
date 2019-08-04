<template>
  <v-layout row justify-center>
    <v-dialog v-model="visible" transition="dialog-bottom-transition" scrollable persistent>
      <v-card>
        <v-img :src="playingVideo.thumbnails.high.url" class="thumb"></v-img>

        <v-progress-linear color="error" height="3" value="50"></v-progress-linear>

        <v-card-title primary-title>
          <div class="playing-video-title">{{ playingVideo.coverData.videoTitle }}</div>
        </v-card-title>

        <v-list>
          <v-list-tile class="item-center">
            <v-list-tile-action class="paly-icon-margin">
              <v-btn icon>
                <v-icon class="font-40">fast_rewind</v-icon>
              </v-btn>
            </v-list-tile-action>

            <v-list-tile-action class="paly-icon-margin">
              <v-btn icon>
                <v-icon class="font-40">pause</v-icon>
              </v-btn>
            </v-list-tile-action>

            <v-list-tile-action class="paly-icon-margin">
              <v-btn icon>
                <v-icon class="font-40">fast_forward</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <v-card-actions class="volume-slider">
          <v-icon class="volume-down">volume_down</v-icon>
          <v-slider class="margin-0" v-model="max"></v-slider>
          <v-icon class="volume-up">volume_up</v-icon>
        </v-card-actions>

        <v-card-actions>
          <v-btn flat>Share</v-btn>
          <v-btn flat color="purple" @click="$emit('playerClose')">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-divider></v-divider>

        <draggable tag="v-list" v-model="playerList" class="list-bg" handle=".handle">
          <template v-for="(item, index) in playerList">
            <v-list-tile :key="index" avatar @click="none">
              <!-- 썸네일 -->
              <v-list-tile-avatar>
                <img :src="item.thumbnails.default.url" />
              </v-list-tile-avatar>

              <!-- 제목 및 라벨 -->
              <v-list-tile-content class="cursor">
                <v-list-tile-title class="font-13" v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-if="item.duration" class="font-12">{{ item.duration }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <!-- 확장메뉴 -->
              <v-list-tile-action>
                <v-icon class="cursor handle">menu</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </draggable>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import draggable from "vuedraggable";

export default {
  name: "Playerbar",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    draggable
  },
  data() {
    return {
      visible: false,
      show: true,
      max: 50
    };
  },
  computed: {
    ...mapGetters({
      id: "GET_ID",
      playingVideo: "GET_PLAYING_VIDEO",
      playerList: "GET_PLAYER_LIST",
      isNextToken: "GET_PLAYERLIST_TOKEN"
    }),
    playerList: {
      get() {
        return this.$store.getters.GET_PLAYER_LIST;
      },
      set(val) {
        this.$store.commit("SET_PLAYER_LIST", val);
      }
    }
  },
  watch: {
    isVisible(val) {
      this.visible = val;
    }
  },
  methods: {
    none() {}
  },
  mounted() {}
};
</script>

<style scoped>
.thumb {
  height: 200px;
  /* margin: 2px; */
}
.v-progress-linear {
  background: transparent;
  margin: unset;
  overflow: unset;
  width: 100%;
  position: relative;
}
.v-progress-linear__background {
  position: absolute;
  /* top: 200px; */
  left: 0;
  bottom: 0;
  -webkit-transition: 0.3s ease-in;
  transition: 0.3s ease-in;
  background: transparent;
}
.item-center {
  margin: 0 50px;
}
.paly-icon-margin {
  margin: 0 15px;
}
.margin-0 {
  margin-top: 0;
}
.volume-slider {
  margin: 0 30px;
}
.volume-down {
  margin-right: 10px;
  margin-bottom: 20px;
  font-size: 20px;
}
.volume-up {
  margin-left: 10px;
  margin-bottom: 20px;
  font-size: 20px;
}
.list-bg {
  background: #f5f5f5;
}
</style>