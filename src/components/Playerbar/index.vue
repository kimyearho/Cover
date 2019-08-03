<template>
  <v-layout row justify-center>
    <v-dialog v-model="visible" transition="dialog-bottom-transition" scrollable persistent>
      <v-card>
        <v-img :src="playingVideo.thumbnails.high.url" height="200px"></v-img>

        <v-card-title primary-title>
          <div class="playing-video-title">{{ playingVideo.coverData.videoTitle }}</div>
        </v-card-title>

        <v-card-actions>
          <v-btn flat>Share</v-btn>
          <v-btn flat color="purple" @click="$emit('playerClose')">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-divider></v-divider>

        <draggable tag="v-list" v-model="playerList" handle=".handle">
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
      show: true
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
</style>