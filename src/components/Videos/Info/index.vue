<template>
  <div>
    <v-img :src="getThumbnail" height="190px">
      <span class="avatar-right">
        <v-list-tile-avatar color="grey darken-3">
          <v-img class="elevation-6" :src="channel.thumbnails.default.url"></v-img>
        </v-list-tile-avatar>
      </span>
    </v-img>

    <v-card-title primary-title style="padding:10px !important;">
      <div class="headline">{{ infos.title }}</div>
      <span class="grey--text">{{ infos.channelTitle }}</span>
    </v-card-title>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "VideoInfo",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      channel: "GET_CHANNEL",
      infos: "GET_PLAYLIST_INFO"
    }),
    getThumbnail() {
      const listThumbnail = this.infos.thumbnails;
      return listThumbnail === null ? "" : listThumbnail.high.url;
    }
  },
  methods: {}
};
</script>

<style lang="css" scoped>
.subheader {
  color: #ffffff !important;
  background: #d32f2f;
}
.avatar-right {
  float: right;
  margin-top: 10px;
}
.headline {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px !important;
  line-height: 32px !important;
}
.grow >>> .v-list__tile {
  padding: 0px !important;
}
</style>