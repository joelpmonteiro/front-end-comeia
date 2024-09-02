<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="12" md="8" lg="6">
        <v-card>
          <v-card-title>Temperaturas dos Últimos 5 Dias</v-card-title>
          <v-card-text>
            <!-- Gráfico de Linhas -->
            <VueApexCharts
              :ref="'chart'"
              type="line"
              height="350"
              :options="chartOptions"
              :series="series"
            ></VueApexCharts>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <Notification
      v-if="this.notify"
      @removeNotification="removeNotification"
      :notify="this.notify"
      :msg="this.msg"
    ></Notification>
  </v-container>
</template>

<script>
import { weatherForecast } from "../api/weather/weather";
import Notification from "../components/notify/notification.vue";
import dayjs from "dayjs";

export default {
  components: {
    Notification,
  },
  data() {
    return {
      notify: false,
      msg: "",
      series: [],
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
        title: {
          text:
            this.$route.params && this.$route.params.name
              ? `${this.$route.params.name
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}`
              : "",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [],
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
    };
  },
  methods: {
    simulateFiveDays(data) {
      const interval = 8; // Intervalo de 8 previsões (a cada 24 horas, dado que a previsão é feita a cada 3 horas)
      const historicalData = [];
      for (let i = 0; i < 5; i++) {
        const index = i * interval;
        if (index < data.list.length) {
          const entry = data.list[index];
          historicalData.push({
            date: entry.dt_txt,
            temperature: Math.round(parseFloat(entry.main.temp)), // Converte para Celsius
          });
        }
      }

      //series enviado dados para o Grafico
      this.series = [
        {
          name: "Temperatura",
          data: historicalData.map((item) => item.temperature), // Temperaturas
        },
      ];

      return historicalData;
    },
    removeNotification(check) {
      this.notify = check;
    },
  },
  async mounted() {
    try {
      //remove os hifens e deixa o nome com letra Inicial Maiuscula
      let nameCity = null;
      if (this.$route.params && this.$route.params.name) {
        nameCity = `${this.$route.params.name
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())}`;
      }

      const { data } = await weatherForecast(nameCity);
      const historicalData = this.simulateFiveDays(data);
      const dataXaxis = historicalData.map((item) => {
        return dayjs(item.date).format("DD/MM");
      }); // Datas

      this.chartOptions.xaxis.categories.push(...dataXaxis);

      //atualiza o apexChart
      this.$nextTick(() => {
        if (
          this.$refs.chart &&
          typeof this.$refs.chart.updateOptions === "function"
        ) {
          this.$refs.chart.updateOptions(this.chartOptions);
        }
      });
    } catch (error) {
      this.notify = true;
      this.msg = "Erro ao dados meteorológicos da cidade";
    }
  },
};
</script>
