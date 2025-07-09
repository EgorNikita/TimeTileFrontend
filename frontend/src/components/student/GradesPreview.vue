<script setup lang="ts">
import { computed, ref } from "vue";
import GradesPreviewCard from "./GradesPreviewCard.vue";
import { GradeFilters } from "@/types/grade";
import { useGrades } from "@/tanStackQueries/student/grades/useGrades";
import { useBulkSubjectsQuery } from "@/tanStackQueries/student/subject/useBulkSubjects";
import { hideAllPoppers } from "floating-vue";

interface Props {
  filters?: GradeFilters;
  scrollThreshold?: number;
  scrollContainer?: HTMLElement | null;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
  scrollThreshold: 200,
});

const gradesQuery = useGrades(props.filters);

// Computed properties for reactive gradeStore data
const grades = computed(() => {
  if (!gradesQuery.data?.value) return [];
  return gradesQuery.data.value.pages.flatMap((page) => page.items);
});

const subjectIds = computed(() => {
  const ids = grades.value.map((grade) => grade.subjectId);
  return [...new Set(ids)]; // Remove duplicates
});

const subjectsQuery = useBulkSubjectsQuery(
  subjectIds,
  computed(() => subjectIds.value.length > 0), // Only fetch when we have IDs
);

const subjectsMap = computed(() => {
  if (!subjectsQuery.data?.value) return new Map();

  const map = new Map();
  subjectsQuery.data.value.forEach((subject) => {
    map.set(subject.id, subject);
  });
  return map;
});

const gradesWithSubjects = computed(() => {
  return grades.value.map((grade) => ({
    ...grade,
    subjectTitle:
      subjectsMap.value.get(grade.subjectId)?.title || "Unknown Subject",
  }));
});

const isLoading = computed(() => gradesQuery.isFetching?.value || false);
const hasMore = computed(() => gradesQuery.hasNextPage?.value || false);

const scrollContainer = ref<HTMLElement | null>(null);

const activeScrollContainer = computed(
  () => props.scrollContainer || scrollContainer.value,
);

const handleScroll = () => {
  const container = activeScrollContainer.value;
  if (!container) return;

  hideAllPoppers();

  // Check if we're near the bottom (e.g., within 100px)
  if (
    container.scrollHeight - container.scrollTop - container.clientHeight <
    props.scrollThreshold
  ) {
    loadMoreGrades();
  }
};

const loadMoreGrades = async () => {
  if (isLoading.value || !hasMore.value) return;

  if (gradesQuery.fetchNextPage) {
    await gradesQuery.fetchNextPage();
  }
};
</script>

<template>
  <div class="relative bg-white rounded-xl shadow-md p-6 pr-4 flex flex-col">
    <!-- Header -->
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex-shrink-0">
      Нові оцінки
    </h2>

    <!-- Grades List -->
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto min-h-0 custom-scrollbar"
      @scroll="handleScroll"
    >
      <div class="space-y-4 pr-3">
        <GradesPreviewCard
          v-for="grade in gradesWithSubjects"
          :key="grade.id"
          :grade-info="grade"
        />
      </div>
    </div>
  </div>
</template>
