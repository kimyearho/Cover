<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>

        <v-img src="https://i.ytimg.com/vi/YU9kUGcJY60/maxresdefault.jpg" height="200px">
          <span class="avatar-right">
            <v-list-tile-avatar color="grey darken-3">
              <v-img
                class="elevation-6"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
              ></v-img>
            </v-list-tile-avatar>
          </span>
        </v-img>

        <v-card-title primary-title style="padding:10px !important;">
          <div class="headline">Shingeki no Kyojin (Attack on Titan) Season 3</div>
          <span class="grey--text">1,000 miles of wonder</span>
        </v-card-title>
      </v-card>

      <cover-list />
    </v-flex>
  </v-layout>
</template>

<script>
import searchMixin from "../Search/Mixin/mixin";
import CoverList from "../Search/List/searchList";

export default {
  name: "Sample2",
  mixins: [searchMixin],
  components: {
    CoverList
  },
  data() {
    return {
      show: false
    };
  }
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
  font-size: 17px !important;
  line-height: 32px !important;
}
.grow >>> .v-list__tile {
  padding: 0px !important;
}
</style>