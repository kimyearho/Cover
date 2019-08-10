<template>
  <v-autocomplete
    ref="auto"
    v-model="select"
    :loading="loading"
    :items="items"
    :search-input.sync="search"
    cache-items
    flat
    class="vauto"
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
    select: {
      get() {
        return this.$store.getters.GET_SEARCH_TEXT;
      },
      set(val) {
        this.$store.commit("SET_SEARCH_TEXT", val);
      }
    }
  },
  watch: {
    select(newval) {
      if (newval) {
        this.isStart = true;
        const params = { vm: this, text: this.select };
        this.getList(params).then(() => {
          this.isStart = false;
          this.redirect()
        });
      }
    },
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  methods: {
    ...mapActions({
      getListDispatch: "getApiSearch"
    }),
    querySelections(v) {
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
      });
    },
    handleKeyupSelect() {
      if (!this.isStart) {
        if (this.search) {
          this.$set(this, "select", this.search);
          //
          const params = { vm: this, text: this.select };
          this.getListDispatch(params).then(() => {
            this.redirect()
          });
          //
          this.$refs.auto.isMenuActive = false;
        }
      }
    },
    redirect() {
      const route = this.$route;
      if (route.name !== "searchList") {
        this.$router.push({
          name: "searchList"
        });
      }
    }
  }
};
</script>

<style lang="css" scoped>
.vauto >>> .v-input__control {
  min-height: 38px !important;
}
</style>