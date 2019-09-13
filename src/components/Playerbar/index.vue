<template>
  <v-layout row justify-center>
    <v-dialog v-model="isVisible" persistent :style="{overflowX: 'hidden'}">
      <v-container :style="{padding: '0px', maxWidth: '349px'}" id="scrollTarget" class="scroll-y">
        <v-card ref="bar" max-height="610px" v-scroll:#scrollTarget="onScrollWatch">
          <!-- 비디오 썸네일 -->
          <v-img :src="getVideoThumbnail" class="thumb"></v-img>
          <!-- 재생 프로그레스 바 -->
          <v-slider
            class="playTime"
            height="3"
            color="red"
            thumb-color="blue"
            thumb-label="always"
            :thumb-size="20"
            v-model="playTime"
            @change="playTimeController"
          />
          <!-- 비디오 제목 -->
          <v-card-title primary-title>
            <div class="playing-video-title">
              <marquee-text :duration="30">{{ playingVideo.coverData.videoTitle }}</marquee-text>
              <!-- 총 재생시간 -->
              <small class="total-play-time">{{ playingVideo.duration }}</small>
            </div>
          </v-card-title>

          <!-- 재생 컨트롤 -->
          <v-list>
            <v-list-tile class="item-center">
              <v-list-tile-action class="paly-icon-margin">
                <v-btn icon @click="previousVideo">
                  <v-icon class="font-40">fast_rewind</v-icon>
                </v-btn>
              </v-list-tile-action>

              <v-list-tile-action class="paly-icon-margin">
                <v-btn icon @click="playToggle">
                  <v-icon class="font-40">{{ playStatusIcon }}</v-icon>
                </v-btn>
              </v-list-tile-action>

              <v-list-tile-action class="paly-icon-margin">
                <v-btn icon @click="nextVideo">
                  <v-icon class="font-40">fast_forward</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>

          <!-- 볼륨 컨트롤 -->
          <v-card-actions class="volume-slider">
            <v-icon class="volume-down">volume_down</v-icon>
            <v-slider class="margin-0" v-model="volume" @change="changeVolume"></v-slider>
            <v-icon class="volume-up">volume_up</v-icon>
          </v-card-actions>

          <!-- 옵션 -->
          <v-card-actions>
            <v-tooltip top color="info">
              <template v-slot:activator="{ on }">
                <v-btn flat icon v-on="on" @click="videoRepeat">
                  <v-icon>{{ playRepeat ? 'repeat_one' : 'repeat' }}</v-icon>
                </v-btn>
              </template>
              <span>{{ playRepeat ? 'Click to dismiss the loop.' : 'Click to use repeat listening.' }}</span>
            </v-tooltip>

            <v-spacer></v-spacer>
            <v-btn flat color="red" @click="closePlayer">Player Hide</v-btn>
            <v-spacer></v-spacer>

            <v-tooltip top color="info">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="show = !show">
                  <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                </v-btn>
              </template>
              <span>{{ show ? 'Click to close the Playlist.' : 'Click to display the play list' }}</span>
            </v-tooltip>
          </v-card-actions>

          <!-- 재생 대기 목록 헤더 -->
          <v-divider></v-divider>
          <v-card-actions class="list-bg">
            <v-icon>queue_music</v-icon>
            <v-card-text class="title font-weight-bold playback-list-pd">PLAYBACK LIST</v-card-text>
          </v-card-actions>
          <v-divider></v-divider>

          <!-- 재생 대기 목록 / 기본설정은 닫혀있음 -->
          <v-expand-transition>
            <div v-show="show">
              <draggable
                tag="v-list"
                class="list-bg"
                v-model="playbackWaitList"
                v-bind="dragOptions"
                handle=".handle"
              >
                <template v-for="(item, index) in playbackWaitList">
                  <v-list-tile
                    v-if="filtersVideo(item.listIndex)"
                    @click="playVideo(item)"
                    :key="index"
                    avatar
                  >
                    <!-- 썸네일 -->
                    <v-list-tile-avatar>
                      <v-badge
                        class="badge cursor"
                        color="error"
                        overlap
                        @click.native.stop="videoRemove(item)"
                      >
                        <template v-slot:badge>
                          <v-icon class="i-close">close</v-icon>
                        </template>
                      </v-badge>
                      <img :src="item.thumbnails.medium.url" />
                    </v-list-tile-avatar>

                    <!-- 제목 및 라벨 -->
                    <v-list-tile-content class="cursor">
                      <v-list-tile-title class="font-13" v-html="item.title"></v-list-tile-title>
                      <v-list-tile-sub-title
                        v-if="item.duration"
                        class="font-12"
                      >{{ item.duration }} / {{ item.listIndex }}</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <!-- 확장메뉴 -->
                    <v-list-tile-action>
                      <v-tooltip top color="red">
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on" class="cursor font-22 handle">menu</v-icon>
                        </template>
                        <span>You can click and drag.</span>
                      </v-tooltip>
                    </v-list-tile-action>
                  </v-list-tile>
                </template>
              </draggable>
            </div>
          </v-expand-transition>

          <!-- 재생대기목록을 하단으로 일정 스크롤하면 닫기 버튼이 표시된다. -->
          <v-tooltip top color="red">
            <template v-slot:activator="{ on }">
              <v-btn
                v-show="fab"
                v-on="on"
                fab
                dark
                small
                fixed
                bottom
                right
                color="primary"
                :style="{right: '60px'}"
                @click="closePlayer"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </template>
            <span>Click to hide the player</span>
          </v-tooltip>
        </v-card>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import playerMixin from "./Mixin/mixin";
