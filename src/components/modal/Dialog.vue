<template>
  <v-dialog v-model="showAddCityDialog" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Adicionar Cidade</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="newCity"
          label="Nome da Cidade"
          autofocus
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="addCity">Adicionar</v-btn>
        <v-btn text @click.prevent="closeDialog">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogModal",
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showAddCityDialog: this.open,
      newCity: "",
    };
  },
  methods: {
    addCity() {
      if (this.newCity) {
        this.$emit("addCityDialog", this.newCity);
        this.newCity = "";
      } else {
        this.$emit("showAlert", "Nome da cidade é obrigatório");
      }
      this.showAddCityDialog = false;
    },
    closeDialog() {
      this.showAddCityDialog = false;
      this.$emit("showAddCityDialog");
    },
  },
  mounted() {
    console.log(open);
    this.showAddCityDialog = open;
  },
};
</script>

<style lang="scss" scoped></style>
