import { defineStore } from "pinia";
import { fetchCourses, fetchCourseById } from "@/services/courseService";
import { CourseDto } from "@/types/course";
import { courseCache } from "@/store/cache/courseCache";
import { failure, success } from "@/utils/resultPattern";

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
  studentId?: number;
  subjectId?: string;
}

export const useStudentCourseStore = defineStore("studentCourse", {
  state: () => ({
    loading: false,
    error: null as string | null,
    currentCourse: null as CourseDto | null,
    studentId: null as number | null,
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
    setStudentId(studentId: number) {
      this.studentId = studentId;
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

      this.loading = true;
      this.error = null;

      const context = this.getContext(contextKey);
      const page = loadMore ? context.pagination.page + 1 : 1;

      const response = await fetchCourses({
        ...filters,
        page: page,
        pageSize: context.pagination.pageSize,
      });

      if (!response.isSuccess) {
        console.log(response.error);
        const errorMessage = response.error || "Failed to load courses";
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

      const { items: newCourses, totalCount: total } = response.data;

      console.log(response.data);

      // Update pagination
      context.pagination = { ...context.pagination, page, total };

      // Update courses
      if (loadMore) {
        this.mergeCourses(context, newCourses);
      } else {
        context.courses = newCourses;
      }

      console.log(
        `Loaded ${newCourses.length} courses for context "${contextKey}"`,
      );

      // Cache all courses
      newCourses.forEach((course: CourseDto) => courseCache.set(course));
      this.loading = false;

      return success({
        courses: newCourses,
        total,
        hasMore: this.hasMoreCourses(contextKey),
      });
    },

    // // Load single course
    // async loadSingleCourse(courseId: number) {
    //   try {
    //     this.loading = true;
    //     this.error = null;
    //
    //     // Check cache first
    //     const cached = courseCache.get(courseId);
    //     if (cached) {
    //       this.setCurrentCourse(cached);
    //       return;
    //     }
    //
    //     const response = await fetchCourseById(courseId.toString());
    //     if (!response.isSuccess) {
    //       throw new Error(response.error || "Course not found");
    //     }
    //
    //     this.setCurrentCourse(response.data);
    //   } catch (error) {
    //     this.clearCurrentCourse();
    //     this.error = error instanceof Error ? error.message : "Unknown error";
    //   } finally {
    //     this.loading = false;
    //   }
    // },

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
