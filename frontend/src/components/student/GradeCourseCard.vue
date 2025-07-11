<script setup lang="ts">
import LessonList from "./LessonList.vue";

interface Course {
  title: string;
  subject: string;
  termMark: number;
  averageMark: number;
  completedLessons: number;
  totalLessons: number;
  lessons: Array<{
    id: number;
    title: string;
    date: string;
    classworkGrade: string;
    homeworkGrade: string;
  }>;
}

interface GradeInfo {
  id: number;
  value: number;
  subjectId: number;
  subjectTitle: string;
  type: string;
  date: string;
}

const props = defineProps<{
  course: Course;
}>();

const getProgressPercentage = (completed: number, total: number): number => {
  return Math.round((completed / total) * 100);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Card Header -->
    <div class="bg-stone-900 p-6 text-white">
      <div class="flex items-center justify-between">
        <div
          class="min-w-0 flex-1 mr-10"
          v-tooltip="{
            content: course.title,
            theme: 'arrowed-tooltip',
            strategy: 'fixed',
            boundary: 'scrollParent',
            flip: true,
            preventOverflow: true,
          }"
        >
          <h2 class="text-2xl font-bold truncate">
            {{ course.title }}
          </h2>
          <p class="text-white/80 text-sm mt-1">{{ course.subject }}</p>
        </div>
        <img
          class="h-18 w-18 rounded-md"
          :src="'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'"
          alt=""
        />
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-6">
      <!-- Grade Statistics -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="text-center p-4 bg-gray-50 rounded-md">
          <div class="text-2xl font-bold text-gray-800">
            {{ course.termMark }}
          </div>
          <div class="text-sm text-gray-600">Term Mark</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-md">
          <div class="text-2xl font-bold text-gray-800">
            {{ course.averageMark }}
          </div>
          <div class="text-sm text-gray-600">Average</div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Progress</span>
          <span class="text-sm text-gray-600">
            {{ course.completedLessons }}/{{ course.totalLessons }} lessons
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="bg-stone-800 h-3 rounded-full transition-all duration-500"
            :style="`width: ${getProgressPercentage(course.completedLessons, course.totalLessons)}%`"
          ></div>
        </div>
        <div class="text-right text-sm text-gray-600 mt-1">
          {{
            getProgressPercentage(course.completedLessons, course.totalLessons)
          }}% Complete
        </div>
      </div>

      <LessonList :lessons="course.lessons" />
    </div>
  </div>
</template>
