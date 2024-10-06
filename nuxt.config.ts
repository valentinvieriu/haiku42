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

  modules: ["nitro-cloudflare-dev", "@nuxtjs/tailwindcss"],
  build: {
    transpile: ["@nuxtjs/tailwindcss"],
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || '/api'
    }
  },

  // Add the app configuration here
  app: {
    head: {
      title: 'Haiku Generator',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        // Apple Touch Icons
        { rel: 'apple-touch-icon', href: '/icon_x192.png' },
        { rel: 'apple-touch-icon', sizes: '57x57', href: '/icon_x57.png' },
        { rel: 'apple-touch-icon', sizes: '72x72', href: '/icon_x72.png' },
        { rel: 'apple-touch-icon', sizes: '76x76', href: '/icon_x76.png' },
        { rel: 'apple-touch-icon', sizes: '114x114', href: '/icon_x114.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/icon_x120.png' },
        { rel: 'apple-touch-icon', sizes: '144x144', href: '/icon_x144.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/icon_x152.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icon_x180.png' },
        // Android Icons
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon_x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/icon_x512.png' },
        // Favicon
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    }
  }
});