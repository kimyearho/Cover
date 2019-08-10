<template>
  <v-layout row>
    <v-flex
      xs12
      sm6
      ref="block"
      class="max-height"
      :class="{playmaxheight: playingVideo.coverData.videoId}"
      @scroll="handleScroll"
    >
      <cover-list />
      <v-img
        src="https://developers.google.com/youtube/images/developed-with-youtube-sentence-case-dark.png"
      ></v-img>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import searchMixin from "./Mixin/mixin";
import CoverList from "./List/searchList";

export default {
  name: "Search",
  mixins: [searchMixin],
  components: {
    CoverList
  },
  data() {
    return {
      pos: 0
    };
  },
  computed: {
    ...mapGetters({
      scrollPos: "GET_SCROLL",
      playingVideo: "GET_PLAYING_VIDEO"
    })
  },
  mounted() {
    this.event.$on("topList", this.scrollTo);
    this.scrollTo();
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    this.event.$off("topList");
    this.$store.commit("SET_SCROLL", this.pos);
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    scrollTo(pos) {
      if (pos) {
        this.$refs.block.scrollTo(0, pos);
      } else {
        this.$refs.block.scrollTo(0, this.scrollPos);
      }
    },
    handleScroll() {
      this.pos = this.$refs.block.scrollTop;
    }
  }
};
</script>

<style lang="css" scoped>
.max-height {
  max-height: 572px;
  overflow-y: scroll;
}
.playmaxheight {
  max-height: 506px !important;
}
</style>