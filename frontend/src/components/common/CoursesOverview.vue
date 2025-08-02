<script setup lang="ts">
import { UserGroupIcon } from "@heroicons/vue/24/outline";
import draggable from "vuedraggable";
import { computed, ref, watch } from "vue";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";
import { CourseFilters } from "@/services/courseApi";
import { EnrichedStudentCourseInfo } from "@/types/studentCourseInfo";
import { useEnrichedStudentCourseInfo } from "@/tanStackQueries/student/student/useEnrichedStudentCourseInfo";
import { useAuth } from "@/composables/useAuth";
import CourseCard from "@/components/common/CourseCard.vue";

// Props
interface Props {
  filters?: CourseFilters;
  allowDragAndDrop?: boolean;
  scrollThreshold?: number;
  scrollContainer?: HTMLElement | null;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
  allowDragAndDrop: true,
  scrollThreshold: 200,
  scrollContainer: null,
});

// Reactive state
const isDragging = ref(false);
const draggableCourses = ref<EnrichedStudentCourseInfo[]>([]);

const { user } = useAuth();

const studentCourseInfoQuery = useEnrichedStudentCourseInfo(
  user.currentUser.value?.id!,
  {},
  20,
);

const courses = computed(
  () =>
    studentCourseInfoQuery.data.value?.pages?.flatMap((page) => page.items) ??
    [],
);

// Drag and drop handlers
const handleDragStart = () => {
  isDragging.value = true;
};

const handleDragEnd = async () => {
  isDragging.value = false;
  try {
    await saveCoursesOrder(draggableCourses.value);
  } catch (error) {
    console.error("Failed to save course order:", error);
  }
};

// API calls
const saveCoursesOrder = async (courses: EnrichedStudentCourseInfo[]) => {
  console.log(
    "Saving course order:",
    courses.map((c) => c.courseId),
  );
  // TODO: implement API call to save order
};

// Watchers
watch(
  courses,
  (newCourses) => {
    draggableCourses.value = [...newCourses];
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="relative rounded-lg bg-white px-4 pt-5 pb-12 shadow-md sm:px-6 sm:pt-6 flex flex-col h-full"
  >
    <!-- Header -->
    <div class="flex items-center space-x-2">
      <UserGroupIcon class="size-6 shrink-0 text-gray-900" />
      <h2 class="text-lg font-bold text-gray-900">Courses</h2>
    </div>

    <LazyScrollWrapper
      :scroll-container="props.scrollContainer"
      :query="studentCourseInfoQuery"
    >
      <!-- Course Grid -->
      <draggable
        v-model="draggableCourses"
        tag="div"
        class="grid gap-4 mt-2"
        style="grid-template-columns: repeat(auto-fit, minmax(270px, 1fr))"
        :animation="500"
        :disabled="!props.allowDragAndDrop"
        ghost-class="ghost-card"
        chosen-class="chosen-card"
        drag-class="drag-card"
        :force-fallback="false"
        :scroll-sensitivity="100"
        :scroll-speed="2"
        @start="handleDragStart"
        @end="handleDragEnd"
        item-key="courseId"
      >
        <template #item="{ element: course }">
          <CourseCard :course="course" />
        </template>
      </draggable>
    </LazyScrollWrapper>
  </div>
</template>

<style>
.ghost-card {
  opacity: 0.3 !important;
  transition: none !important;
}

.chosen-card {
  cursor: grabbing !important;
  transform: scale(1.05) !important;
  transition: none !important;
}

.drag-card {
  transform: rotate(5deg) scale(1.1) !important;
  opacity: 0.8 !important;
  transition: none !important;
}
</style>
