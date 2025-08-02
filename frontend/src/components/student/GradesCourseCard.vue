<script setup lang="ts">
import LessonList from "./LessonList.vue";
import { EnrichedStudentCourseInfo } from "@/types/studentCourseInfo";

const props = defineProps<{
  courseInfo: EnrichedStudentCourseInfo;
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Card Header -->
    <div class="bg-stone-900 p-4 sm:p-6 text-white">
      <div class="flex items-center justify-between gap-3 sm:gap-4">
        <div
          class="min-w-0 flex-1"
          v-tooltip="{
            content: courseInfo.course.title,
            theme: 'arrowed-tooltip',
            strategy: 'fixed',
            boundary: 'scrollParent',
            flip: true,
            preventOverflow: true,
          }"
        >
          <h2
            class="text-lg sm:text-xl lg:text-2xl font-bold truncate leading-tight"
          >
            {{ courseInfo.course.title }}
          </h2>
          <p class="text-white/80 text-xs sm:text-sm mt-1 truncate">
            {{ courseInfo.subjectTitle }}
          </p>
        </div>
        <img
          class="h-12 w-12 sm:h-16 sm:w-16 lg:h-18 lg:w-18 rounded-md flex-shrink-0 object-cover"
          :src="courseInfo.course.iconUrl || 'https://via.placeholder.com/72'"
          alt=""
        />
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-4 sm:p-6" ref="scrollContainerRef">
      <!-- Grade Statistics -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="text-center p-3 sm:p-4 bg-gray-50 rounded-md">
          <div class="text-xl sm:text-2xl font-bold text-gray-800">
            {{ courseInfo.termMark?.toFixed(1) ?? "-" }}
          </div>
          <div class="text-xs sm:text-sm text-gray-600 mt-1">Term Mark</div>
        </div>
        <div class="text-center p-3 sm:p-4 bg-gray-50 rounded-md">
          <div class="text-xl sm:text-2xl font-bold text-gray-800">
            {{ courseInfo.averageGrade.toFixed(1) }}
          </div>
          <div class="text-xs sm:text-sm text-gray-600 mt-1">Average</div>
        </div>
      </div>

      <LessonList :course-id="courseInfo.courseId" />
    </div>
  </div>
</template>
