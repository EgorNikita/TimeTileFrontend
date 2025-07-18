<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useCourses } from "@/tanStackQueries/student/course/useCourses";
import { Course } from "@/types/course";

const coursesQuery = useCourses({}, 50);

const courses = computed(() => {
  if (!coursesQuery.data?.value) return [];
  return coursesQuery.data.value.pages.flatMap((page) => page.items);
});

const searchQuery = ref("");
const isOpen = ref(false);
const selectedCourse = ref<Course | null>(null);
const highlightedIndex = ref(-1);
const inputRef = ref<HTMLInputElement>();
const dropdownRef = ref<HTMLDivElement>();

// Define emits
const emit = defineEmits<{
  courseSelected: [courseId: number | null];
}>();

const filteredCourses = computed(() => {
  if (!searchQuery.value) return courses.value;
  return courses.value.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const openDropdown = () => {
  isOpen.value = true;
  highlightedIndex.value = -1;
};

const closeDropdown = () => {
  isOpen.value = false;
  highlightedIndex.value = -1;
};

const selectCourse = (course: Course) => {
  selectedCourse.value = course;
  searchQuery.value = course.title;
  closeDropdown();
  // Emit the selected course ID
  emit("courseSelected", course.id);
};

const clearSelection = () => {
  selectedCourse.value = null;
  searchQuery.value = "";
  // Emit null to show all courses
  emit("courseSelected", null);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredCourses.value.length - 1,
      );
      break;
    case "ArrowUp":
      event.preventDefault();
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
      break;
    case "Enter":
      event.preventDefault();
      if (highlightedIndex.value >= 0) {
        selectCourse(filteredCourses.value[highlightedIndex.value]);
      }
      break;
    case "Escape":
      event.preventDefault();
      closeDropdown();
      inputRef.value?.blur();
      break;
  }
};

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="relative w-full max-w-md" ref="dropdownRef">
    <div class="relative flex items-center">
      <input
        ref="inputRef"
        v-model="searchQuery"
        @focus="openDropdown"
        @keydown="handleKeydown"
        type="text"
        placeholder="Search for courses..."
        class="w-full px-4 py-3 pr-10 text-sm border-2 border-gray-300 rounded-lg outline-none transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        autocomplete="off"
      />
      <!-- Clear button when course is selected -->
      <div
        v-if="selectedCourse"
        class="absolute right-10 cursor-pointer text-gray-400 hover:text-red-500 transition-all duration-200 flex items-center justify-center w-6 h-6"
        @click="clearSelection"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M9 3L3 9M3 3L9 9"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div
        class="absolute right-3 cursor-pointer text-gray-400 hover:text-blue-500 transition-all duration-200 flex items-center justify-center w-6 h-6"
        :class="{ 'rotate-180': isOpen }"
        @click="isOpen ? closeDropdown() : openDropdown()"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div
      v-if="isOpen"
      class="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 border-t-0 rounded-b-lg max-h-72 overflow-y-auto z-50 shadow-lg"
    >
      <div
        v-if="filteredCourses.length === 0"
        class="px-4 py-4 text-center text-gray-500 text-sm"
      >
        No courses found
      </div>
      <div
        v-for="(course, index) in filteredCourses"
        :key="course.id"
        class="flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
        :class="{
          'bg-indigo-50': index === highlightedIndex,
          'hover:bg-gray-50': index !== highlightedIndex,
        }"
        @click="selectCourse(course)"
        @mouseenter="highlightedIndex = index"
      >
        <span class="relative inline-block flex-shrink-0 mr-3"
          ><img
            class="h-10 w-10 rounded-md"
            :src="course.iconUrl || 'https://via.placeholder.com/72'"
            alt=""
        /></span>
        <span class="text-gray-700 font-medium text-sm">{{
          course.title
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar styling for webkit browsers */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
