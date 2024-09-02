import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import "./assets/main.css";
import vuetify from "./plugins/vuetify";
import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);
Vue.component("VueApexCharts", VueApexCharts);

new Vue({
  router,
  vuetify: vuetify,
  render: (h) => h(App),
}).$mount("#app");
