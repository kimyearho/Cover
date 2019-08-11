import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";
import Router from "./plugins/router";

import Vuetify from "vuetify";
import "./plugins/vuetify";

import "../src/assets/index.css";
import "../src/assets/scss/playerbar.scss";

import axios from "./plugins/request";
import VueScrollTo from "vue-scrollto";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import lodash from "lodash";
import moment from "moment";
import VuePageTransition from "vue-page-transition";
import VueLogger from "vuejs-logger";
import isElectron from "is-electron";

const isProduction = process.env.NODE_ENV === "production";
const options = {
  isEnabled: true,
  logLevel: isProduction ? "error" : "debug",
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: "|",
  showConsoleColors: true
};

Vue.use(VueLogger, options);
Vue.use(VuePageTransition);
Vue.use(Loading);
Vue.use(Vuetify);
Vue.use(VueScrollTo);

Vue.config.productionTip = false;
Vue.prototype._ = lodash;
Vue.prototype.axios = axios;
Vue.prototype.moment = moment;
Vue.prototype.event = new Vue();
Vue.prototype.isElectron = isElectron()
if (isElectron()) {
  import("electron").then(electron => {
    Vue.prototype.ipcRenderer = electron.ipcRenderer;
  });
}

new Vue({
  render: h => h(App),
  router: Router,
  store
}).$mount("#app");