import MarqueeText from "vue-marquee-text-component";
import Draggable from "vuedraggable";

export default {
  name: "MainPlayerbar",
  mixins: [playerMixin],
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MarqueeText,
    Draggable
  },
  data() {
    return {
      show: false,
      volume: 50,
      playTime: 0,
      fab: false
    };
  },
  watch: {
    isVisible() {
      document.getElementById("scrollTarget").scrollTop = 0;
    }
  },
  computed: {
    ...mapGetters({
      id: "GET_ID",
      playingVideo: "GET_PLAYING_VIDEO",
      playStatus: "GET_PLAYER_STATUS",
      isNextToken: "playback/GET_PLAYBACK_TOKEN",
      playRepeat: "GET_REPEAT"
    }),

    // 재생 대기 목록
    playbackWaitList: {
      get() {
        return this.$store.getters["playback/GET_PLAYBACK_LIST"];
      },
      set(val) {
        this.videoDragPlaybackSync(val);
      }
    },

    /**
     * 재생 대기 목록을 렌더링하면서 현재 재생 중인 비디오의 순번보다,
     * 큰 순번만 필터링하여 렌더링한다.
     *
     * @param {Object} listIndex - 재생 대기 목록 각 비디오별 순번
     */
    filtersVideo() {
      return listIndex => {
        const playingVideoIndex = this.playingVideo.playIndex;
        if (listIndex > playingVideoIndex) {
          return true;
        }
      };
    },

    /**
     * 마지막 번째 비디오가 실행시 보여줄 문구
     *
     * @param {Object} index - 반복 index
     */
    lastVideo() {
      return index => {
        const playbackList = this.playbackWaitList;
        const playbackMaxCount = playbackList.length - 1;
        if (playbackMaxCount === index) {
          const playingVideoIndex = this.playingVideo.playIndex;
          const lastVideoListIndex = playbackList[playbackMaxCount].listIndex;
          if (playingVideoIndex === lastVideoListIndex) {
            return true;
          }
        }
      };
    },

    // 드래그 옵션
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },

    // 비디오 썸네일 조회
    getVideoThumbnail() {
      const videoInfo = this.playingVideo.thumbnails;
      return videoInfo === null ? "" : videoInfo.high.url;
    }
  },
  mounted() {
    // is electron default volume 50
    this.ipcSendVolumeControl(50);
    this.$event.$on("currentTime", this.currentTime);
  },
  methods: {
    // 스크롤 감시
    onScrollWatch(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 300;
    },

    // 볼륨 변경
    changeVolume(data) {
      this.ipcSendVolumeControl(data);
    },

    // 재생시간 건너띄기
    playTimeController(data) {
      let seekTime = (data * this.playingVideo.durationTime) / 100;
      this.ipcSendSeekPlay(seekTime);
    },

    // 플레이어 닫기
    closePlayer() {
      this.$emit("playerClose", false);
    },

    /**
     * 이전 재생 버튼을 클릭하면 실행된다.
     * 현재 재생중인 비디오의 이전 비디오를 재생한다.
     */
    previousVideo() {
      // 현재 재생중인 비디오의 순번을 가져와, 재생대기목록에서 이전 순번을 찾는다.
      const playingVideoIndex = this.playingVideo.playIndex;
      const previousVideoInfo = this._.find(this.playbackWaitList, {
        listIndex: playingVideoIndex - 1
      });
      this.$log.info(previousVideoInfo);
      if (previousVideoInfo) {
        this.setVideoSettingDispatch({ data: previousVideoInfo }).then(() => {
          this.setListUpdateDispatch().then(() => {
            this.ipcSendPlayVideo(previousVideoInfo);
            this.$log.info("Success, PreviousVideo!", previousVideoInfo);
          });
        });
      } else {
        // undefined면 1번째곡을 0초부터 다시 시작한다.
        const firstVideoInfo = this.playbackWaitList[0];
        this.$log.info("firstVideo", firstVideoInfo);
        // TODO: 재생로직
      }
    },

    /**
     * 재생 대기 목록에서 비디오를 드래그했을때 실행된다.
     *
     * @param {Object} val = 드래그로 순번이 변경된 재생 대기 목록
     */
    async videoDragPlaybackSync(val) {
      // 현재 재생중인 비디오의 순번보다 큰 순번의 목록만 필터링한뒤,
      // 목록의 순번을 현재 재생중인 비디오의 순번에서 1씩 증가시켜 순번을 재정의한다.
      const playbackNewFilterList = await this._.chain(val)
        .filter(item => {
          return item.listIndex > this.playingVideo.playIndex;
        })
        .forEach((item, index) => {
          let assignIndex = index + 1;
          item.listIndex = this.playingVideo.playIndex + assignIndex;
        })
        .value();

      // 필터링 되기전 재생 대기 목록을 기준으로 현재 재생중인 비디오의 순번과,
      // 같거나 작은 항목을 필터링한다. 그후 위에서 필터링한 목록을 합쳐 전체 새목록을 완성한다.
      const fixedList = await this._.chain(this.playbackWaitList)
        .filter(item => {
          return item.listIndex <= this.playingVideo.playIndex;
        })
        .concat(playbackNewFilterList)
        .value();

      this.$log.info("비디오 드래그 동기화 완료 목록 | ", fixedList);
      this.$store.commit("playback/SET_PLAYBACK_LIST", fixedList);
    },

    /**
     * 사용자가 재생 대기 목록중 비디오 항목을 클릭하면 실행된다.
     * 선택한 비디오를 재생한다.
     *
     * @param {Object} item - 선택한 비디오의 정보
     */
    playVideo(item) {
      this.ipcSendPlayVideo(item);
      this.$log.info(item);
      this.setVideoSettingDispatch({ data: item }).then(() => {
        this.setListUpdateDispatch().then(() => {
          document.getElementById("scrollTarget").scrollTop = 0;
        });
      });
    },

    /**
     * 사용자가 재생 대기 목록중 비디오 삭제항목을 클릭하면 실행된다.
     * 선택한 비디오를 삭제한다
     *
     * @param {Object} item - 선택한 비디오의 정보
     */
    async videoRemove(item) {
      const playbackWaitList = await this.playbackWaitList;
      this.$log.info("videoRemove | ", playbackWaitList);

      const list = await this._.chain(playbackWaitList)
        .reject({ listIndex: item.listIndex })
        .forEach((item, index) => {
          item.listIndex = index + 1;
        })
        .value();

      this.$log.info("videoRemove | playbackWaitList | ", list);
      if (list.length > 0) {
        this.$store.commit("playback/SET_PLAYBACK_LIST", list);
      }
    },

    videoRepeat() {
      this.$log.info("반복 설정 | ", !this.playRepeat);
      this.$store.commit("SET_REPEAT", !this.playRepeat);
    }
  }
};
</script>

<style scoped>
.thumb {
  height: 200px;
}
.v-card__title--primary {
  padding-top: 5px;
}
.badge >>> .v-badge__badge {
  height: 15px !important;
  width: 15px !important;
}
.badge {
  position: absolute;
  right: 3px;
  top: 5px;
}
.i-close {
  color: #ffffff;
}
.playTime {
  margin-top: 0px !important;
}
.item-center {
  margin: 0 43px;
}
.paly-icon-margin {
  margin: 0 14px;
}
.margin-0 {
  margin-top: 0;
}
.volume-slider {
  margin: 0 30px;
}
.volume-down {
  margin-right: 10px;
  margin-bottom: 20px;
  font-size: 20px;
}
.volume-up {
  margin-left: 10px;
  margin-bottom: 20px;
  font-size: 20px;
}
.list-bg {
  background: #f5f5f5;
}
.playback-list-pd {
  padding: 0px;
  padding-left: 5px;
  font-size: 16px !important;
}
.total-play-time {
  position: absolute;
  top: 205px;
  right: 2px;
  font-weight: 400;
  font-size: 12px;
  color: #616161;
}
</style>