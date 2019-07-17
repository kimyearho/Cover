<template>
  <div>
    <play-list />
  </div>
</template>

<script>
import draggable from "vuedraggable";
import PlayList from "../Videos/List/Playlist/index";
export default {
  name: "Playlist",
  components: {
    PlayList
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
</style>