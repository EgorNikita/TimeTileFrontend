import { defineStore } from "pinia";
import { ref, readonly } from "vue";
import { Institution } from "@/services/institutionApi";

export const useInstitutionStore = defineStore("institution", () => {
  // State
  const institution = ref<Institution | null>(null);
  const isLoading = ref(false);

  // Actions
  const setInstitution = (institutionData: Institution) => {
    institution.value = institutionData;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  const clearInstitution = () => {
    institution.value = null;
    isLoading.value = false;
  };

  return {
    // State
    institution: readonly(institution),
    isLoading: readonly(isLoading),

    // Actions
    setInstitution,
    setLoading,
    clearInstitution,
  };
});
