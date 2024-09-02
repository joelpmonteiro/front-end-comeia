<template>
  <v-card>
    <v-card-title>
      {{ city?.name }}
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('removeCity', city?.name)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle v-if="city && city.weather && city.weather.length > 0"
      >{{ city?.main?.temp }}°C -
      {{ city?.weather[0].description }}
      <!-- <i>{{ city.weather[0].icon }}</i> -->
    </v-card-subtitle>
    <v-card-actions>
      <v-btn color="primary" @click="viewDetails(city?.name)">
        Ver Detalhes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { generateSlug } from "../../util/";
export default {
  name: "CardCity",
  props: {
    city: {
      type: Object,
      required: true,
      default: Object,
    },
  },
  // computed: {
  //   city() {
  //     return this.city;
  //   },
  // },
  methods: {
    viewDetails(name) {
      this.$router.push({
        path: `/details/${generateSlug(name)}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
