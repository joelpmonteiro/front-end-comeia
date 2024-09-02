import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Layout",
      component: () => import("../layout/Default.vue"),
      redirect: { name: "homeview" },
      children: [
        {
          path: "",
          name: "Climas nas Cidades",
          component: () => import("../views/HomeView.vue"),
        },
        {
          path: "/details/:name",
          name: "Histórico de Temperaturas",
          component: () => import("../views/DetailsView.vue"),
        },
      ],
    },
  ],
});

export default router;
