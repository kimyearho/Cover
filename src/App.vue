<template>
  <v-app>
    <v-toolbar dark color="indigo auto">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-autocomplete
        cache-items
        class="mx-3"
        flat
        hide-no-data
        hide-details
        label="Search"
        solo-inverted
      ></v-autocomplete>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer app>
      <v-bottom-nav :value="true" absolute>
        <v-btn color="pink" flat value="recent">
          <span>Search</span>
          <v-icon>history</v-icon>
        </v-btn>

        <v-btn color="pink" flat value="favorites">
          <span>Favorites</span>
          <v-icon>favorite</v-icon>
        </v-btn>

        <v-btn color="pink" flat value="nearby">
          <span>Setting</span>
          <v-icon>place</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      //
    };
  }
};
</script>

<style scope>
.v-toolbar__content {
  padding: 0px 5px 0px 12px !important;
}
.v-toolbar .v-input {
  margin: 0 !important;
}
</style>
