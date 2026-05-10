// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  ssr: false,
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  routeRules: {
    "/api/**": {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    },
  },
  vite: {
    server: {
      allowedHosts: [
        "localhost:3001",
        ".github.io",
        ".ngrok-free.dev",
        ".loca.lt",
        "loca.lt",
        "mean-radios-invite.loca.lt",
      ],
    },
    plugins: [svgLoader()],
  },
  runtimeConfig: {
    vkToken:
      "vk1.a.T2Kc7YTRzlX-G2h_OfwxsdqxwDONPahQdFgaMKXHIGCSljy0tCXvrz0z3AbnR7PreVf6A08XfH9zNd-w77VBfIhp6vtJHChrxW_134E_6n0zDFPeIE7BPdii_Cba07uCyaNK0ED8blobkVwPKCPZSmxoVuPOd0og9qIhwHH1bvyxZtcFZolf8uKD4Z4QCReMpDL383YjbcxguFQgmgRciQ",
  },
});
