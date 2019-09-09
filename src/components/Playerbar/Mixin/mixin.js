import { mapActions } from "vuex";

export default {
  computed: {

    playTypeToolTipName() {
      let iconName = "";
      if (this.playStatus === 1) {
        iconName = "Pause";
      } else if (this.playStatus === 2) {
        iconName = "Play";
      }
      return iconName
    },

    playStatusIcon() {
      let iconName = "";
      if (this.playStatus === 1) {
        iconName = "pause";
      } else if (this.playStatus === 2) {
        iconName = "play_arrow";
      } else {
        iconName = "slow_motion_video";
      }
      return iconName;
    }

  },
  methods: {

    ...mapActions({
      setVideoSettingDispatch: "playingVideoSetting",
      setListUpdateDispatch: "playback/setUpdatePlaybackList"
    }),

    ipcSendVolumeControl(volume) {
      if (this.isElectron) {
        this.ipcRenderer.send("win2Player", ["setVolume", volume]);
      }
    },

    ipcSendPlayToggle(playType) {
      if (this.isElectron) {
        this.ipcRenderer.send("win2Player", [playType]);
      }
    },

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

    playToggle() {
      let playType = this.playStatus === 1 ? "pauseVideo" : "playVideo";
      this.ipcSendPlayToggle(playType);
    },

    // 현재 재생시간
    currentTime(args) {
      let percent = (args * 100) / this.playingVideo.durationTime;
      this.playTime = Math.floor(percent) + 1;
    },

    /**
     * 다음 재생 버튼을 클릭하면 실행된다.
     * 현재 재생중인 비디오의 다음 비디오를 재생한다.
     *
     * 이 기능은 메인/서브 플레이어바에서 동일하게 사용하므로 Mixin에서 관리한다.
     * FIXME: 추가 -> 공통 비디오 IPC 컨트롤에서, 비디오 종료 후 다음 곡 자동 재생시에도 사용한다.
     */
    nextVideo() {
      // 현재 재생중인 비디오의 순번을 가져와, 재생대기목록에서 다음 순번을 찾는다.
      const playingVideoIndex = this.playingVideo.playIndex;
      const playbackList = this.$store.getters["playback/GET_PLAYBACK_LIST"];
      const nextVideoInfo = this._.find(playbackList, {
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
        const firstVideoInfo = playbackList[0];
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
