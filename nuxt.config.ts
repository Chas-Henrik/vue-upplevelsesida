import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/', // Tell Nuxt to use app/ as the source directory
  ssr: false, // SPA mode
  css: ['~/assets/css/main.css'], // Use ~/ alias (relative to srcDir)
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
