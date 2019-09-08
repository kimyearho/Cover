<template>
  <v-app>
    <!-- 컴포넌트화 시킬것 -->
    <v-toolbar dark color="primary" class="toolbar">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <auto-complate />
    </v-toolbar>

    <!-- 콘텐츠 -->
    <v-content>
      <vue-page-transition>
        <router-view></router-view>
      </vue-page-transition>
    </v-content>

    <v-footer>
      <v-bottom-nav :active.sync="bottomNav" :value="true" absolute>
        <v-btn color="pink" flat value="search" @click="route('search')">
          <span>Search</span>
          <v-icon>history</v-icon>
        </v-btn>

        <v-btn color="pink" flat value="favorites" @click="route('favorites')">
          <span>Favorites</span>
          <v-icon>favorite</v-icon>
        </v-btn>

        <v-btn color="pink" flat value="library" @click="route('library')">
          <span>Library</span>
          <v-icon>video_library</v-icon>
        </v-btn>

        <v-btn color="pink" flat value="setting" @click="route('setting')">
          <span>Setting</span>
          <v-icon>settings</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-footer>

    <sub-playerbar />
    <playerbar :isVisible.sync="isPlayer" @playerClose="setPlayerSwitch({ flag: false })" />
    <common-player-ipc-controller />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import AutoComplate from "@/components/Commons/AutoComplate/autoComplate";
import CommonPlayerIpcController from "@/components/Commons/PlayerIpc/index";
import Playerbar from "@/components/Playerbar/index";
import SubPlayerbar from "@/components/Playerbar/sub";

export default {
  name: "App",
  components: {
    AutoComplate,
    Playerbar,
    SubPlayerbar,
    CommonPlayerIpcController
  },
  data() {
    return {
      bottomNav: "search"
    };
  },
  computed: {
    isPlayer: {
      get() {
        return this.$store.getters.GET_SHOW_PLAYER;
      },
      set(val) {
        this.$store.commit("SET_SHOW_PLAYER", val);
      }
    }
  },
  methods: {
    route(name) {
      this.bottomNav = name;
      if (name === "search") {
        this.$router.push({ name: "searchList" });
      } else if (name === "favorites") {
        this.$router.push({ name: "sample1" });
      } else if (name === "library") {
        this.$router.push({ name: "sample2" });
      } else if (name === "setting") {
        this.$router.push({ name: "sample3" });
      }
    }
  }
};
</script>

<style scope>
.v-toolbar__content {
  height: 50px !important;
  padding: 0px 5px 0px 12px !important;
}
.v-toolbar .v-input {
  margin: 0 !important;
}
</style>
