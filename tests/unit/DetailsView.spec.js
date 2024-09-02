import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import DetailsView from "../../src/views/DetailsView.vue";
import VueApexCharts from "vue-apexcharts";
import Vuetify from "vuetify";
import Notification from "../../src/components/notify/notification.vue";
import { weatherForecast } from "../../src/api/weather/weather";
import dayjs from "dayjs";

// Crie um localVue para evitar conflitos com o Vue global
const localVue = createLocalVue();
localVue.use(Vuetify);

// Configura o parâmetro da rota
localVue.prototype.$route = {
  params: {
    name: "London",
  },
};

// Mock global ResizeObserver
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock do componente VueApexCharts
const mockVueApexCharts = {
  name: "VueApexCharts",
  render() {
    return null;
  },
};

// Registre o componente VueApexCharts
localVue.component("VueApexCharts", VueApexCharts);

vi.mock("../../src/api/weather/weather", () => ({
  weatherForecast: vi.fn(() =>
    Promise.resolve({
      data: [
        { dt_txt: "2024-09-01 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-01 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-01 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-01 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-01 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-01 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-01 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-01 00:00:00", main: { temp: "29.5" } },

        { dt_txt: "2024-09-02 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-02 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-02 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-02 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-02 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-02 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-02 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-02 00:00:00", main: { temp: "29.5" } },

        { dt_txt: "2024-09-03 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-03 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-03 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-03 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-03 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-03 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-03 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-03 00:00:00", main: { temp: "29.5" } },

        { dt_txt: "2024-09-04 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-04 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-04 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-04 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-04 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-04 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-04 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-04 00:00:00", main: { temp: "29.5" } },

        { dt_txt: "2024-09-05 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-05 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-05 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-05 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-05 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-05 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-05 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-05 00:00:00", main: { temp: "29.5" } },
      ],
    })
  ),
}));

