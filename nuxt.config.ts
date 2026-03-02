export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  colorMode: {
    preference: 'dark',
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:8000',
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-01-01',
})
