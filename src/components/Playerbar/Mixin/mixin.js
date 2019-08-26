export default {
  methods: {

    ipcSendSeekPlay(playtime) {
      if (this.isElectron) {
        this.ipcRenderer.send("win2Player", ["seekTo", playtime]);
      }
    },

    ipcSendPlayVideo(item) {
      if (this.isElectron) {
        this.ipcRenderer.send("win2Player", ["loadVideoById", item.videoId]);
      }
    },

    /**
     * 다음 재생 버튼을 클릭하면 실행된다.
     * 현재 재생중인 비디오의 다음 비디오를 재생한다.
     *
     * 이 기능은 메인/서브 플레이어바에서 동일하게 사용하므로 Mixin에서 관리한다.
     */
    nextVideo() {
      // 현재 재생중인 비디오의 순번을 가져와, 재생대기목록에서 다음 순번을 찾는다.
      const playingVideoIndex = this.playingVideo.playIndex;
      const nextVideoInfo = this._.find(this.playbackWaitList, {
        listIndex: playingVideoIndex + 1
      });
      this.$log.info("nextVideo", nextVideoInfo);
      if (nextVideoInfo) {
        this.setVideoSettingDispatch({ data: nextVideoInfo }).then(() => {
          this.setListUpdateDispatch().then(() => {
            this.ipcSendPlayVideo(nextVideoInfo)
            this.$log.info("Success, NextVideo!", nextVideoInfo);
          });
        });
      } else {
        // 재생목록의 마지막에서 다음재생을 클릭하면 재생대기목록의 첫번째 비디오를 재생한다.
        const firstVideoInfo = this.playbackWaitList[0];
        this.$log.info("firstVideo", firstVideoInfo);
        this.setVideoSettingDispatch({ data: firstVideoInfo }).then(() => {
          this.setListUpdateDispatch().then(() => {
            this.ipcSendPlayVideo(firstVideoInfo)
            this.$log.info("Success, NextVideo!", firstVideoInfo);
          });
        });
      }
    }
  }
};
