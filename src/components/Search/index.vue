<template>
  <v-layout row class="maxHeight">
    <v-flex xs12 sm6 offset-sm3>
      <search-list />
    </v-flex>
  </v-layout>
</template>

<script>
import SearchList from "./List/searchList";

export default {
  name: "Search",
  components: {
    SearchList
  }
};
</script>

<style lang="css" scoped>
.maxHeight {
  max-height: 490px;
  overflow-y: scroll;
}
</style>