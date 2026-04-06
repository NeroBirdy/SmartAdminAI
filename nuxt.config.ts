// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: ['.loca.lt', 'loca.lt', 'mean-radios-invite.loca.lt']
    }
  },
  runtimeConfig: {
    vkToken: 'vk1.a._0Dq8tOE0Qg4UbRzeHJLoHwyl1Qy4CGKdziXZz5eEhZ__tzMWMyrjw8C-jjHtNlo2MmOqB9sf2x43g8ja6Eb8xrkemOp1m1RjRdCqUzhNX8cZsRUJcsaXK6GP0M3LwUDnJBVD1O4s0HLJZNH7V5cJwdo_3hQcuGPGnhKF0lpLO7-Wpyc-stORYD3wgyMd7vXT623umJ5Gk_b3uq6TDq5Lg'
  },
});
