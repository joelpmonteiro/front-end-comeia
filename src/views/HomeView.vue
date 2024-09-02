<template>
  <v-container fluid>
    <v-row justify="center" align="center" class="my-4">
      <!-- Card para cada cidade -->
      <v-col
        v-for="(city, index) in showCities"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <CardCity
          v-if="city && city.weather !== null && city.weather !== undefined"
          @removeCity="removeCity"
          :city="city.weather"
        ></CardCity>
      </v-col>
    </v-row>

    <ButtonAddCity @showAddCityDialog="showAddCityDialogFn"></ButtonAddCity>

    <DialogModal
      v-if="showAddCityDialog"
      :open="showAddCityDialog"
      @addCityDialog="addCity"
      @showAlert="showAlert"
      @showAddCityDialog="showAddCityDialog = !showAddCityDialog"
    ></DialogModal>

    <Notification
      v-if="this.notify"
      @removeNotification="removeNotification"
      :notify="this.notify"
      :msg="this.msg"
    ></Notification>
  </v-container>
</template>

<script>
import DialogModal from "../components/modal/Dialog.vue";
import CardCity from "../components/Card/CardCity.vue";
import ButtonAddCity from "../components/Buttons/ButtonAddCity.vue";
import { weather } from "../api/weather/weather";
import Notification from "../components/notify/notification.vue";
export default {
  components: {
    DialogModal,
    CardCity,
    ButtonAddCity,
    Notification,
  },
  data() {
    return {
      cities: [
        { name: "London", weather: null },
        { name: "New York", weather: null },
        { name: "Tokyo", weather: null },
        { name: "Sydney", weather: null },
        { name: "São Paulo", weather: null },
      ],
      showAddCityDialog: false,
      newCity: "",
      cacheDuration: 10 * 60 * 1000,
      apiCallCount: 0,
      apiCallLimit: 60,
      notify: false,
      msg: "",
    };
  },
  computed: {
    showCities() {
      return this.cities.map((v) => v);
    },
    localStorageGet() {
      return JSON.parse(localStorage.getItem("city"));
    },
  },
  methods: {
    showAddCityDialogFn(check) {
      this.showAddCityDialog = check;
    },
    loadCitiesFromLocalStorage() {
      this.cities = this.getCachedWeather("city");
    },
    removeNotification(check) {
      this.notify = check;
    },

    async fetchCityWeather() {
      try {
        if (this.apiCallCount >= this.apiCallLimit) {
          this.notify = true;
          this.msg =
            "Limite de chamadas à API atingido. Tente novamente mais tarde.";
          return;
        }

        for (const city of this.cities) {
          this.apiCallCount++;
          const { data } = await weather(city.name);
          city.weather = data;
        }

        this.setCachedWeather("city", this.cities);
      } catch (error) {
        console.log("fetchCityWeather:", error);
        this.notify = true;
        this.msg = "Erro ao buscar as cidades";
      }
    },
    showAlert(msg) {
      this.notify = true;
      this.msg = msg;
      setTimeout(() => {
        this.removeNotification(false);
      }, 2000);
    },
    async addCity(name) {
      try {
        if (name === "") {
          throw "Erro ao adicionar a cidade";
        }
        const { data } = await weather(name);
        this.cities.push({
          name: name,
          weather: data,
        });
        this.setCachedWeather("city", this.cities);
        this.showAddCityDialog = false;

        this.notify = true;
        this.msg = "Cidade Adicionada com sucesso!";
      } catch (error) {
        this.notify = true;
        this.msg = "Erro ao adicionar a cidade";
      }
    },
    getCachedWeather(cityName) {
      //const cityBkp = this.cities;
      const cached = JSON.parse(localStorage.getItem(cityName));
      return cached && Date.now() - cached.timestamp < this.cacheDuration
        ? cached.data
        : this.cities;
    },
    setCachedWeather(cityName, data) {
      localStorage.setItem(
        cityName,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    },
    removeCity(name) {
      const index = this.cities.findIndex((v) => {
        return v.weather.name === name;
      });

      if (index !== -1) {
        this.cities.splice(index, 1);
        this.setCachedWeather("city", this.cities);
        this.notify = true;
        this.msg = "Cidade removida com sucesso!";
      } else {
        this.notify = true;
        this.msg = "Seleciona uma cidade para remover";
      }
    },
  },

  async mounted() {
    //this.loadCitiesFromLocalStorage();

    try {
      await this.fetchCityWeather();
    } catch (error) {
      this.notify = true;
      this.msg = "Erro ao buscar as cidades";
    }

    // Reset contador de chamadas a cada minuto
    setInterval(() => {
      this.apiCallCount = 0;
    }, 60000);
  },
};
</script>
