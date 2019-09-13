import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";
import Router from "./plugins/router";

import Vuetify from "vuetify";
import "./plugins/vuetify";

// Local Styles
import "../src/assets/index.css";
import "../src/assets/scss/playerbar.scss";

import axios from "./plugins/request";
import authAxios from './plugins/oauth'
import VueScrollTo from "vue-scrollto";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import lodash from "lodash";
import moment from "moment";
import VuePageTransition from "vue-page-transition";
import VueLogger from "vuejs-logger";
import PouchDB from "pouchdb-browser";
import isElectron from "is-electron";

const isProduction = process.env.NODE_ENV === "production";
const options = {
  isEnabled: true,
  logLevel: isProduction ? "error" : "info",
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
Vue.prototype.$axios = axios;
Vue.prototype.$authAxios = authAxios;
Vue.prototype.$moment = moment;
Vue.prototype.$event = new Vue();
Vue.prototype.isElectron = isElectron()
Vue.prototype.$auth = new PouchDB("http://202.182.100.137:5984/metube");

if (isElectron()) Vue.prototype.ipcRenderer = window.ipcRenderer

const vm = new Vue({
  render: h => h(App),
  router: Router,
  store
})

// API Client Key 발급
vm.$store
  .dispatch("common/setAuthKey", { vm: vm })
  .then(() => {
    vm.$log.info('setAuthKey | Done.')
    // Key 발급 후 뷰 인스턴스에 마운트
    vm.$mount("#app");
  });
