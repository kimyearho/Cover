<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3 ref="block" class="maxHeight" @scroll="handleScroll">
      <cover-list />
      <v-btn
        block
        :loading="loadMoreLoading"
        :disabled="loadMoreLoading"
        color="primary"
        @click="loadMore"
      >{{ isNextToken ? 'Load More' : 'End' }}</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
      loadMoreLoading: false,
      containerLoader: false
    };
  },
  computed: {
    ...mapGetters({
      scrollPos: "GET_SCROLL",
      isNextToken: "GET_NEXT_TOKEN"
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
    ...mapActions({
      loadMoreSearch: "getApiNextloadSearch"
    }),
    handleScroll() {
      this.pos = this.$refs.block.scrollTop;
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
.maxHeight {
  max-height: 500px;
  overflow-y: scroll;
}
</style>