<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <play-list />
    </v-flex>
  </v-layout>
</template>

<script>
import RelatedList from "./List/Related/index"
import PlayList from "./List/Playlist/index";

export default {
  name: "Videos",
  components: {
    PlayList
  },
  data() {
    return {};
  },
  watch: {
    '$route': {
      handler(to, from) {
        this.$log.info('to', to)
        this.$log.info('from', from)
      }
    }
  }
};
</script>
