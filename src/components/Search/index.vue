<template>
  <v-layout row>
    <v-flex xs12 sm6 ref="block" class="maxHeight" @scroll="handleScroll">
      <cover-list />
      <v-img src="https://developers.google.com/youtube/images/developed-with-youtube-sentence-case-dark.png"></v-img>
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
      pos: 0,
      containerLoader: false
    };
  },
  computed: {
    ...mapGetters({
      scrollPos: "GET_SCROLL"
    })
  },
  mounted() {
    this.$refs.block.scrollTo(0, this.scrollPos);
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    this.$store.commit("SET_SCROLL", this.pos);
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.pos = this.$refs.block.scrollTop;
    },
  }
};
</script>

<style lang="css" scoped>
.maxHeight {
  max-height: 572px;
  overflow-y: scroll;
}
</style>