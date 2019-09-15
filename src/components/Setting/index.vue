<template>
  <v-layout row>
    <v-flex xs12 sm6 ref="block" class="max-height">
      <v-card>
        <!-- 부제목 -->
        <v-subheader class="subheader">
          <v-icon :style="{color: '#ffffff'}">settings</v-icon>
          <span :style="{marginLeft: '10px'}">Setting</span>
        </v-subheader>

        <v-layout row wrap>
          <v-flex xs6>
            <v-subheader>{{ videoFrameSubHeader }}</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-switch class="switch1" v-model="setting.videoFrameVisible" color="red"></v-switch>
          </v-flex>
          <div class="option1-text">
            <span>비디오 윈도우를 열거나 닫을 수 있습니다.</span>
          </div>
        </v-layout>

        <v-layout row wrap>
          <v-flex xs6>
            <v-subheader>Always Top</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-switch class="switch1" v-model="setting.mainFrameAlwaysTop" color="red"></v-switch>
          </v-flex>
          <div class="option2-text">
            <span>플레이어를 상시 상단으로 유지하거나 끕니다.</span>
          </div>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Setting",
  data() {
    return {
      show: false
    };
  },
  watch: {
    "setting.videoFrameVisible": {
      handler(val) {
        this.videoVisibleOption(val);
      },
      deep: true
    },
    "setting.mainFrameAlwaysTop": {
      handler(val) {
        this.mainFrameFixedOption(val);
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      setting: "GET_SETTING_DATA"
    }),
    videoFrameSubHeader() {
      return this.setting.videoFrameVisible === false
        ? "Hide video frame"
        : "Show video frame";
    }
  },
  methods: {
    ...mapActions({
      videoVisibleDispatch: "setVisibleVideoOption",
      mainFrameFixedDispatch: "setMainframeAlwaysTopOption"
    }),
    videoVisibleOption(val) {
      this.videoVisibleDispatch({ val: val });
      if (this.isElectron) {
        this.ipcRenderer.send("visibleVideoFrame", { value: val });
      }
    },
    mainFrameFixedOption(val) {
      this.mainFrameFixedDispatch({ val: val });
      if (this.isElectron) {
        this.ipcRenderer.send("mainFrameAlwaysTop", { value: val });
      }
    }
  }
};
</script>

<style lang="css" scoped>
.maxHeight {
  height: 550px;
}
.subheader {
  color: #ffffff !important;
  background: #3949ab;
}
.switch1 {
  margin-top: 0px;
  padding: 12px;
  float: right;
}
.option1-text {
  position: absolute;
  bottom: 89px;
  left: 15px;
  font-size: 12px;
  color: #ff1744;
  font-weight: 700;
}
.option2-text {
  position: absolute;
  left: 15px;
  bottom: 17px;
  font-size: 12px;
  color: #1760ff;
  font-weight: 700;
}
</style>