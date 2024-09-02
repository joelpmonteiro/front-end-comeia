import { describe, it, expect, beforeEach } from "vitest";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuetify from "vuetify"; // Importa o Vuetify
import VueApexCharts from "vue-apexcharts";
import VueRouter from "vue-router";
import DefaultLayout from "../../src/layout/Default.vue";
import HomeView from "../../src/views/HomeView.vue";
import DetailsView from "../../src/views/DetailsView.vue";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuetify); // Usa o Vuetify

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "Layout",
      component: DefaultLayout,
      redirect: { name: "homeview" },
      children: [
        {
          path: "",
          name: "Climas nas Cidades",
          component: HomeView,
        },
        {
          path: "/details/:name",
          name: "Histórico de Temperaturas",
          component: DetailsView,
        },
      ],
    },
  ],
});

// Mock global ResizeObserver

VueApexCharts.props = {}; // Desabilita propriedades
VueApexCharts.install = () => {}; // Desabilita a instalação do componente
localVue.component("VueApexCharts", VueApexCharts);

const VueApexChartsStub = {
  template: "<div></div>",
  props: ["options", "series"],
  mounted() {
    // Adicione comportamentos ou verificações aqui se necessário
  },
};

describe("router.js", () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('deve renderizar o componente DefaultLayout na rota "/"', async () => {
    const wrapper = mount(DefaultLayout, {
      localVue,
      router,
      vuetify,
    });

    await localVue.nextTick(); // Aguarde a atualização do Vue Router

    expect(wrapper.findComponent(HomeView).exists()).toBe(true);
  });

  it('deve navegar para DetailsView ao acessar a rota "/details/:name"', async () => {
    const name = "London";
    router.push(`/details/${name}`);

    await localVue.nextTick();

    const wrapper = mount(DefaultLayout, {
      localVue,
      router,
      vuetify,
      stubs: {
        VueApexCharts: VueApexChartsStub,
      },
    });

    await localVue.nextTick();

    expect(wrapper.vm.$route.params.name).toBe(name);
    expect(wrapper.findComponent(DetailsView).exists()).toBe(true);
  });
});
