<template>
  <v-app>
    <v-layout row class="maxHeight" ref="vlayout">
      <v-flex xs12 sm6 offset-sm3>
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
  </v-app>
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
      loadMoreLoading: false,
      containerLoader: false
    };
  },
  computed: {
    ...mapGetters({
      isNextToken: "GET_NEXT_TOKEN"
    })
  },
  methods: {
    loadMore() {
      this.loadMoreLoading = true;
      setTimeout(() => {
        this.$store.dispatch("getApiNextloadSearch", {
          vm: this
        });
      }, 1000);
    }
  }
};
</script>

<style lang="css" scoped>
.maxHeight {
  max-height: 490px;
  overflow-y: scroll;
}
</style>