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
      component: require("@/components/Search/index").default
    },
    {
      path: "/sample",
      name: "sample",
      component: require("@/components/Sample/index").default
    }
  ]
});

export default router;
