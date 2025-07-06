import "./assets/main.css";
import "floating-vue/dist/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "@/router/router.js";
import FloatingVue from "floating-vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

const queryClient = new QueryClient();
const app = createApp(App);
const pinia = createPinia();

app.use(VueQueryPlugin, { queryClient });
app.use(pinia);
app.use(router);
app.use(FloatingVue, {
  themes: {
    "simple-tooltip": {
      $extend: "tooltip",
      $resetCss: true,
    },
    "arrowed-tooltip": {
      $extend: "simple-tooltip",
      $resetCss: false,
    },
  },
});
app.mount("#app");
