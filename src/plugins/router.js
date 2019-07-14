import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  saveScrollPosition: true,
  routes: [
    {
      path: "/",
      redirect: "/searchList"
    },
    {
      path: "/searchList",
      name: "searchList",
      component: require("@/components/Search/index").default,
      meta: { transition: 'overlay-left' }
    },
    {
      path: "/sample",
      name: "sample",
      component: require("@/components/Sample/index").default,
      meta: { transition: 'overlay-right' }
    },
    {
      path: "/sample2",
      name: "sample2",
      component: require("@/components/Sample/index2").default,
      meta: { transition: 'overlay-left-right' }
    }
  ]
});

export default router;
