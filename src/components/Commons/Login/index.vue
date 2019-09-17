<template>
  <login v-if="!isVisible" @callback="get" />
  <v-layout v-else row wrap :style="{height: '570px'}">
    <v-flex xs12>
      <v-subheader class="subheader">
        <v-icon style="color:#ffffff;">verified_user</v-icon>
        <span style="margin-left: 10px;">User Profile</span>
      </v-subheader>

      <v-list two-line>
        <v-subheader>
          <span style="margin-left: 10px;">User information</span>
        </v-subheader>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="userData.picture" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ userData.name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ userData.email }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import playerMixin from "@/components/Playerbar/Mixin/mixin";
import Login from "@/components/Commons/Login/login";

export default {
  name: "UserProfile",
  mixins: [playerMixin],
  components: { Login },
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapGetters({
      userData: "common/GET_USER",
      userRatingCount: "common/GET_USER_RATING_COUNT",
      playingVideo: "GET_PLAYING_VIDEO"
    }),
    isVisible() {
      return this.userData.id ? true : false;
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
    if (this.isVisible) {
      this.get();
    }
  },
  methods: {
    ...mapActions({
      getUserRatingCount: "library/getMyRatingCount",
      setUserRatingCount: "common/setUserRating"
    }),

    get() {
      this.getUserRatingCount({ vm: this }).then(({ data }) => {
        this.$log.info(data);
        const totalCount = data.pageInfo.totalResults;
        this.setUserRatingCount({ count: totalCount }).then(res => {
          this.$log.info("setUserRatingCount | ", res);
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