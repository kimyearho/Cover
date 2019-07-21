  <template>
  <v-card>
    <v-list subheader class="pd-0">
      <!-- 부제목 -->
      <v-subheader class="subheader">
        <v-icon>search</v-icon>
        <span>Youtube Search list</span>
      </v-subheader>

      <!-- 검색목록 템플릿 -->
      <template v-for="(item, index, index1) in list">
        <v-list-tile :key="index1" avatar @click="detail(item)">
          <!-- 썸네일 -->
          <v-list-tile-avatar>
            <img :src="item.thumbnails.default.url" />
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
        <v-divider v-if="index + 1 < list.length" :key="index"></v-divider>
      </template>
      <v-btn
        block
        :loading="loadMoreLoading"
        :disabled="loadMoreLoading"
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
      getList: "getApiSearch",
      getPlaylist: "getPlaylist",
      loadMoreSearch: "getApiNextloadSearch"
    }),
    get() {
      // 처음 조회
      if (this.list.length === 0) {
        const params = { vm: this };
        this.getList(params);
      }
    },

    // 기본적인 방법
    // detail(data) {
    //   this.$store.commit("SET_PLAYLIST_INFO", data);
    //   this.$router.push({
    //     name: "playList",
    //     params: {
    //       id: data.playlistId
    //     }
    //   });
    // },

    /**
     * 이 방법은 재생목록 페이지로 이동하기전에 먼저 데이터를 요청하는 방식
     * 데이터 요청 후 Store 정보까지 세팅이 성공하면 재생목록 페이지로 이동한다.
     * 따라서, 페이지에 이동하면 이미 데이터는 전부 준비되어 있는 상태가 됨.
     * 일반적으로 컴포넌트로 이동하여 데이터를 요청하면 재생목록이 비어있다가 채워지는 현상이 있기 때문에,
     * 로딩을 채워넣는것보단 이 방식도 괜찮을 것 같음.
     * 단, router 에서 처리할 수 있는 방법이 있으면 그 방식도 괜찮을듯함.
     */
    detail(data) {
      if (this.id !== data.playlistId) {
        // 재생목록아이디가 서로 다르면 처음 접속
        this.$store.commit("SET_PLAYLIST_INFO", data);
        const params = {
          vm: this,
          playlistId: data.playlistId
        };
        this.getPlaylist(params).then(() => {
          // TODO: 페이지 이동하기전에 에러처리도 할 수 있을것 같다.
          this.$router.push({
            name: "playList",
            params: {
              id: data.playlistId
            }
          });
        });
      } else {
        // 동일한 재생목록을 재조회시 즉시 이동
        this.$router.push({
          name: "playList",
          params: {
            id: data.playlistId
          }
        });
      }
    },
    loadMore() {
      this.loadMoreLoading = true;
      setTimeout(() => {
        const param = { vm: this };
        this.loadMoreSearch(param);
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