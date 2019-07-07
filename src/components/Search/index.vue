<template>
  <v-layout row class="maxHeight">
    <v-flex xs12 sm6 offset-sm3>
      <cover-list />
      <v-btn
        block
        :loading="loading"
        :disabled="loading"
        color="primary"
        @click="loadMore"
      >{{ isNextToken ? 'Load More' : 'End' }}</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";
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
      loading: false
    };
  },
  computed: {
    ...mapFields({
      isNextToken: "nextToken"
    })
  },
  methods: {
    loadMore() {
      this.loading = true;
      setTimeout(() => {
        this.$store
          .dispatch("getApiNextloadSearch", {
            vm: this
          })
          .then(() => {
            this.loading = false;
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