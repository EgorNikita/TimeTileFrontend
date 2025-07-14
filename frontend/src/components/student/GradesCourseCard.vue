<script setup lang="ts">
import LessonList from "./LessonList.vue";

interface CourseCard {
  id: number;
  title: string;
  subject: string;
  termMark?: number;
  averageMark: number;
}

const props = defineProps<{
  courseCard: CourseCard;
}>();

</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Card Header -->
    <div class="bg-stone-900 p-6 text-white">
      <div class="flex items-center justify-between">
        <div
          class="min-w-0 flex-1 mr-10"
          v-tooltip="{
            content: courseCard.title,
            theme: 'arrowed-tooltip',
            strategy: 'fixed',
            boundary: 'scrollParent',
            flip: true,
            preventOverflow: true,
          }"
        >
          <h2 class="text-2xl font-bold truncate">
            {{ courseCard.title }}
          </h2>
          <p class="text-white/80 text-sm mt-1 truncate max-w-xs">{{ courseCard.subject }}</p>
        </div>
        <img
          class="h-18 w-18 rounded-md"
          :src="'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'"
          alt=""
        />
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-6" ref="scrollContainerRef">
      <!-- Grade Statistics -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="text-center p-4 bg-gray-50 rounded-md">
          <div class="text-2xl font-bold text-gray-800">
            {{ courseCard.termMark?.toFixed(1) ?? '-' }}
          </div>
          <div class="text-sm text-gray-600">Term Mark</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-md">
          <div class="text-2xl font-bold text-gray-800">
            {{ courseCard.averageMark.toFixed(1) }}
          </div>
          <div class="text-sm text-gray-600">Average</div>
        </div>
      </div>

      <LessonList :course-id="courseCard.id" />
    </div>
  </div>
</template>
