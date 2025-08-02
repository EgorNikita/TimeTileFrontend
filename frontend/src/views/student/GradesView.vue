<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import TermSelector from "@/components/common/TermSelector.vue";
import { useTerms } from "@/tanStackQueries/student/term/useTerm.js";
import { useEnrichedStudentCourseInfo } from "@/tanStackQueries/student/student/useEnrichedStudentCourseInfo";
import GradesCourseCard from "@/components/student/GradesCourseCard.vue";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";
import { Term } from "@/services/termApi";
import { useAuth } from "@/composables/useAuth";

const props = defineProps({
  scrollContainer: Object,
});

const { user } = useAuth();
const termsQuery = useTerms({ startDateUntil: new Date().toISOString() });

const selectedTerm = ref<Term | null>(null);

const handleTermChange = (term: Term) => {
  selectedTerm.value = term;
};

const termIds = computed(() =>
  selectedTerm.value ? [selectedTerm.value.id] : [],
);

const isInitialLoading = computed(() => {
  return (
    studentCourseInfoQuery.isFetching.value &&
    !studentCourseInfoQuery.data.value
  );
});

const isEmptyState = computed(() => {
  return courses.value.length === 0 && !isInitialLoading.value;
});

const filters = reactive({
  termIds: termIds.value,
});

const studentCourseInfoQuery = useEnrichedStudentCourseInfo(
  user.currentUser.value?.id!,
  filters,
);

const courses = computed(
  () =>
    studentCourseInfoQuery.data.value?.pages?.flatMap((page) => page.items) ??
    [],
);

// Auto-select the first term when data loads
watch(
  () => termsQuery.data.value,
  (newData) => {
    if (
      newData &&
      newData.pages.length > 0 &&
      newData.pages[0].items.length > 0 &&
      !selectedTerm.value
    ) {
      selectedTerm.value = newData.pages[0].items[0];
      console.log("Auto-selected term:", selectedTerm.value);
    }
  },
  { immediate: true },
);

watch(
  termIds,
  (newTermIds) => {
    filters.termIds = newTermIds;
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex-1 min-w-0">
    <div class="mt-4 space-y-4 sm:space-y-6">
      <!-- Term Selection Component -->
      <div class="px-4 sm:px-6">
        <TermSelector
          v-if="selectedTerm"
          :useTermQuery="termsQuery"
          :selected-term="selectedTerm"
          @update:selectedTerm="handleTermChange"
        />
      </div>

      <!-- Empty State -->
      <div v-if="isEmptyState" class="text-center py-8 sm:py-12 px-4">
        <div class="text-gray-500">
          <svg
            class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p class="text-sm sm:text-base text-gray-500 max-w-sm mx-auto">
            No courses available for the selected term.
          </p>
        </div>
      </div>

      <!-- Course Cards with Lazy Loading -->
      <LazyScrollWrapper
        v-else
        :query="studentCourseInfoQuery"
        loading-text="Loading courses..."
        :scroll-threshold="300"
        :scroll-container="scrollContainer"
      >
        <!-- Mobile: Single column, Tablet: 2 columns, Desktop: Auto-fit with min 400px -->
        <div class="px-4 mt-3 sm:px-6">
          <div
            class="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]"
          >
            <GradesCourseCard
              v-for="courseCard in courses"
              :key="courseCard.courseId"
              :course-info="courseCard"
              class="w-full hover:scale-[1.02] sm:hover:scale-103 transition-transform duration-300 sm:duration-400 ease-in-out"
            />
          </div>
        </div>
      </LazyScrollWrapper>
    </div>
  </div>
</template>
