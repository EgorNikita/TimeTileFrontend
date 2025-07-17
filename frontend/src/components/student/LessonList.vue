<script setup lang="ts">
import { computed } from "vue";
import { useStudentLessonInfoWithGrades } from "@/tanStackQueries/student/student/useStudentLessonInfoWithGrades";
import { useAuthStore } from "@/store/modules/auth";
import { useStudentAttendanceCount } from "@/tanStackQueries/student/student/useStudentAttendanceCount";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";
import { formatDateTo21May2025 } from "@/utils/dateUtils";

const props = defineProps<{
  courseId: number;
}>();

const auth = useAuthStore();
const userId = auth.userId!;

const studentLessonInfoQuery = useStudentLessonInfoWithGrades(userId, {
  courseIds: [props.courseId],
});

const lessons = computed(
  () =>
    studentLessonInfoQuery.data.value?.pages?.flatMap((page) => page.items) ??
    [],
);

const attendanceCount = useStudentAttendanceCount(userId, {
  courseIds: [props.courseId],
});

const completedLessons = computed(
  () => attendanceCount.data.value?.attendedLessons ?? 0,
);

const totalLessons = computed(
  () => attendanceCount.data.value?.totalLessons ?? 0,
);

const isInitialLoading = computed(
  () =>
    studentLessonInfoQuery.isLoading.value || attendanceCount.isLoading.value,
);

const getProgressPercentage = (completed: number, total: number): number => {
  return Math.round((completed / total) * 100);
};
</script>

<template>
  <div class="mb-6">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-700">Progress</span>
      <span class="text-sm text-gray-600">
        {{ completedLessons }}/{{ totalLessons }} lessons
      </span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-3">
      <div
        class="bg-stone-800 h-3 rounded-full transition-all duration-500"
        :style="`width: ${getProgressPercentage(completedLessons, totalLessons)}%`"
      ></div>
    </div>
    <div class="text-right text-sm text-gray-600 mt-1">
      {{ getProgressPercentage(completedLessons, totalLessons) }}% Complete
    </div>
  </div>

  <div class="mt-4">
    <h3 class="text-sm font-semibold text-gray-700 mb-1">Lessons</h3>

    <!-- Initial Loading State -->
    <div v-if="isInitialLoading" class="flex justify-center items-center py-8">
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"
      ></div>
      <span class="ml-2 text-gray-600 text-sm">Loading lessons...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="lessons.length === 0" class="text-center py-8">
      <div class="text-gray-500 text-sm">No lessons found for this course.</div>
    </div>

    <!-- Lessons List with Lazy Loading -->
    <div v-else class="h-72">
      <LazyScrollWrapper
        :query="studentLessonInfoQuery"
        :scroll-threshold="100"
        loading-text="Loading more lessons..."
      >
        <ul class="space-y-1 pr-2 overflow-hidden">
          <li
            v-for="(lesson, index) in lessons"
            :key="lesson.lessonId"
            class="text-sm text-gray-400 border-b py-2"
          >
            <!-- Lesson Header -->
            <div class="flex items-start justify-between mb-2 min-w-0">
              <div
                class="flex items-center min-w-0 space-x-3"
                v-tooltip="{
                  content: lesson.lesson.description,
                  theme: 'arrowed-tooltip',
                  strategy: 'fixed',
                  boundary: 'scrollParent',
                  flip: true,
                  preventOverflow: true,
                }"
              >
                <div
                  class="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm"
                >
                  {{ index + 1 }}
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="font-semibold text-gray-800 truncate">
                    {{ lesson.lesson.description }}
                  </h4>
                  <p class="text-sm text-gray-500">
                    {{ formatDateTo21May2025(lesson.lesson.date) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Grades -->
            <div class="flex space-x-2 mt-3">
              <div class="flex items-center space-x-1">
                <span class="text-md text-gray-600">Classwork:</span>
                <span
                  class="px-2 py-0.5 rounded-sm text-md font-medium text-green-600 bg-green-100"
                >
                  {{ lesson.classworkGrade?.value ?? "-" }}
                </span>
              </div>
              <div class="flex items-center space-x-1">
                <span class="text-md text-gray-600">Homework:</span>
                <span
                  :class="`px-2 py-0.5  rounded-md text-md font-medium text-blue-600 bg-blue-100`"
                >
                  {{ lesson.homeworkGrade?.value ?? "-" }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </LazyScrollWrapper>
    </div>
  </div>
</template>
