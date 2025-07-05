import { defineStore } from "pinia";
import { fetchStudentCourses, fetchCourseById } from "@/services/courseService";
import { CourseDto } from "@/types/course";
import { courseCache } from "@/store/cache/courseCache";

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

interface CourseContext {
  pagination: Pagination;
  courses: CourseDto[];
}

interface CourseFilters {
  subjectId?: string;
}

export const useStudentCourseStore = defineStore("studentCourse", {
  state: () => ({
    loading: false,
    error: null as string | null,
    currentCourse: null as CourseDto | null,
    contexts: {} as Record<string, CourseContext>,
  }),

  getters: {
    getCourses:
      (state) =>
      (contextKey: string): CourseDto[] => {
        return state.contexts[contextKey]?.courses || [];
      },

    hasMoreCourses:
      (state) =>
      (contextKey: string): boolean => {
        const context = state.contexts[contextKey];
        if (!context) return false;
        const { page, pageSize, total } = context.pagination;
        return page * pageSize < total;
      },

    isCurrentCourse:
      (state) =>
      (courseId: number): boolean => {
        return state.currentCourse?.id === courseId;
      },
  },

  actions: {
    // Context management
    getContext(contextKey: string): CourseContext {
      if (!this.contexts[contextKey]) {
        this.contexts[contextKey] = {
          courses: [],
          pagination: { page: 1, pageSize: 10, total: 0 },
        };
      }
      return this.contexts[contextKey];
    },

    // Current course management
    setCurrentCourse(course: CourseDto) {
      this.currentCourse = course;
      courseCache.set(course);
    },

    clearCurrentCourse() {
      this.currentCourse = null;
    },

    // Load courses with pagination
    async loadStudentCourses(
      contextKey: string,
      filters: CourseFilters = {},
      loadMore = false,
    ) {
      if (this.loading) return;

      try {
        this.loading = true;
        this.error = null;

        const context = this.getContext(contextKey);
        const page = loadMore ? context.pagination.page + 1 : 1;

        const response = await fetchStudentCourses({
          ...filters,
          page,
          pageSize: context.pagination.pageSize,
        });

        if (!response.isSuccess) {
          throw new Error(response.error || "Failed to load courses");
        }

        const { items: newCourses, total } = response.data;

        // Update pagination
        context.pagination = { ...context.pagination, page, total };

        // Update courses
        if (loadMore) {
          this.mergeCourses(context, newCourses);
        } else {
          context.courses = newCourses;
        }

        // Cache all courses
        newCourses.forEach((course: CourseDto) => courseCache.set(course));
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Unknown error";
      } finally {
        this.loading = false;
      }
    },

    // Load single course
    async loadSingleCourse(courseId: number) {
      try {
        this.loading = true;
        this.error = null;

        // Check cache first
        const cached = courseCache.get(courseId);
        if (cached) {
          this.setCurrentCourse(cached);
          return;
        }

        const response = await fetchCourseById(courseId.toString());
        if (!response.isSuccess) {
          throw new Error(response.error || "Course not found");
        }

        this.setCurrentCourse(response.data);
      } catch (error) {
        this.clearCurrentCourse();
        this.error = error instanceof Error ? error.message : "Unknown error";
      } finally {
        this.loading = false;
      }
    },

    // Update course across all contexts
    updateCourse(course: CourseDto) {
      // Update in all contexts
      Object.values(this.contexts).forEach((context) => {
        const index = context.courses.findIndex((c) => c.id === course.id);
        if (index !== -1) {
          context.courses[index] = course;
        }
      });

      // Update current course if it matches
      if (this.currentCourse?.id === course.id) {
        this.currentCourse = course;
      }

      // Update cache
      courseCache.set(course);
    },

    // Remove course from all contexts
    removeCourse(courseId: number) {
      // Remove from all contexts
      Object.values(this.contexts).forEach((context) => {
        context.courses = context.courses.filter((c) => c.id !== courseId);
      });

      // Clear current course if it matches
      if (this.currentCourse?.id === courseId) {
        this.clearCurrentCourse();
      }

      // Remove from cache
      courseCache.delete(courseId);
    },

    // Helper: Merge courses avoiding duplicates
    mergeCourses(context: CourseContext, newCourses: CourseDto[]) {
      const existingIds = new Set(context.courses.map((c) => c.id));
      const uniqueNewCourses = newCourses.filter((c) => !existingIds.has(c.id));
      context.courses.push(...uniqueNewCourses);
    },

    // Clear all data
    reset() {
      this.contexts = {};
      this.currentCourse = null;
      this.error = null;
      this.loading = false;
      courseCache.clear();
    },
  },
});
