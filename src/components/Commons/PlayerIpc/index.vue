<template>
  <div></div>
</template>

<script>
export default {
  name: "CommonPlayerIpcController",
  data() {
    return {};
  },
  computed: {},
  mounted() {
    if (this.isElectron) {
      setTimeout(() => {
        this.ipcRenderer.on("player2Win", (event, arg) => {
          const eventName = arg[0];
          const eventValue = arg[1];
          if (eventName === "onStateChange") {
            if (eventValue === -1) {
              this.$log.info(eventName, `${eventValue} - (시작되지 않음)`);
            } else if (eventValue === 0) {
              this.$log.info(eventName, `${eventValue} - (종료)`);
            } else if (eventValue === 1) {
              this.$log.info(eventName, `${eventValue} - (재생 중)`);
            } else if (eventValue === 2) {
              this.$log.info(eventName, `${eventValue} - (일시 중지)`);
            } else if (eventValue === 3) {
              this.$log.info(eventName, `${eventValue} - (버퍼링)`);
            } else if (eventValue === 5) {
              this.$log.info(eventName, `${eventValue} - (동영상 신호)`);
            }
          } else if (eventName === "currentTime") {
            this.$log.info(eventName, eventValue);
          }
        });
      }, 1000);
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>