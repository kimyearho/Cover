<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <div class="sheet">
        <v-bottom-sheet v-model="visible" persistent>
          <v-card>
            <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px"></v-img>

            <v-card-title primary-title>
              <div>
                <div class="headline">Top western road trips</div>
                <span class="grey--text">1,000 miles of wonder</span>
              </div>
            </v-card-title>

            <v-card-actions>
              <v-btn flat>Share</v-btn>
              <v-btn flat color="purple" @click="$emit('playerClose')">Explore</v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click="show = !show">
                <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-divider></v-divider>

            <v-list>
              <template v-for="(item, index, index1) in playlist">
                <v-list-tile :key="index1" avatar @click="openPlayer(item)">
                  <!-- 썸네일 -->
                  <v-list-tile-avatar>
                    <img :src="item.thumbnails.default.url" />
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
              </template>
            </v-list>
          </v-card>
        </v-bottom-sheet>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Playerbar",
  props: {
    isVisible: false
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
      playlist: "GET_PLAY_LIST",
      isNextToken: "GET_PLAYLIST_TOKEN"
    }),
    playlist: {
      get() {
        return this.$store.getters.GET_PLAY_LIST;
      },
      set(val) {
        this.$store.commit("SET_D_PLAY_LIST", val);
      }
    }
  },
  watch: {
    isVisible(val) {
      this.visible = val;
    }
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="css" scoped>
.maxHeight {
  max-height: 310px;
  overflow-y: scroll;
}
.sheet >>> .v-bottom-sheet .v-dialog {
  flex: 0 !important;
  margin: none !important;
  overflow: scroll !important;
}
</style>