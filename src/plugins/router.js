import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const router = new VueRouter({
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
    }
  ]
});

export default router;
