<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/authStore.ts.js";
import navItems from "@/navigation/teacherNav";
import Sidebar from "@/components/common/Sidebar.vue";

const auth = useAuthStore();
const router = useRouter();

const visibleNavItems = navItems.filter((item) => {
  if (!item.permissions) return true;
  return item.permissions.every((p) => auth.permissions.includes(p));
});
</script>

<template>
  <div class="flex h-screen">
    <Sidebar :nav-items="navItems" />

    <!-- main content -->
    <main class="flex-1 overflow-y-auto bg-gray-50">
      <RouterView />
    </main>
  </div>
</template>
