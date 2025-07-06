import {defineStore} from "pinia";
import {GradeDto} from "@/types/grade";
import {fetchGrades} from "@/services/gradeService";
import {failure, success} from "@/utils/resultPattern";
import {subjectCache} from "@/store/cache/subjectCache";
import {useSubjectsStore} from "@/store/modules/subjectsStore";
import {Pagination} from "@/common/types/pagination";

interface GradeContext {
    pagination: Pagination;
    grades: GradeDto[];
}

interface GradeFilters {
    lessonIds?: number[];
    studentIds?: number[];
    courseIds?: number[];
    types?: GradeType[];
}

const subjectStore = useSubjectsStore();

export const useGradesStore = defineStore("grade", {
    state: () => ({
        loading: false,
        error: null as string | null,
        contexts: {} as Record<string, GradeContext>
    }),

    getters: {
        getGrades:
            (state) =>
                (contextKey: string): GradeDto[] => {
                    return state.contexts[contextKey]?.grades || [];
                },

        hasMoreGrades:
            (state) =>
                (contextKey: string): boolean => {
                    const context = state.contexts[contextKey];
                    if (!context) return false;
                    const { page, totalPages } = context.pagination;
                    return page < totalPages;
                },

    },

    actions: {
        // Context management
        getContext(contextKey: string): GradeContext {
            if (!this.contexts[contextKey]) {
                this.contexts[contextKey] = {
                    grades: [],
                    pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
                };
            }
            return this.contexts[contextKey];
        },

        // Load grades
        async loadGrades(
            contextKey: string,
            filters: GradeFilters = {},
            loadMore = false,
            forceReload = false
        ) {
            if (this.loading) return;

            this.loading = true;
            this.error = null;

            const context = this.getContext(contextKey);

            // If not loading more and data exists (and no forced reload), skip fetch
            if (!loadMore && !forceReload && context.grades.length > 0) {
                return success(context.grades);
            }

            const page = loadMore ? context.pagination.page + 1 : 1;

            const response = await fetchGrades({
                ...filters,
                page: page,
                pageSize: context.pagination.pageSize,
            });

            if (response.isFailure) {
                console.log(response.error);
                const errorMessage = response.error || "Failed to load grades";
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

            const { items: newGrades, totalCount: totalCount, totalPages: totalPages } = response.data;

            console.log(response.data);

            context.pagination = {
                page,
                pageSize: context.pagination.pageSize,
                totalCount,
                totalPages
            };

            // Fetch missing subjects
            const uniqueSubjectIds = [...new Set(newGrades.map(g => g.subjectId))];
            const missingSubjects = uniqueSubjectIds.filter(id => !subjectCache.has(id));
            if (missingSubjects.length) {
                await subjectStore.loadSubjectsBulk(missingSubjects);
            }

            if (loadMore) {
                this.mergeGrades(context, newGrades);
            } else {
                context.grades = newGrades;
            }

            this.loading = false;

            return success(newGrades)
        },

        mergeGrades(context: GradeContext, newGrades: GradeDto[]) {
            const existingIds = new Set(context.grades.map((r) => r.id));
            const uniqueNewGrades = newGrades.filter(g => !existingIds.has(g.id));
            context.grades.push(...uniqueNewGrades);
        },

        // Clear all data
        reset() {
            this.error = null;
            this.loading = false;
            this.contexts = {};
        },
    }

})