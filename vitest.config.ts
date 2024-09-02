import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue2";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/tests/unit/**/*.spec.{js,ts}"],
    setupFiles: [
      "./tests/vuetify.js",
      "./tests/mocks/apexcharts.js",
      "./vitest.setup.js",
    ], // Adicione o setup do Vuetify aqui
    coverage: {
      enabled: true,
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{js,vue}"],
      exclude: ["**/node_modules/**"],
      all: true,
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
      // thresholds: {
      //   global: {
      //     branches: 80,
      //     functions: 80,
      //     lines: 80,
      //     statements: 80,
      //   },
      // },
    },
  },
});
