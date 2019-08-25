<template>
  <v-layout row justify-center>
    <v-dialog ref="bar" v-model="isVisible" persistent transition="dialog-bottom-transition">
      <v-card>
        <!-- 비디오 썸네일 -->
        <v-img :src="getVideoThumbnail" class="thumb"></v-img>
        <!-- 재생 프로그레스 바 -->
        <v-progress-linear color="error" height="3" value="50"></v-progress-linear>
        <!-- 총 재생시간 -->
        <small class="total-play-time">{{ playingVideo.duration }}</small>
        <!-- 비디오 제목 -->
        <v-card-title primary-title>
          <div class="playing-video-title">
            <marquee-text :duration="30">{{ playingVideo.coverData.videoTitle }}</marquee-text>
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
              <v-btn icon>
                <v-icon class="font-40">pause</v-icon>
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
          <v-slider class="margin-0" v-model="volume"></v-slider>
          <v-icon class="volume-up">volume_up</v-icon>
        </v-card-actions>

        <!-- 옵션 -->
        <v-card-actions>
          <v-btn flat>Share</v-btn>
          <v-btn flat color="purple" @click="$emit('update:isVisible', false)">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <!-- 재생 대기 목록 헤더 -->
        <v-divider></v-divider>
        <v-card-actions class="list-bg">
          <v-icon>queue_music</v-icon>
          <v-card-text class="title font-weight-bold playback-list-pd">PLAYBACK WAIT LIST</v-card-text>
        </v-card-actions>
        <v-divider></v-divider>

        <v-expand-transition>
          <div v-show="show">
            <!-- 재생 대기 목록 -->
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
                    <v-icon class="cursor font-22 handle">menu</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <v-list-tile v-if="lastVideo(index)" :key="item.videoId">
                  <!-- 제목 및 라벨 -->
                  <v-list-tile-content class="cursor">
                    <v-list-tile-title
                      class="font-13 font-weight-bold"
                      :style="{textAlign: 'center'}"
                    >There is no play queue.</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </draggable>
          </div>
        </v-expand-transition>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
      show: true,
      volume: 50
    };
  },
  watch: {
    isVisible() {
      this.$refs.bar.$refs.dialog.scrollTop = 0;
    }
  },
  computed: {
    ...mapGetters({
      id: "GET_ID",
      playingVideo: "GET_PLAYING_VIDEO",
      playbackWaitList: "playback/GET_PLAYBACK_LIST",
      isNextToken: "playback/GET_PLAYBACK_TOKEN"
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
  methods: {
    ...mapActions({
      setVideoSettingDispatch: "playingVideoSetting",
      setListUpdateDispatch: "playback/setUpdatePlaybackList"
    }),

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

      this.$log.info(
        "videoDragPlaybackSync | playbackNewFilterList | ",
        playbackNewFilterList
      );

      // 필터링 되기전 재생 대기 목록을 기준으로 현재 재생중인 비디오의 순번과,
      // 같거나 작은 항목을 필터링한다. 그후 위에서 필터링한 목록을 합쳐 전체 새목록을 완성한다.
      const fixedList = await this._.chain(this.playbackWaitList)
        .filter(item => {
          return item.listIndex <= this.playingVideo.playIndex;
        })
        .concat(playbackNewFilterList)
        .value();

      this.$log.info("videoDragPlaybackSync | fixedList | ", fixedList);

      if (fixedList.length > 0) {
        this.$store.commit("playback/SET_PLAYBACK_LIST", fixedList);
      }
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
          this.$refs.bar.$refs.dialog.scrollTop = 0;
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
      this.$log.info(item);
      const playbackWaitList = await this.playbackWaitList;
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
    }
  }
};
</script>

<style scoped>
.thumb {
  height: 200px;
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
.v-progress-linear {
  background: transparent;
  margin: unset;
  overflow: unset;
  width: 100%;
  position: relative;
}
.v-progress-linear__background {
  position: absolute;
  left: 0;
  bottom: 0;
  -webkit-transition: 0.3s ease-in;
  transition: 0.3s ease-in;
  background: transparent;
}
.item-center {
  margin: 0 50px;
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