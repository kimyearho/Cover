<template>
  <div class="text-xs-center">
    <v-bottom-sheet v-model="sheet">
      <template v-slot:activator>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-subheader>Open in</v-subheader>
        <template v-for="(item, index, index2) in tiles">
          <v-list-tile :key="index2" @click="menuItem(item)">
            <v-list-tile-avatar>
              <v-avatar size="32px" tile>
                <img
                  :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${item.img}`"
                  :alt="item.title"
                />
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
          <v-divider v-if="index + 1 < tiles.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>
<script>
export default {
  name: "videoMenu",
  props: {
    videoData: Object,
    mode: {
      type: String,
      default: "d"
    }
  },
  watch: {},
  data() {
    return {
      sheet: false,
      tiles: [
        { img: "keep.png", title: "View on YouTube" },
        { img: "inbox.png", title: "Copy YouTube Link" },
        { img: "hangouts.png", title: "Adding to Library" }
      ]
    };
  },
  methods: {
    menuItem(data) {
      this.$log.info('Done!', data)
      // this.sheet = !this.sheet
    }
  }
};
</script>

<style lang="scss" scoped>
</style>