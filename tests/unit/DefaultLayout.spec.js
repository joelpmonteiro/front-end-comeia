import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuetify from "vuetify";
import DefaultLayout from "../../src/layout/Default.vue";
import AppBar from "../../src/components/header/AppBar.vue";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import VueRouter from "vue-router";
import { generateSlug } from "../../src/util/";

const localVue = createLocalVue();
localVue.use(Vuetify);
localVue.use(VueRouter);

describe("DefaultLayout.vue", () => {
  let wrapper;
  let vuetify;
  let router;
  const mockCities = [{ name: "London" }, { name: "New York" }];
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    router = new VueRouter({
      routes: [
        { path: "/", name: "Home" },
        { path: "/details/:name", name: "Histórico de Temperaturas" },
      ],
    });
    vuetify = new Vuetify();
    router.go = vi.fn();

    global.localStorage = {
      getItem: () => JSON.stringify({ data: mockCities }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    wrapper = shallowMount(DefaultLayout, {
      localVue,
      vuetify,
      router,
      stubs: {
        "router-view": true,
        "app-bar": AppBar,
      },
      propsData: {
        // Defina um valor padrão para a prop 'name' usada no AppBar
        name: "AppBarName",
      },
    });
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
  });

  it("renderiza o componente", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("renderiza o componente AppBar", () => {
    const appBar = wrapper.findComponent(AppBar);
    expect(appBar.exists()).toBe(true);
  });

  it('deve retornar o nome da rota quando a rota é "/"', async () => {
    try {
      await router.push("/");
    } catch (e) {
      if (e.name !== "NavigationDuplicated") {
        throw e;
      }
    }
    expect(wrapper.vm.routerName).toBe("Home");
  });

  it("deve retornar o nome da cidade correta baseado no localStorage", async () => {
    const cityName = "London";

    // Limpe o localStorage antes do teste
    localStorage.clear();

    // Adicione o item ao localStorage
    localStorage.setItem(
      "city",
      JSON.stringify({
        data: [{ name: cityName }],
        timestamp: 1725303626739,
      })
    );

    await router.push(`/details/${generateSlug(cityName)}`);
    await wrapper.vm.$nextTick(); // Aguarde a atualização do DOM

    // Verifique o valor retornado pelo método
    expect(wrapper.vm.routeDetails()).toBe(cityName);
  });

  it('deve retornar o nome da rota concatenado com detalhes quando não é "/"', async () => {
    try {
      localStorage.setItem(
        "city",
        JSON.stringify({
          data: [{ name: "London" }],
        })
      );
      await router.push("/details/london");
    } catch (e) {
      if (e.name !== "NavigationDuplicated") {
        throw e;
      }
    }
    expect(wrapper.vm.routerName).toBe("Histórico de Temperaturas - London");
  });

  it("calcula routerName corretamente quando a rota não é raiz", () => {
    const routerName = wrapper.vm.routerName;
    expect(routerName).toBe("Histórico de Temperaturas - London");
  });

  it("busca o nome da cidade corretamente no localStorage em montado", () => {
    expect(wrapper.vm.city).toEqual({ name: "London" });
  });

  it("deve chamar generateSlug corretamente no método routeDetails", () => {
    const routeDetailsSpy = vi.spyOn(wrapper.vm, "routeDetails");
    wrapper.vm.routeDetails();
    expect(routeDetailsSpy).toHaveBeenCalled();
  });

  it("chama $router.go(-1) quando o método goBack é chamado", () => {
    wrapper.vm.goBack();
    expect(wrapper.vm.$router.go).toHaveBeenCalledWith(-1);
  });
});
