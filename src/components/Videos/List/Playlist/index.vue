<template>
  <v-card>
    <video-info />
    <v-divider></v-divider>
    <draggable v-model="playlist" class="maxHeight">
      <!-- 검색목록 템플릿 -->
      <template v-for="(item, index, index1) in playlist">
        <v-list-tile :key="index1" avatar>
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
      <v-btn
        block
        :loading="loadMoreLoading"
        @click="loadMore"
        color="primary"
      >{{ isNextToken ? 'Load More' : 'End' }}</v-btn>
    </draggable>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import draggable from "vuedraggable";
import sMixin from "../../../Search/Mixin/mixin";
import VideoInfo from "../../Info/index";
import VideoMenu from "../../../Commons/Menu/videoMenu";

export default {
  name: "PlayList",
  mixins: [sMixin],
  components: {
    VideoInfo,
    draggable,
    VideoMenu
  },
  data() {
    return {
      show: false,
      loadMoreLoading: false
    };
  },
  watch: {
    "$route.params.id": {
      handler(val) {
        if (!this.id) {
          this.get();
        } else {
          if (this.id !== val) {
            this.get();
          } 
        }
      },
      deep: true,
      immediate: true
    }
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
  methods: {
    ...mapActions({
      getPlaylist: "getPlaylist",
      getNextList: "getPlaylistNextSearch"
    }),
    get() {
      const params = {
        vm: this,
        playlistId: this.$route.params.id
      };
      this.getPlaylist(params).then(() => {
        console.log("Done!");
      });
    },
    loadMore() {
      this.loadMoreLoading = true;
      setTimeout(() => {
        const param = {
          vm: this,
          playlistId: this.$route.params.id
        };
        this.getNextList(param);
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
.maxHeight {
  max-height: 225px;
  overflow-y: scroll;
}
.font-14 {
  font-size: 14px;
}
.font-12 {
  font-size: 12px;
}
</style>