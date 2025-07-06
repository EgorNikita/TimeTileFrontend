<script setup>
import CourseCard from "@/components/common/CourseCard.vue";
import { UserGroupIcon } from "@heroicons/vue/24/outline";
import draggable from "vuedraggable";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useStudentCourseStore } from "@/store/modules/student/studentCoursesStore.js";

const props = defineProps({
  contextKey: {
    type: String,
    default: "student-courses",
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
  allowDragAndDrop: {
    type: Boolean,
    default: true,
  },
  scrollThreshold: {
    type: Number,
    default: 200, // pixels from bottom to trigger load
  },
  scrollContainer: {
    type: Object,
    required: true,
  },
});

const courseStore = useStudentCourseStore();
const isLoadingMore = ref(false);
const isDragging = ref(false);
const draggableCourses = ref([]);
let scrollTimeout = null;

// Computed properties for reactive courseStore data
const courses = computed(() => courseStore.getCourses(props.contextKey));
const isLoading = computed(() => courseStore.loading);
const loadError = computed(() => courseStore.error);
const hasMore = computed(() => courseStore.hasMoreCourses(props.contextKey));

// Keep draggableCourses synced with courses
watch(
  courses,
  (newCourses) => {
    draggableCourses.value = [...newCourses];
  },
  { immediate: true },
);

// Drag event handlers
function onDragStart() {
  isDragging.value = true;
}

function onDragEnd() {
  isDragging.value = false;
  saveCoursesOrder(draggableCourses.value).catch((err) => {
    console.error("Failed to save course order:", err);
  });
}

function onDragChange(event) {
  // Can debounce or throttle if needed
}

const loadCourses = async () => {
  const result = await courseStore.loadStudentCourses(
    props.contextKey,
    props.filters,
  );
  if (result.isFailure) {
    console.error("Failed to load courses:", result.error);
  }
};

const loadMoreCourses = async () => {
  if (hasMore.value && !isLoading.value && !isLoadingMore.value) {
    isLoadingMore.value = true;
    const result = await courseStore.loadStudentCourses(
      props.contextKey,
      props.filters,
      true,
    );
    if (result.isFailure) {
      console.error("Failed to load courses:", result.error);
    }
    isLoadingMore.value = false;
  }
};

const handlePageScroll = async () => {
  // The scrollContainer prop is already a ref, so we need to access its value
  const container = props.scrollContainer;
  if (!container || isLoadingMore.value || isDragging.value) return;

  const { scrollTop, scrollHeight, clientHeight } = container;
  const scrolledToBottom =
    scrollHeight - scrollTop - clientHeight <= props.scrollThreshold;

  console.log({
    scrollTop,
    scrollHeight,
    clientHeight,
    distanceFromBottom: scrollHeight - scrollTop - clientHeight,
    hasMore: hasMore.value,
    isLoading: isLoading.value,
    isLoadingMore: isLoadingMore.value,
  });

  if (scrolledToBottom && hasMore.value && !isLoading.value) {
    console.log("Loading more courses...");
    await loadMoreCourses();
  }
};

const throttledScrollHandler = () => {
  if (scrollTimeout) return;

  scrollTimeout = setTimeout(() => {
    handlePageScroll();
    scrollTimeout = null;
  }, 100);
};

// Watch for scroll container changes and add/remove event listeners
watch(
  () => props.scrollContainer,
  (newContainer, oldContainer) => {
    // Remove listener from old container
    if (oldContainer?.value) {
      oldContainer.value.removeEventListener("scroll", throttledScrollHandler);
    }

    // Add listener to new container
    if (newContainer?.value) {
      newContainer.value.addEventListener("scroll", throttledScrollHandler, {
        passive: true,
      });
    }
  },
  { immediate: true },
);

// Placeholder function for saving course order
async function saveCoursesOrder(courses) {
  console.log(
    "Saving course order:",
    courses.map((c) => c.id),
  );
  // Implement your API call here
}

onMounted(async () => {
  await loadCourses();

  // Ensure scroll container is attached after mount
  await nextTick();

  if (props.scrollContainer) {
    props.scrollContainer.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });
  }
});

onUnmounted(() => {
  // Clean up scroll listener and timeout
  if (props.scrollContainer) {
    props.scrollContainer.removeEventListener("scroll", throttledScrollHandler);
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
</script>

<template>
  <div
    class="relative rounded-lg bg-white px-4 pt-5 pb-12 shadow-md sm:px-6 sm:pt-6 flex flex-col h-full"
  >
    <div class="flex items-center space-x-2">
      <UserGroupIcon class="size-6 shrink-0 text-gray-900" />
      <h2 class="text-lg font-bold text-gray-900">Courses</h2>
    </div>

    <!-- Scrollable area -->
    <draggable
      v-model="courses"
      tag="div"
      class="grid flex-wrap gap-4 mt-2"
      style="grid-template-columns: repeat(auto-fit, minmax(270px, 1fr))"
      :animation="200"
      ghost-class="ghost-card"
      chosen-class="chosen-card"
      drag-class="drag-card"
      :force-fallback="false"
      :scroll-sensitivity="100"
      :scroll-speed="10"
      @start="onDragStart"
      @end="onDragEnd"
      @change="onDragChange"
      item-key="id"
    >
      <template #item="{ element: project }">
        <div class="course-item">
          <CourseCard :course="project" />
        </div>
      </template>
    </draggable>
  </div>
</template>
