<script setup lang="ts">
import CourseCard from "@/components/common/CourseCard.vue";
import { UserGroupIcon } from "@heroicons/vue/24/outline";
import draggable from "vuedraggable";
import { computed, ref, watch } from "vue";

import { useCourses } from "@/tanStackQueries/student/course/useCourses";
import type { Course, CourseFilters } from "@/types/course";
import { useBulkSubjectsQuery } from "@/tanStackQueries/student/subject/useBulkSubjects";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";

// Props
interface Props {
  filters?: CourseFilters;
  allowDragAndDrop?: boolean;
  scrollThreshold?: number;
  scrollContainer: HTMLElement | null;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
  allowDragAndDrop: true,
  scrollThreshold: 200,
});

// Reactive state
const isDragging = ref(false);
const draggableCourses = ref<Course[]>([]);

// Queries
const coursesQuery = useCourses(props.filters);

// Computed properties
const allCourses = computed(() => {
  if (!coursesQuery.data?.value) return [];
  return coursesQuery.data.value.pages.flatMap((page) => page.items);
});

const subjectIds = computed(() => [
  ...new Set(allCourses.value.map((course) => course.subjectId)),
]);

const subjectsQuery = useBulkSubjectsQuery(subjectIds);

const subjectTitleMap = computed(() => {
  const map = new Map<number, string>();
  if (subjectsQuery.data?.value) {
    subjectsQuery.data.value.forEach((subject) => {
      map.set(subject.id, subject.title);
    });
  }
  return map;
});

const enrichedCourses = computed(() => {
  return allCourses.value.map((course) => ({
    ...course,
    subjectTitle:
      subjectTitleMap.value.get(course.subjectId) ?? "Unknown Subject",
  }));
});

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
const saveCoursesOrder = async (courses: Course[]) => {
  console.log(
    "Saving course order:",
    courses.map((c) => c.id),
  );
  // TODO: implement API call to save order
};

// Watchers
watch(
  enrichedCourses,
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
      :query="coursesQuery"
    >
      <!-- Course Grid -->
      <draggable
        v-model="draggableCourses"
        tag="div"
        class="grid flex-wrap gap-4 mt-2"
        style="grid-template-columns: repeat(auto-fit, minmax(270px, 1fr))"
        :animation="500"
        :disabled="!allowDragAndDrop"
        ghost-class="ghost-card"
        chosen-class="chosen-card"
        drag-class="drag-card"
        :force-fallback="false"
        :scroll-sensitivity="100"
        :scroll-speed="2"
        @start="handleDragStart"
        @end="handleDragEnd"
        item-key="id"
      >
        <template #item="{ element: course }">
          <div class="course-item">
            <CourseCard :course="course" />
          </div>
        </template>
      </draggable>
    </LazyScrollWrapper>
  </div>
</template>

<style scoped>
.ghost-card {
  opacity: 0.5;
}

.chosen-card {
  cursor: grabbing;
}

.drag-card {
  transform: rotate(5deg);
}

.course-item {
  transition: transform 0.2s ease;
}

.course-item:hover {
  transform: translateY(-2px);
}
</style>
