import "./assets/main.css";
import "floating-vue/dist/style.css";

import App from "@/App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "@/router/router.js";
import FloatingVue from "floating-vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { useAuth } from "@/composables/useAuth";

const queryClient = new QueryClient();
const pinia = createPinia();
const app = createApp(App);

const setupUnauthorizedHandler = () => {
  let isHandling = false; // Prevent multiple simultaneous logouts

  const handleUnauthorized = async () => {
    if (isHandling) return;
    isHandling = true;

    try {
      console.log("401 Unauthorized detected - logging out user");
      const { auth } = useAuth();
      await auth.logout();

      // Optional: redirect to login page
      if (router.currentRoute.value.path !== "/login") {
        await router.push("/login");
      }
    } catch (error) {
      console.error("Error during unauthorized logout:", error);
    } finally {
      isHandling = false;
    }
  };

  window.addEventListener("auth:unauthorized", handleUnauthorized);

  // Cleanup function (though not needed in main.ts)
  return () => {
    window.removeEventListener("auth:unauthorized", handleUnauthorized);
  };
};

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
setupUnauthorizedHandler();
