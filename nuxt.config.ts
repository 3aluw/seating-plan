// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/i18n"
  ],
  i18n: {
    defaultLocale: "en",
    strategy: "no_prefix", // no /en or /ar in the URL
    locales: [
      { code: "en", name: "English", dir: "ltr", },
      { code: "ar", name: "العربية", dir: "rtl", },
    ],
    detectBrowserLanguage: false, // we'll handle ?lang manually
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  devtools: { enabled: false },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});
