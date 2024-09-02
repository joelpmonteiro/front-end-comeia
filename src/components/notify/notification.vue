<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="timeout"
    absolute
    top
    color="success"
    right
  >
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "NotificationComponent",
  props: {
    notify: {
      type: Boolean,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
  },
  data: () => {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
    };
  },
  watch: {
    snackbar(newVal) {
      if (newVal) {
        this.snackbar = true;
        // Fechar o snackbar automaticamente após o tempo especificado
        setTimeout(() => {
          this.snackbar = false;
          this.$emit("removeNotification", this.snackbar);
        }, this.timeout);
      }
    },
  },
  mounted() {
    this.snackbar = this.notify;

    this.text = this.msg;
  },
};
</script>

<style lang="scss" scoped></style>
