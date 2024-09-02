import { mount, shallowMount } from "@vue/test-utils";
import HomeView from "../../src/views/HomeView.vue";
import { weather } from "../../src/api/weather/weather";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CardCity from "../../src/components/Card/CardCity.vue";
import DialogModal from "../../src/components/modal/Dialog.vue";

// Crie um mock para a função weather
// vi.mock("../../src/api/weather/weather", () => ({
//   weather: vi.fn(() =>
//     Promise.resolve({
//       data: {
//         name: "Rio de Janeiro",
//         weather: {
//           name: "Rio de Janeiro",
//           main: { temp: 15 },
//           weather: [
//             { id: 800, main: "Clear", description: "céu limpo", icon: "01n" },
//           ],
//         },
//       },
//     })
//   ),
// }));

vi.mock("../../src/api/weather/weather", () => ({
  weather: vi.fn((cityName) => {
    if (cityName === "Tokyo") {
      return Promise.resolve({
        data: {
          name: "Tokyo",
          main: { temp: 25 },
          weather: [{ description: "céu limpo" }],
        },
      });
    } else if (cityName === "") {
      return Promise.reject(new Error("Erro ao adicionar cidade"));
    }
    return Promise.resolve({
      data: {
        name: cityName,
        main: { temp: 15 },
        weather: [{ description: "céu limpo" }],
      },
    });
  }),
}));

