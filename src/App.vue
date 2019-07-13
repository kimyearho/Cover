<template>
  <v-app>
    <!-- 컴포넌트화 시킬것 -->
    <v-toolbar dark color="indigo auto">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <auto-complate />
    </v-toolbar>

    <!-- 콘텐츠 -->
    <v-content>
      <router-view></router-view>
    </v-content>

    <!-- 컴포넌트화 시킬것 -->
    <v-footer app>
      <v-bottom-nav :active.sync="bottomNav" :value="true" absolute>
        <v-btn color="pink" flat value="search" @click="route('search')">
          <span>Search</span>
          <v-icon>history</v-icon>
        </v-btn>

        <v-btn color="pink" flat value="favorites" @click="route('favorites')">
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
import AutoComplate from "@/components/Commons/AutoComplate/autoComplate";
export default {
  name: "App",
  components: {
    AutoComplate
  },
  data() {
    return {
      bottomNav: "search"
    };
  },
  methods: {
    route(name) {
      this.bottomNav = name;
      if (name === "search") {
        this.$router.push("searchList");
      } else if (name === "favorites") {
        this.$router.push("sample");
      }
    }
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
