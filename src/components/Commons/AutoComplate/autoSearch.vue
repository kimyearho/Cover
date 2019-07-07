<template>
  <v-autocomplete
    ref="auto"
    v-model="select"
    :loading="loading"
    :items="items"
    :search-input.sync="search"
    cache-items
    class="mx-3"
    flat
    clearable
    hide-no-data
    hide-details
    label="Search"
    solo-inverted
    @keyup.enter="handleKeyupSelect"
  ></v-autocomplete>
</template>

<script>
const path =
  "https://suggestqueries.google.com/complete/search?ds=yt&client=youtube&q=";

import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
import searchMixin from "../../Search/Mixin/mixin";
export default {
  name: "AutoSearch",
  mixins: [searchMixin],
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      isStart: false
    };
  },
  computed: {
    ...mapFields({ select: "searchText" })
  },
  watch: {
    select(newval) {
      if (newval) {
        this.loading = true;
        this.isStart = true;
        const params = { vm: this, text: this.select };
        this.getList(params).then(() => {
          this.isStart = false;
          this.loading = false;
        });
      }
    },
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  methods: {
    ...mapActions({
      getList: "getApiSearch"
    }),
    querySelections(v) {
      this.loading = true;
      const url = path.concat(v);
      this.axios.jsonp(url).then(res => {
        let value = this._.map(res[1], item => {
          return {
            name: item[0]
          };
        });
        if (value) {
          this.items = this._.map(value, "name");
        }
        this.loading = false;
      });
    },
    handleKeyupSelect() {
      if (!this.isStart) {
        if (this.search) {
          this.loading = true;
          this.$set(this, "select", this.search);
          //
          const params = { vm: this, text: this.select };
          this.getList(params);
          //
          this.$refs.auto.isMenuActive = false;
          this.loading = false;
        }
      }
    }
  }
};
</script>

<style lang="css" scoped>
</style>