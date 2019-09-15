<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-btn @click="login">
          <v-icon>close</v-icon>Login
        </v-btn>
        <v-divider />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import playerMixin from "@/components/Playerbar/Mixin/mixin";

export default {
  name: "Sign_in",
  mixins: [playerMixin],
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapGetters({
      userData: "common/GET_USER",
      playingVideo: "GET_PLAYING_VIDEO"
    }),
    isVisible() {
      return this.userData.id ? true : false;
    },
    getThumbnail() {
      return item => {
        return item.thumbnails
          ? item.thumbnails.medium.url
          : "https://i.imgur.com/4MqP8kE.jpg";
      };
    },
    listStyle() {
      if (this.playingVideo.isUse) {
        return {
          maxHeight: "330px",
          overflowY: "scroll"
        };
      } else {
        return {
          maxHeight: "390px",
          overflowY: "scroll"
        };
      }
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