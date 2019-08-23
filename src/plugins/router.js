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
      path: "/playList/:id",
      name: "Playlist",
      component: require("@/components/Videos/index").default,
      meta: { transition: 'overlay-down-full' }
    },
    {
      path: "/related/:id",
      name: "Related",
      component: require("@/components/Videos/index").default,
      meta: { transition: 'overlay-down-full' }
    },
    {
      path: "/sample1",
      name: "sample1",
      component: require("@/components/Sample/index").default,
      meta: { transition: 'overlay-left-full' }
    },
    {
      path: "/sample2",
      name: "sample2",
      component: require("@/components/Sample/index2").default,
      meta: { transition: 'overlay-left-full' }
    },
    {
      path: "/sample3",
      name: "sample3",
      component: require("@/components/Sample/index3").default,
      meta: { transition: 'overlay-left-full' }
    },
  ]
});

export default router;
