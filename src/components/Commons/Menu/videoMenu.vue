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
        <template v-for="(tile, index, index2) in tiles">
          <v-list-tile :key="index2" @click="menuItem(tile)">
            <v-list-tile-avatar>
              <v-avatar size="32px" tile>
                <img
                  :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`"
                  :alt="tile.title"
                />
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-title>{{ tile.title }}</v-list-tile-title>
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
      console.log(data)
      // this.sheet = !this.sheet
    }
  }
};
</script>

<style lang="scss" scoped>
</style>