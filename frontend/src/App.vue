<script lang="ts">
import { goToDefaultRoute } from "@/router/navigation";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    onMounted(() => {
      goToDefaultRoute();
    });
  },
});
</script>

<template>
  <div class="h-screen overflow-hidden">
    <router-view />
  </div>
</template>
