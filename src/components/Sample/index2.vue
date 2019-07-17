<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-img src="https://i.ytimg.com/vi/YU9kUGcJY60/maxresdefault.jpg" height="200px">
          <span class="avatar-right">
            <v-list-tile-avatar color="grey darken-3">
              <v-img
                class="elevation-6"
                src="https://yt3.ggpht.com/a/AGF-l79D9c7DKrI3x1bxLUh8IJydUgEm6xSRk0mFaA=s48-c-k-c0xffffffff-no-rj-mo"
              ></v-img>
            </v-list-tile-avatar>
          </span>
        </v-img>

        <v-card-title primary-title style="padding:10px !important;">
          <div class="headline">Shingeki no Kyojin (Attack on Titan) Season 3</div>
          <span class="grey--text">1,000 miles of wonder</span>
        </v-card-title>

        <!-- 검색목록 템플릿 -->
        <template v-for="(item, index, index1) in list">
          <v-list-tile :key="index1" avatar>
            <!-- 썸네일 -->
            <v-list-tile-avatar>
              <img :src="item.snippet.thumbnails.default.url" />
            </v-list-tile-avatar>

            <!-- 제목 및 라벨 -->
            <v-list-tile-content>
              <v-list-tile-title class="font-14" v-html="item.snippet.title"></v-list-tile-title>
              <v-list-tile-sub-title v-if="item.duration" class="font-12"></v-list-tile-sub-title>
            </v-list-tile-content>

            <!-- 확장메뉴 -->
            <v-list-tile-action>
              <video-menu :videoData="item" />
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import draggable from "vuedraggable";

import searchMixin from "../Search/Mixin/mixin";
import VideoMenu from "../Commons/Menu/videoMenu";

export default {
  name: "Sample2",
  mixins: [searchMixin],
  components: {
    draggable,
    VideoMenu
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapGetters({
      list: "GET_PLAY_LIST"
    })
  },
  created() {
    this.$store
      .dispatch("getPlaylist", {
        vm: this,
        playlistId: "PLzCxunOM5WFKZuBXTe8EobD6Dwi4qV-kO"
      })
      .then(() => {
        console.log("2");
      });
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
</style>