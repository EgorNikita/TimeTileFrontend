<template>
  <div class="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
    <div class="flex items-center space-x-4">
      <!-- Course Icon -->
      <div class="flex-shrink-0">
        <img
          class="h-12 w-12 rounded-lg object-cover shadow-sm"
          :src="course?.course.iconUrl || defaultCourseIcon"
          :alt="course?.course.title || 'Course'"
          @error="handleImageError"
        />
      </div>

      <!-- Course Info -->
      <div class="flex-1 min-w-0">
        <h1 class="text-xl font-semibold text-gray-900 truncate">
          {{ course?.course.title || "Course Chat" }}
        </h1>
        <div class="flex items-center space-x-4 mt-1">
          <span
            v-if="course?.course.isAdvanced"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
          >
            Advanced
          </span>
          <span class="text-sm text-gray-500">
            {{ course?.subject.title }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { CourseEnrichedWithSubject } from "@/tanStackQueries/student/course/useBulkCoursesEnrichedWithSubject";

interface Props {
  course: CourseEnrichedWithSubject | null;
}

const props = defineProps<Props>();
const route = useRoute();
const courseId = Number.parseInt(route.params.courseId as string);

const defaultCourseIcon =
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=400&fit=crop&crop=center";

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = defaultCourseIcon;
};
</script>
