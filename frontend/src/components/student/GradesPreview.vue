<script setup lang="ts">
import { computed } from "vue";
import GradesPreviewCard from "./GradesPreviewCard.vue";
import { GradeFilters } from "@/types/grade";
import { useGradesLazy } from "@/tanStackQueries/student/grades/useGradesLazy";
import { useBulkSubjectsQuery } from "@/tanStackQueries/student/subject/useBulkSubjects";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";

interface Props {
  filters?: GradeFilters;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
});

const gradesQuery = useGradesLazy(props.filters);

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
</script>

<template>
  <div
    class="relative bg-white rounded-xl shadow-md p-6 pr-4 flex flex-col h-full min-h-0"
  >
    <!-- Header -->
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex-shrink-0">
      Нові оцінки
    </h2>

    <!-- Grades List -->
    <LazyScrollWrapper
      class="flex-1 min-h-0 overflow-y-auto"
      :query="gradesQuery"
    >
      <div class="space-y-4 pr-3">
        <GradesPreviewCard
          v-for="grade in gradesWithSubjects"
          :key="grade.id"
          :grade-info="grade"
        />
      </div>
    </LazyScrollWrapper>
  </div>
</template>
