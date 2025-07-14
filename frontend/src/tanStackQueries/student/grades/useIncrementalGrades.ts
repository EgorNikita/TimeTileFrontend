import { computed, ref, watch } from "vue";
import { Grade } from "@/types/grade";
import { fetchGrades } from "@/services/gradeService";

export function useIncrementalGrades(lessonIds: () => number[]) {
  const fetchedLessonIds = ref<Set<number>>(new Set());
  const allGrades = ref<Grade[]>([]);

  const fetchGradesForNewLessons = async () => {
    const currentLessonIds = lessonIds();
    const newLessonIds = currentLessonIds.filter(id => !fetchedLessonIds.value.has(id));

    if (newLessonIds.length === 0) return;

    // Every lesson can have 2 grades (Homework and Classwork)
    const pageSize = newLessonIds.length * 2;
    const result = await fetchGrades({
      lessonIds: newLessonIds,
      page: 1,
      pageSize
    });

    // Add to existing grades
    allGrades.value.push(...result.items);

    // Mark as fetched
    newLessonIds.forEach(id => fetchedLessonIds.value.add(id));
  };

  // Watch for new lessons and fetch their grades
  watch(lessonIds, fetchGradesForNewLessons, { immediate: true });

  const refetch = () => {
    fetchedLessonIds.value.clear();
    allGrades.value = [];
    fetchGradesForNewLessons();
  };

  return {
    data: computed(() => allGrades.value),
    refetch
  };
}