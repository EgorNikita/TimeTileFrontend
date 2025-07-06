<script setup>
import CourseCard from "@/components/common/CourseCard.vue";
import { UserGroupIcon } from "@heroicons/vue/24/outline";
import draggable from "vuedraggable";
import { computed, onMounted, ref, watch } from "vue";
import { useStudentCourseStore } from "@/store/modules/student/studentCoursesStore.js";
import { useStudentStore } from "@/store/modules/student.js";

// Make projects reactive so we can reorder them
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
});

const courseStore = useStudentCourseStore();

const isDragging = ref(false);
const draggableCourses = ref([]);

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

  // Example: update backend with new order
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

// Load more courses if available
const loadMoreCourses = async () => {
  if (hasMore.value && !isLoading.value) {
    const result = await courseStore.loadStudentCourses(
      props.contextKey,
      props.filters,
      true,
    );
    if (result.isFailure) {
      console.error("Failed to load courses:", result.error);
    }
  }
};

onMounted(async () => {
  await loadCourses();
});
</script>

<template>
  <div
    class="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow-md sm:px-6 sm:pt-6"
  >
    <div class="flex items-center space-x-2">
      <UserGroupIcon class="size-6 shrink-0 text-gray-900" />
      <h2 class="text-lg font-bold text-gray-900">Courses</h2>
    </div>

    <draggable
      v-model="draggableCourses"
      tag="div"
      class="mt-3 grid flex-wrap gap-4"
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
