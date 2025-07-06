<script setup lang="ts">
import CourseCard from "@/components/common/CourseCard.vue";
import { UserGroupIcon } from "@heroicons/vue/24/outline";
import draggable from "vuedraggable";
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from "vue";

import { useCourses } from "@/tanStackQueries/course/useCourses";
import type { Course, CourseFilters } from "@/types/course";
import { useBulkSubjectsQuery } from "@/tanStackQueries/subject/useBulkSubjects";

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

// Constants
const PAGE_SIZE = 20;
const SCROLL_THROTTLE_MS = 100;

// Reactive state
const isDragging = ref(false);
const draggableCourses = ref<Course[]>([]);
const isLoadingMore = ref(false);
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

// Queries
const coursesQuery = useCourses(props.filters, PAGE_SIZE);

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

const hasMore = computed(() => coursesQuery.hasNextPage.value ?? false);
const isLoading = computed(() => coursesQuery.isFetching.value);

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

// Infinite scroll logic
const loadMoreCourses = async () => {
  if (hasMore.value && !isLoading.value && !isLoadingMore.value) {
    isLoadingMore.value = true;
    try {
      await coursesQuery.fetchNextPage();
    } catch (error) {
      console.error("Failed to load more courses:", error);
    } finally {
      isLoadingMore.value = false;
    }
  }
};

const handlePageScroll = async () => {
  const container = props.scrollContainer;
  if (!container || isLoadingMore.value || isDragging.value) return;

  const { scrollTop, scrollHeight, clientHeight } = container;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

  if (
    distanceFromBottom <= props.scrollThreshold &&
    hasMore.value &&
    !isLoading.value
  ) {
    await loadMoreCourses();
  }
};

const throttledScrollHandler = () => {
  if (scrollTimeout) return;

  scrollTimeout = setTimeout(() => {
    handlePageScroll();
    scrollTimeout = null;
  }, SCROLL_THROTTLE_MS);
};

// Scroll container management
const setupScrollListener = (container: HTMLElement | null) => {
  if (container) {
    container.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
  }
};

const removeScrollListener = (container: HTMLElement | null) => {
  if (container) {
    container.removeEventListener("scroll", throttledScrollHandler);
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

watch(
  () => props.scrollContainer,
  (newContainer, oldContainer) => {
    removeScrollListener(oldContainer);
    setupScrollListener(newContainer);
  },
  { immediate: true },
);

// Lifecycle hooks
onMounted(async () => {
  await nextTick();
  setupScrollListener(props.scrollContainer);
});

onUnmounted(() => {
  removeScrollListener(props.scrollContainer);
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
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

    <!-- Loading indicator -->
    <div v-if="isLoadingMore" class="flex justify-center mt-4">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
      ></div>
    </div>
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