describe("HomeView.vue", () => {
  let vuetify = null;
  let wrapper = null;

  beforeEach(() => {
    //adicionando esse data-app pq nos teste o vuetify nao encontra ele para prosseguir
    const app = document.createElement("div");
    app.setAttribute("data-app", true);
    document.body.appendChild(app);
    global.fetch = vi.fn(() =>
      Promise.reject(new Error("Erro ao adicionar cidade"))
    );

    vuetify = global.vuetify;
    wrapper = mount(HomeView, {
      vuetify,
      data() {
        return {
          cities: [
            {
              name: "London",
              weather: {
                name: "London",
                main: { temp: 15 },
                weather: [
                  {
                    id: 800,
                    main: "Clear",
                    description: "céu limpo",
                    icon: "01n",
                  },
                ],
              },
            },
            {
              name: "New York",
              weather: {
                name: "New York",
                main: { temp: 15 },
                weather: [
                  {
                    id: 800,
                    main: "Clear",
                    description: "céu limpo",
                    icon: "01n",
                  },
                ],
              },
            },
            {
              name: "Tokyo",
              weather: {
                name: "Tokyo",
                main: { temp: 15 },
                weather: [
                  {
                    id: 800,
                    main: "Clear",
                    description: "céu limpo",
                    icon: "01n",
                  },
                ],
              },
            },
            {
              name: "Sydney",
              weather: {
                name: "Sydney",
                main: { temp: 15 },
                weather: [
                  {
                    id: 800,
                    main: "Clear",
                    description: "céu limpo",
                    icon: "01n",
                  },
                ],
              },
            },
            {
              name: "São Paulo",
              weather: {
                name: "São Paulo",
                main: { temp: 15 },
                weather: [
                  {
                    id: 800,
                    main: "Clear",
                    description: "céu limpo",
                    icon: "01n",
                  },
                ],
              },
            },
          ],
          showAddCityDialog: false,
          notify: false,
          msg: "",
        };
      },
    });
  });

  afterEach(() => {
    // Remove o elemento data-app após os testes
    const app = document.querySelector("[data-app]");
    if (app) {
      document.body.removeChild(app);
    }
    localStorage.clear();
  });

  it("deve renderizar corretamente o componente", () => {
    expect(wrapper.findAllComponents({ name: "CardCity" }).length).toBe(5);
    expect(wrapper.findComponent({ name: "ButtonAddCity" }).exists()).toBe(
      true
    );
    expect(wrapper.findComponent({ name: "DialogModal" }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: "Notification" }).exists()).toBe(
      false
    );
  });

  it("deve mostrar o DialogModal quando showAddCityDialog é true", async () => {
    await wrapper.setData({ showAddCityDialog: true });

    expect(wrapper.findComponent({ name: "DialogModal" }).exists()).toBe(true);
  });

  it("deve alterar o estado de showAddCityDialog ao chamar showAddCityDialogFn", () => {
    const wrapper = mount(HomeView, { vuetify });
    wrapper.vm.showAddCityDialogFn(true);
    expect(wrapper.vm.showAddCityDialog).toBe(true);
  });

  it("deve alterar o estado de notify ao chamar removeNotification", () => {
    const wrapper = mount(HomeView, { vuetify });
    wrapper.vm.removeNotification(true);
    expect(wrapper.vm.notify).toBe(true);
  });

  it("deve remover uma cidade existente e exibir notificação correta", () => {
    wrapper.vm.removeCity("Sydney");

    expect(wrapper.vm.cities.length).toBe(4);
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Cidade removida com sucesso!");
  });

  it("deve mostrar notificação se a cidade não existir ao tentar remover", () => {
    wrapper.vm.removeCity("Japan");
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Seleciona uma cidade para remover");
  });

  it("deve mostrar notificação quando o limite de chamadas à API for atingido", async () => {
    wrapper.vm.apiCallCount = 60; // Simulando que o limite foi alcançado
    await wrapper.vm.fetchCityWeather();
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe(
      "Limite de chamadas à API atingido. Tente novamente mais tarde."
    );
  });

  it("deve buscar o clima das cidades e atualizar a lista", async () => {
    weather.mockResolvedValue({
      data: {
        name: "London",
        main: { temp: 20 },
        weather: [{ description: "clear sky" }],
      },
    });

    await wrapper.vm.fetchCityWeather();

    expect(wrapper.vm.cities[0].weather.main.temp).toBe(20);
  });

  it("deve adicionar uma nova cidade e exibir notificação de sucesso", async () => {
    // Mock para resposta específica
    weather.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          name: "Paris",
          main: { temp: 20 },
          weather: [{ description: "céu limpo" }],
        },
      })
    );

    await wrapper.vm.addCity("Paris");

    // Verifica se foi adicionada
    expect(wrapper.vm.cities).toContainEqual({
      name: "Paris",
      weather: {
        name: "Paris",
        main: { temp: 20 },
        weather: [{ description: "céu limpo" }],
      },
    });

    // Verifica se a notificação foi exibida
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Cidade Adicionada com sucesso!");
  });

  it("deve renderizar CardCity para cada cidade com dados válidos", async () => {
    const wrapper = shallowMount(HomeView, {
      mocks: {
        $route: { params: { name: "" } },
      },
    });

    // Mock para a função `fetchCityWeather` para evitar chamadas reais à API
    wrapper.vm.fetchCityWeather = vi.fn();

    // Simule a execução de `fetchCityWeather`
    await wrapper.vm.$nextTick();

    // Atualize a lista de cidades para que o componente renderize os cartões
    wrapper.vm.cities = [
      { name: "London", weather: { temp: 20 } },
      { name: "New York", weather: { temp: 15 } },
    ];

    // Atualize a lista de cidades e aguarde a atualização do DOM
    await wrapper.vm.$nextTick();

    // Verifique se `CardCity` foi renderizado para cada cidade
    const cards = wrapper.findAllComponents(CardCity);
    expect(cards).toHaveLength(2);
  });

  it("deve mostrar o DialogModal quando showAddCityDialog for true", async () => {
    const wrapper = shallowMount(HomeView);

    // Atualize o estado para mostrar o DialogModal
    wrapper.setData({ showAddCityDialog: true });

    await wrapper.vm.$nextTick();

    // Verifique se o DialogModal está presente no DOM
    expect(wrapper.findComponent(DialogModal).exists()).toBe(true);
  });

  // it("deve buscar o clima das cidades e atualizar o estado", async () => {
  //   // Simule o carregamento de dados
  //   await wrapper.vm.fetchCityWeather();

  //   // Verifique se o clima foi atualizado
  //   expect(wrapper.vm.apiCallCount).toBe(5);
  // });

  it("deve adicionar uma nova cidade e atualizar a notificação", async () => {
    const wrapper = shallowMount(HomeView);

    // Mock da resposta da API
    weather.mockResolvedValue({ data: { temp: 20 } });

    // Adicione uma nova cidade
    await wrapper.vm.addCity("Paris");

    // Verifique se a cidade foi adicionada
    expect(wrapper.vm.cities).toContainEqual({
      name: "Paris",
      weather: { temp: 20 },
    });
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Cidade Adicionada com sucesso!");
  });

  it("deve lidar com erros ao adicionar uma cidade", async () => {
    // Simule o erro ao adicionar a cidade

    await wrapper.vm.addCity(""); // vazio para dar o erro

    // Verifique a notificação de erro
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Erro ao adicionar a cidade");
  });

  it("deve remover uma cidade e atualizar a notificação", async () => {
    // Remova uma cidade
    wrapper.vm.removeCity("Sydney");

    // Verifique se a cidade foi removida
    expect(wrapper.vm.cities).not.toContainEqual({
      name: "London",
      weather: { temp: 15 },
    });
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Cidade removida com sucesso!");
  });

  it("deve exibir uma mensagem se a cidade não for encontrada", async () => {
    // Tente remover uma cidade que não está na lista
    wrapper.vm.removeCity("Japan");

    vi.fn(() => Promise.reject(new Error("Erro ao buscar as cidades")));

    // Verifique a notificação de erro
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Seleciona uma cidade para remover");
  });

  it("deve lidar com a remoção de uma cidade inexistente", () => {
    wrapper.vm.cities = [
      { name: "Tokyo", weather: { name: "Tokyo", temp: 15 } },
    ];
    wrapper.vm.removeCity("New York");

    expect(wrapper.vm.cities).toHaveLength(1);
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Seleciona uma cidade para remover");
  });

  it("deve mostrar e remover a notificação corretamente", () => {
    wrapper.vm.showAlert("Test Alert");
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Test Alert");

    wrapper.vm.removeNotification(false);
    expect(wrapper.vm.notify).toBe(false);
  });

  it("deve remover uma cidade com sucesso", () => {
    wrapper.vm.cities = [
      { name: "Tokyo", weather: { name: "Tokyo", temp: 15 } },
    ];
    wrapper.vm.removeCity("Tokyo");

    expect(wrapper.vm.cities).toHaveLength(0);
    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Cidade removida com sucesso!");
  });

  it("deve retornar dados do cache quando os dados são válidos", () => {
    const cityName = "London";
    const cachedData = {
      data: [
        {
          name: "London",
          weather: {
            name: "London",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
        {
          name: "New York",
          weather: {
            name: "New York",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
        {
          name: "Tokyo",
          weather: {
            name: "Tokyo",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
        {
          name: "Sydney",
          weather: {
            name: "Sydney",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
        {
          name: "São Paulo",
          weather: {
            name: "São Paulo",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
      ],
      timestamp: Date.now(),
    };

    // Armazena dados no localStorage
    localStorage.setItem(cityName, JSON.stringify(cachedData));

    const result = wrapper.vm.getCachedWeather(cityName);

    expect(result).toEqual(cachedData.data);
  });

  it("deve retornar cidades atuais quando o cache está expirado", () => {
    const cityName = "city";
    const expiredCachedData = {
      data: [
        {
          name: "London",
          weather: {
            name: "London",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
        {
          name: "New York",
          weather: {
            name: "New York",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
        {
          name: "Tokyo",
          weather: {
            name: "Tokyo",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
        {
          name: "Sydney",
          weather: {
            name: "Sydney",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
        {
          name: "São Paulo",
          weather: {
            name: "São Paulo",
            main: { temp: 15 },
            weather: [
              {
                id: 800,
                main: "Clear",
                description: "céu limpo",
                icon: "01n",
              },
            ],
          },
        },
      ],
      timestamp: Date.now() - 60000, // Timestamp expirado
    };

    // Armazena dados expirados no localStorage
    localStorage.setItem(cityName, JSON.stringify(expiredCachedData));

    const result = wrapper.vm.getCachedWeather(cityName);
    expect(result.length).toBe(wrapper.vm.cities.length);
    expect(result.map((city) => city.name)).toEqual(
      wrapper.vm.cities.map((city) => city.name)
    );
  });

  it("deve retornar cidades atuais quando não há dados no cache", () => {
    const cityName = "NonExistentCity";

    const result = wrapper.vm.getCachedWeather(cityName);

    expect(result).toMatchObject(wrapper.vm.cities);
  });
});
