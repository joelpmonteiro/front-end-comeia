<template>
  <!-- Botão flutuante para adicionar cidade -->
  <v-btn
    fab
    color="primary"
    bottom
    right
    absolute
    @click="$emit('showAddCityDialog', true)"
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "ButtonAddCity",
  data() {
    return {
      showAddCityDialog: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
