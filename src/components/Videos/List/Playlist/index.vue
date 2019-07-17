<template>
  <div></div>
</template>

<script>
export default {
  name: "VideoPlayList",
  data() {
    return {};
  },
  created() {
      this.$store.dispatch('getPlaylist', { vm: this })
  }
};
</script>

<style lang="css" scoped>
</style>