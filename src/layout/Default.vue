<template>
  <v-app>
    <v-main>
      <AppBar @goBack="goBack" :name="routerName"></AppBar>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "../components/header/AppBar.vue";
import { generateSlug } from "../util/";

export default {
  components: {
    AppBar,
  },
  name: "DefaultLayout",
  data() {
    return {};
  },
  computed: {
    routerName() {
      return this.$route.path === "/"
        ? this.$route.name || "Climas nas Cidades"
        : `${this.$route.name} - ${this.routeDetails()}`;
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    routeDetails() {
      const cities = JSON.parse(localStorage.getItem("city"));
      if (
        cities &&
        cities.data.length > 0 &&
        this.$route.name.toLowerCase() ===
          "Histórico de Temperaturas".toLowerCase()
      ) {
        if (this.$route.params && this.$route.params.name) {
          const name = generateSlug(this.$route.params.name).replace(/-/g, " ");

          return cities.data.find((v) => {
            return generateSlug(v.name).replace(/-/g, " ") === name;
          }).name;
        }
      }
    },
  },
  mounted() {
    const cities = JSON.parse(localStorage.getItem("city"));
    if (
      cities &&
      cities.data.length > 0 &&
      this.$route.name.toLowerCase() ===
        "Histórico de Temperaturas".toLowerCase()
    ) {
      if (this.$route.params && this.$route.params.name) {
        const name = generateSlug(this.$route.params.name).replace(/-/g, " ");

        this.city = cities.data.find((v) => {
          return generateSlug(v.name).replace(/-/g, " ") === name;
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>
