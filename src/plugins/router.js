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
      meta: { transition: 'overlay-right-full' }
    },
    {
      path: "/sample",
      name: "sample",
      component: require("@/components/Sample/index").default,
      meta: { transition: 'overlay-left-full' }
    },
    {
      path: "/playList/:id",
      name: "playList",
      component: require("@/components/Videos/index").default,
      meta: { transition: 'overlay-down-full' }
    }
  ]
});

export default router;
