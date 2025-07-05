import "./assets/main.css";
import "floating-vue/dist/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "@/router/router.js";
import FloatingVue from "floating-vue";

const app = createApp(App);
const pinia = createPinia();

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
