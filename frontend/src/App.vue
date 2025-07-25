<script>
import LoginView from "@/views/LoginView.vue";
import { useSignalRStore } from "@/store/modules/signalR.js";
import { onMounted, onUnmounted } from "vue";

export default {
  components: { LoginView },
  setup() {
    const signalR = useSignalRStore();

    onMounted(async () => {
      if (!signalR.isConnected) {
        await signalR.connect();
      }
    });

    onUnmounted(async () => {
      await signalR.disconnect();
    })
  },
};
</script>

<template>
  <div class="h-screen overflow-hidden">
    <router-view />
  </div>
</template>
