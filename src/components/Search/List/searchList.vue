  <template>
  <v-card>
    <v-list subheader class="pd-0">
      <!-- 부제목 -->
      <v-subheader class="subheader">
        <v-icon>search</v-icon>
        <span>Youtube Search list</span>
      </v-subheader>

      <!-- 검색목록 템플릿 -->
      <template v-for="(item, index) in list">
        <v-list-tile :key="index" avatar @click="detail(item)">
          <!-- 썸네일 -->
          <v-list-tile-avatar>
            <img :src="item.thumbnails.medium.url" />
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
        <v-divider v-if="index + 1 < list.length" :key="`item${index}`"></v-divider>
      </template>
      <v-btn
        block
        :loading="loadMoreLoading"
        :disabled="loadMoreLoading || list.length >= 100"
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
import VideoMenu from "../../Commons/Menu/videoMenu";
export default {
  name: "List",
  mixins: [SearchMixin],
  components: {
    VideoMenu,
    Loading
  },
  data() {
    return {
      loadMoreLoading: false,
      modal: {
        menu: false
      }
    };
  },
  computed: {
    ...mapGetters({
      id: "GET_ID",
      list: "GET_SEARCH_LIST",
      isNextToken: "GET_NEXT_TOKEN",
      isLoading: "GET_IS_LOADING"
    }),
    isLoading: {
      get() {
        return this.$store.getters.GET_IS_LOADING;
      },
      set(val) {
        this.$store.commit("SET_IS_LOADING", val);
      }
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
      loadMoreDispatch: "getApiNextloadSearch"
    }),

    get() {
      // 처음 조회
      if (this.list.length === 0) {
        const params = { vm: this };
        this.getListDispatch(params);
      }
    },

    detail(data) {
      if (this.id !== data.playlistId) {
        // 재생목록아이디가 서로 다르면 처음 접속
        this.$store.commit("SET_PLAYLIST_INFO", data);
        const params = {
          vm: this,
          playlistId: data.playlistId
        };
        this.getPlaylistDispatch(params).then(() => {
          if (data.channel) {
            this.getChannelDispatch({ vm: this, channelId: data.channel }).then(() => {
              this.routeDetail(data);
            });
          } else {
            this.routeDetail(data);
          }
        });
      } else {
        // 동일한 재생목록을 재조회시 즉시 이동
        this.routeDetail(data);
      }
    },

    routeDetail(data) {
      this.$router.push({
        name: "playList",
        params: {
          id: data.playlistId
        }
      });
    },

    loadMore() {
      this.loadMoreLoading = true;
      setTimeout(() => {
        const param = { vm: this };
        this.loadMoreDispatch(param);
      }, 1000);
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