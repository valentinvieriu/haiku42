// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  nitro: {
    preset: "cloudflare-pages",
  },

  modules: ["nitro-cloudflare-dev", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  build: {
    transpile: ["@nuxtjs/tailwindcss", "pinia"],
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || '/api'
    }
  }
});