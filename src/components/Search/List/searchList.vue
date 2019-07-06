  <template>
  <v-card>
    <v-list subheader>
      <v-subheader class="subheader">
        <v-icon>search</v-icon>
        <span>Youtube Search list</span>
      </v-subheader>
      <template v-for="(item, index) in list">
        <v-list-tile :key="item.etag" avatar @click="detail(item)">
          <v-list-tile-avatar>
            <img :src="item.thumbnails.default.url" />
          </v-list-tile-avatar>

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

          <v-list-tile-action>
            <v-btn icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index + 1 < list.length" :key="index"></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import searchMixin from "../Mixin/mixin";
export default {
  name: "List",
  mixins: [searchMixin],
  data() {
    return {};
  },
  computed: {
    ...mapFields({
      list: "searchList",
      isNextToken: "nextToken",
      loadScrollPos: "scrollPos"
    })
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$store.dispatch("getApiSearch", { vm: this, text: "top music" });
    },
    detail(data) {
      console.log(data);
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
</style>