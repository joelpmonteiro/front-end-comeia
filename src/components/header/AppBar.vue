<template>
  <v-app-bar app color="primary" dark>
    <v-btn v-if="$route.path !== '/'" icon @click="$emit('goBack')">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>{{ name }}</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
