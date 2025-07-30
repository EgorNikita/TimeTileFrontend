import { defineStore } from "pinia";
import { ref, readonly } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // Authentication state
  const isAuthenticated = ref(false);
  const currentUserId = ref<number | null>(null);
  const currentInstitutionId = ref<number | null>(null);
  const isLoading = ref(false);

  // Actions
  const setAuthenticated = (studentId: number, institutionId: number) => {
    isAuthenticated.value = true;
    currentUserId.value = studentId;
    currentInstitutionId.value = institutionId;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const clearAuth = () => {
    isAuthenticated.value = false;
    currentUserId.value = null;
    currentInstitutionId.value = null;
  };

  return {
    // State
    isAuthenticated: readonly(isAuthenticated),
    currentUserId: readonly(currentUserId),
    currentInstitutionId: readonly(currentInstitutionId),
    isLoading: readonly(isLoading),

    // Actions
    setAuthenticated,
    setLoading,
    clearAuth,
  };
});
