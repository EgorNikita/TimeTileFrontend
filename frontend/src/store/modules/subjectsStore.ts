import { SubjectDto } from "@/types/subject";
import { defineStore } from "pinia";
import { failure, success } from "@/utils/resultPattern";
import { fetchSubjects } from "@/services/subjectService";
import { subjectCache } from "@/store/cache/subjectCache";

interface SubjectContext {
  subjects: SubjectDto[];
}

export const useSubjectsStore = defineStore("subject", {
  state: () => ({
    loading: false,
    error: null as string | null,
    contexts: {} as Record<string, SubjectContext>
  }),

  getters: {
    getSubjects:
      (state) =>
        (contextKey: string): SubjectDto[] => {
          return state.contexts[contextKey]?.subjects || [];
        },
  },

  actions: {
    // Context management
    getContext(contextKey: string): SubjectContext {
      if (!this.contexts[contextKey]) {
        this.contexts[contextKey] = {
          subjects: []
        };
      }
      return this.contexts[contextKey];
    },

    // Load subjects
    async loadSubjectsBulk(
      ids: number[]
    ) {
      if (this.loading) return;

      this.loading = true;
      this.error = null;

      // Filter out already cached subjects
      const idsToLoad = ids.filter(id => !subjectCache.has(id));

      if (idsToLoad.length === 0) {
        this.loading = false;
        const subjectsFromCache = ids.map(id => subjectCache.get(id)!);
        return success(subjectsFromCache);
      }

      const response = await fetchSubjects({ ids: idsToLoad });

      if (response.isFailure) {
        console.log(response.error);
        const errorMessage = response.error || "Failed to load subjects";
        this.error = errorMessage;
        this.loading = false;
        return failure(errorMessage);
      }

      if (!response.data) {
        const errorMessage = "No data returned from API";
        this.error = errorMessage;
        this.loading = false;
        return failure(errorMessage);
      }

      console.log(response.data);

      const newSubjects = response.data;

      // Cache all subjects
      newSubjects.forEach((subject: SubjectDto) => subjectCache.set(subject));

      this.loading = false;

      return success(newSubjects)
    },

    // Clear all data
    reset() {
      this.error = null;
      this.loading = false;
      this.contexts = {};
    },
  }
})