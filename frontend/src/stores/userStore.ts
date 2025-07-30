import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue";
import { User } from "@/services/userApi";

export const useUserStore = defineStore("user", () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);

  // Getters (only for computed/derived data)
  const getFullName = computed(() => {
    if (!user.value) return "";
    return `${user.value.firstname} ${user.value.lastname}`;
  });

  // Actions
  const setUser = (userData: User) => {
    user.value = userData;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const clearUser = () => {
    user.value = null;
    isLoading.value = false;
  };

  return {
    // State
    user: readonly(user),
    isLoading: readonly(isLoading),

    // Getters
    getFullName,

    // Actions
    setUser,
    setLoading,
    clearUser,
  };
});
