import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";
import Router from './plugins/router'

import '../src/assets/index.css'

import Vuetify from "vuetify";
import "./plugins/vuetify";
import "vuetify/dist/vuetify.min.css";

import axios from "./plugins/request";
import VueScrollTo from "vue-scrollto";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import lodash from "lodash";
import moment from 'moment'
Vue.use(Loading);
Vue.use(Vuetify);
Vue.use(VueScrollTo);

Vue.config.productionTip = false;
Vue.prototype._ = lodash;
Vue.prototype.axios = axios;
Vue.prototype.moment = moment;
Vue.prototype.event = new Vue();

new Vue({
  render: h => h(App),
  router: Router,
  store,
}).$mount('#app')
