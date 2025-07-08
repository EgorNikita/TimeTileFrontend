<script setup lang="ts">
interface Lesson {
  id: number;
  title: string;
  classwork: string;
  homework: string;
  date: string;
}

const props = defineProps<{
  lessons: Lesson[];
}>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<template>
  <div class="mt-4">
    <h3 class="text-sm font-semibold text-gray-700 mb-1">Lessons</h3>
    <ul class="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
      <li
        v-for="(lesson, index) in lessons"
        :key="lesson.id"
        class="text-sm text-gray-400 border-b py-2"
      >
        <!-- Lesson Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center space-x-3">
            <div
              class="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm"
            >
              {{ index + 1 }}
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">{{ lesson.title }}</h4>
              <p class="text-sm text-gray-500">{{ formatDate(lesson.date) }}</p>
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
              {{ lesson.classwork }}
            </span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-md text-gray-600">Homework:</span>
            <span
              :class="`px-2 py-0.5  rounded-md text-md font-medium text-blue-600 bg-blue-100`"
            >
              {{ lesson.homework }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