describe("DetailsView.vue", () => {
  let vuetify;
  let app;
  let wrapper = null;

  beforeEach(() => {
    // Adiciona o elemento data-app para Vuetify
    const app = document.createElement("div");
    app.setAttribute("data-app", true);
    document.body.appendChild(app);

    vuetify = new Vuetify();

    // Monta o componente com opções padrão
    wrapper = mount(DetailsView, {
      localVue,
      vuetify,
      stubs: {
        VueApexCharts: mockVueApexCharts,
        Notification,
      },
      data() {
        return {
          series: [{ name: "Temperatura", data: [28, 32, 33, 24, 16] }],
          chart: null,
          chartOptions: {
            chart: {
              height: 350,
              type: "line",
              zoom: {
                enabled: true,
              },
            },
            dataLabels: {
              enabled: true,
              formatter: (val) => `${val}°C`,
            },
            stroke: {
              curve: "smooth",
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5,
              },
            },
            title: {
              text: localVue.name,
              align: "left",
            },
            xaxis: {
              categories: ["01/09", "02/09", "03/09", "04/09", "05/09"],
              // labels: {
              //   formatter: (value) => dayjs(value).format("DD/MM"),
              // },
            },
            yaxis: {
              title: {
                text: "Temperatura (°C)",
              },
            },
          },
          notify: true,
          msg: "Erro ao dados meteorológicos da cidade",
        };
      },
    });
  });

  afterEach(() => {
    // Remove o elemento data-app após os testes
    if (app) {
      document.body.removeChild(app);
    }
  });

  it("deve renderizar corretamente o componente", async () => {
    await wrapper.vm.$nextTick();

    // Verifique a renderização do v-card-title
    const cardTitle = wrapper.findComponent({ name: "v-card-title" });
    expect(cardTitle.exists()).toBe(true);
    expect(cardTitle.text()).toBe("Temperaturas dos Últimos 5 Dias");
  });

  it("deve renderizar o componente Notification quando notify for true", async () => {
    expect(wrapper.findComponent(Notification).exists()).toBe(true);
    expect(wrapper.findComponent(Notification).props("msg")).toBe(
      "Erro ao dados meteorológicos da cidade"
    );
  });

  it("deve simular os 5 ultimos dias corretamente", () => {
    const data = {
      list: [
        { dt_txt: "2024-09-01 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-01 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-01 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-01 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-01 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-01 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-01 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-01 00:00:00", main: { temp: "29.5" } },

        { dt_txt: "2024-09-02 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-02 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-02 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-02 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-02 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-02 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-02 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-02 00:00:00", main: { temp: "29.5" } },

        { dt_txt: "2024-09-03 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-03 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-03 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-03 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-03 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-03 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-03 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-03 00:00:00", main: { temp: "29.5" } },

        { dt_txt: "2024-09-04 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-04 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-04 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-04 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-04 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-04 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-04 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-04 00:00:00", main: { temp: "29.5" } },

        { dt_txt: "2024-09-05 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-05 06:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-05 09:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-05 12:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-05 15:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-05 18:00:00", main: { temp: "22.0" } },
        { dt_txt: "2024-09-05 21:00:00", main: { temp: "29.5" } },
        { dt_txt: "2024-09-05 00:00:00", main: { temp: "29.5" } },
      ],
    };

    const historicalData = wrapper.vm.simulateFiveDays(data);
    expect(historicalData.length).toBe(5);
    expect(historicalData[0].temperature).toBe(26); // Verifique a temperatura convertida
  });

  it("Atualização de Dados", async () => {
    const data = {
      list: [
        { dt_txt: "2024-09-01 03:00:00", main: { temp: "25.5" } },
        { dt_txt: "2024-09-02 03:00:00", main: { temp: "26.0" } },
        { dt_txt: "2024-09-03 03:00:00", main: { temp: "24.5" } },
        { dt_txt: "2024-09-04 03:00:00", main: { temp: "23.0" } },
        { dt_txt: "2024-09-05 03:00:00", main: { temp: "22.5" } },
        // Adicione mais dados conforme necessário
      ],
    };

    // Mock do método weatherForecast
    weatherForecast.mockResolvedValue({ data });

    await wrapper.vm.$nextTick(); // Aguarda a próxima atualização do DOM

    // Aguarde a atualização do gráfico
    await new Promise((resolve) => setTimeout(resolve, 100)); // Pode ajustar o tempo conforme necessário

    expect(wrapper.vm.chartOptions.xaxis.categories).toEqual(
      data.list.map((entry) => dayjs(entry.dt_txt).format("DD/MM"))
    );
  });

  it("mostra notificação em caso de erro", async () => {
    weatherForecast.mockRejectedValue(new Error("Falha na API"));

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Erro ao dados meteorológicos da cidade");
  });

  it("deve atualizar a propriedade notify quando removeNotification é chamado", () => {
    wrapper.vm.removeNotification(false);
    expect(wrapper.vm.notify).toBe(false);
  });

  it("deve configurar corretamente as opções do gráfico e nom do grafico", async () => {
    // Nome da cidade para o teste
    const cityName = "London";

    // Monte o componente com parâmetros de rota simulados
    const wrapper = shallowMount(DetailsView, {
      localVue,
      mocks: {
        $route: {
          params: { name: cityName }, // Simule o parâmetro da rota
        },
        $refs: {
          chart: {
            updateOptions: vi.fn(),
          },
        },
      },
    });

    // Aguarde a montagem completa do componente e a atualização do DOM
    await wrapper.vm.$nextTick();

    // Verifique as opções do gráfico
    const chartOptions = wrapper.vm.chartOptions;

    // Verifique o tipo do gráfico
    expect(chartOptions.chart.type).toBe("line");

    // Verifique o título do gráfico
    expect(chartOptions.title.text).toBe(cityName);
  });

  it("deve exibir uma notificação quando ocorre um erro ao buscar os dados", async () => {
    weatherForecast.mockRejectedValue(new Error("Erro de rede"));

    await wrapper.vm.$nextTick(); // Aguarde a atualização do DOM

    expect(wrapper.vm.notify).toBe(true);
    expect(wrapper.vm.msg).toBe("Erro ao dados meteorológicos da cidade");
  });

  it("deve formatar os dataLabels corretamente", () => {
    // Acessar chartOptions e a função formatter
    const formatter = wrapper.vm.chartOptions.dataLabels.formatter;

    // Testar a formatação com um valor de exemplo
    const value = 23;
    const formattedValue = formatter(value);

    expect(formattedValue).toBe("23°C");
  });
});
