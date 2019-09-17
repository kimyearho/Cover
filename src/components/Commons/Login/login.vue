<template>
  <v-layout align-center justify-center row fill-height :style="{height: '570px'}">
    <v-flex xs12 sm6 offset-sm3>
      <v-card :style="{height: '105%'}">
        <v-flex xs12 :style="{ marginLeft: '25%', marginRight: '39%' }">
          <a class @click="login">
            <v-img :style="{width: '200px'}" :src="require('@/assets/images/google_login_btn.png')"></v-img>
          </a>
        </v-flex>
        <v-divider />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from "vuex";
import playerMixin from "@/components/Playerbar/Mixin/mixin";

export default {
  name: "Login",
  mixins: [playerMixin],
  data() {
    return {
      show: false
    };
  },
  mounted() {
    if (this.isElectron) {
      this.ipcRenderer.on("googleOauth2_callback", (ev, data) => {
        this.successOnCallback(data);
      });
    }
  },
  methods: {
    ...mapActions({
      oauth2TokenDispatch: "common/setOauth2Token"
    }),

    login() {
      if (this.isElectron) {
        // Electron Mode일때는 여기를 사용
        this.ipcRenderer.send("googleOauth2");
      } else {
        // Web Mode일때는 여기를 사용
        this.$gAuth
          .signIn()
          .then(GoogleUser => {
            this.oauth2TokenDispatch({
              vm: this,
              data: GoogleUser.getAuthResponse()
            }).then(() => {
              this.$log.info("Login Success | ", this.userData);
              this.$emit("callback", true);
            });
          })
          .catch(error => {
            this.$log.info(error);
          });
      }
    },

    successOnCallback(data) {
      this.$log.info(data);
    }
  }
};
</script>