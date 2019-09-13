<template>
  <div class="container2 grey lighten-3">
    <v-card>
      <!-- 부제목 -->
      <v-subheader class="subheader">
        <v-icon style="color:#ffffff;">library_music</v-icon>
        <span style="margin-left: 10px;">Library</span>
      </v-subheader>

      <v-container grid-list-lg>
        <v-layout row wrap>
          <v-flex>
            <v-btn @click="login" :disabled="loginDisable">
              <v-icon>close</v-icon>Login
            </v-btn>
            <span>{{ userData ? userData.email : '' }}</span>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Sample",
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapGetters({
      userData: "common/GET_USER"
    }),
    loginDisable() {
      return this.userData ? true : false;
    }
  },
  mounted() {
    if (this.isElectron) {
      this.ipcRenderer.on("googleOauth2_callback", (ev, data) => {
        this.successOnCallback(data);
      });
    }
  },
  methods: {
    login() {
      this.ipcRenderer.send("googleOauth2");
    },
    successOnCallback(data) {
      this.$store
        .dispatch("common/setOauth2Token", { data: data.result })
        .then(() => {
          const token = "Bearer " + data.result.access_token;
          this.$log.info(token);
          this.$authAxios
            .get("/userinfo", {
              headers: { Authorization: token }
            })
            .then(data => {
              this.$store.commit("common/SET_USER", data);
              this.$log.info("userInfo | ", data);
            });
        });
    }
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
  background: #039be5;
}
</style>