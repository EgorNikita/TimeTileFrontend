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
    <div class="bg-stone-900 p-6 text-white">
      <div class="flex items-center justify-between">
        <div
          class="min-w-0 flex-1 mr-10"
          v-tooltip="{
            content: courseInfo.course.title,
            theme: 'arrowed-tooltip',
            strategy: 'fixed',
            boundary: 'scrollParent',
            flip: true,
            preventOverflow: true,
          }"
        >
          <h2 class="text-2xl font-bold truncate">
            {{ courseInfo.course.title }}
          </h2>
          <p class="text-white/80 text-sm mt-1 truncate max-w-xs">
            {{ courseInfo.subjectTitle }}
          </p>
        </div>
        <img
          class="h-18 w-18 rounded-md"
          :src="courseInfo.course.iconUrl || 'https://via.placeholder.com/72'"
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
            {{ courseInfo.termMark?.toFixed(1) ?? "-" }}
          </div>
          <div class="text-sm text-gray-600">Term Mark</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-md">
          <div class="text-2xl font-bold text-gray-800">
            {{ courseInfo.averageGrade.toFixed(1) }}
          </div>
          <div class="text-sm text-gray-600">Average</div>
        </div>
      </div>

      <LessonList :course-id="courseInfo.courseId" />
    </div>
  </div>
</template>
