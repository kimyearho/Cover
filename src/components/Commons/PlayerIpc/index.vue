<template>
  <div></div>
</template>

<script>
import { mapGetters } from "vuex";
import PlayerMixin from "@/components/Playerbar/Mixin/mixin";

export default {
  name: "CommonPlayerIpcController",
  mixins: [PlayerMixin],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      playingVideo: "GET_PLAYING_VIDEO",
      videoRepeat: "GET_REPEAT"
    })
  },
  mounted() {
    if (this.isElectron) {
      this.ipcRenderer.on("player2Win", (event, arg) => {
        const eventName = arg[0];
        const eventValue = arg[1];
        if (eventName === "onStateChange") {
          this.$store.dispatch("playerStatus", { status: eventValue });
          // FIXME: 정확한 이벤트 구분을 위해 모두 작성.
          // 1. 영상을 처음 재생했을 경우
          //   * -1 -> 3 -> 1
          // 2. 영상을 재생중에 다른 영상을 재생할경우
          //   * -2 -> -1 -> 3 -> 1
          switch (eventValue) {
            case -1:
              this.$log.info(eventName, `${eventValue} - (시작되지 않음)`);
              break;
            case 0:
              this.$log.info(eventName, `${eventValue} - (종료)`);
              if (this.videoRepeat) this.repeatPlay();
              else this.nextVideoPlay();
              break;
            case 1:
              this.$log.info(eventName, `${eventValue} - (재생 중)`);
              break;
            case 2:
              this.$log.info(eventName, `${eventValue} - (일시 중지)`);
              break;
            case 3:
              this.$log.info(eventName, `${eventValue} - (버퍼링)`);
              break;
            case 5:
              this.$log.info(eventName, `${eventValue} - (동영상 신호)`);
              break;
          }
        } else if (eventName === "currentTime") {
          this.$event.$emit("currentTime", eventValue);
        }
      });
    }
  },
  methods: {
    // 반복 재생
    repeatPlay() {
      if (this.playingVideo && this.playingVideo.isUse) {
        const videoData = this.playingVideo.coverData;
        this.ipcSendPlayVideo(videoData);
      }
    },

    // 다음 곡 재생
    nextVideoPlay() {
      if (this.playingVideo && this.playingVideo.isUse) {
        this.nextVideo();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>