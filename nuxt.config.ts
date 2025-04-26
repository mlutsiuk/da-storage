// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['trpc-nuxt']
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/devtools',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@vite-pwa/nuxt'
  ],

  imports: {
    dirs: [
      'store'
    ]
  },

  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },

  typescript: {
    tsConfig: {
      include: [
        './prisma/json-types.ts'
      ]
    },
    strict: true
  },

  experimental: {
    typedPages: true
  },

  ssr: false,

  pwa: {
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    manifest: {
      name: 'DA Storage',
      short_name: 'DA Storage',
      description: 'DA Storage - App to manage stockpiles',
      lang: 'en',
      start_url: '/',
      display: 'standalone',
      theme_color: '#0E1927',
      background_color: '#0E1927',
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    }
  },

  runtimeConfig: {
    jwt: {
      secret: '',
      alg: '',
      exp: ''
    },

    googleClientId: '',
    googleClientSecret: '',
    googleCallbackUrl: ''
  },

  compatibilityDate: '2024-09-01'
})