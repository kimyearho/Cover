  <template>
  <v-card>
    <v-list subheader>
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
      modal: {
        menu: false
      }
    };
  },
  computed: {
    ...mapGetters({
      list: "GET_SEARCH_LIST",
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
      getList: "getApiSearch"
    }),
    get() {
      // 처음 조회
      if(this.list.length === 0) {
        const params = { vm: this };
        this.getList(params);
      } else {
        // 처음조회가 아닐때
        this.$store.commit('SET_SEARCH_LIST', this.list);
      }
    },
    detail(data) {
      console.log("상세 => " + data);
    }
  }
};
</script>

<style lang="css" scoped>
.maxHeight {
  max-height: 490px;
  overflow-y: scroll;
}
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
</style>