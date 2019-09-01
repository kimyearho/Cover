<template>
  <div class="container2 grey lighten-3">
    <v-card>
      <!-- 부제목 -->
      <v-subheader class="subheader">
        <v-icon style="color:#ffffff;">favorite</v-icon>
        <span style="margin-left: 10px;">Favorite</span>
      </v-subheader>

      <v-container grid-list-lg>
        <v-layout row wrap></v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Sample",
  data() {
    return {
      show: false
    };
  }
};
</script>

<style lang="css" scoped>
.container2 {
  max-width: 400px !important;
  max-height: 500px;
  margin: auto !important;
  overflow-y: scroll;
}
.subheader {
  color: #ffffff !important;
  background: #d81b60;
}
</style>