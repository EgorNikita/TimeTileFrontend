<script setup lang="ts">
import { computed, ref, watch } from "vue";
import TermSelector from "@/components/common/TermSelector.vue";
import { useTerms } from "@/tanStackQueries/student/term/useTerm.js";
import { Term } from "@/types/term";
import { useAuthStore } from "@/store/modules/auth.ts";
import { useStudentCourseInfo } from "@/tanStackQueries/student/student/useStudentCourseInfo";
import GradesCourseCard from "@/components/student/GradesCourseCard.vue";
import { useBulkSubjectsQuery } from "@/tanStackQueries/student/subject/useBulkSubjects";
import { useBulkGradesQuery } from "@/tanStackQueries/student/grades/useBulkGrades";

const auth = useAuthStore();
const termsQuery = useTerms({ startDateUntil: new Date().toISOString() });

const selectedTerm = ref<Term | null>(null);

const handleTermChange = (term: Term) => {
  selectedTerm.value = term;
};

const termIds = computed(() => (selectedTerm.value ? [selectedTerm.value.id] : []));

const studentCourseInfoQuery = useStudentCourseInfo(auth.userId!, {
  get termIds() {
    return termIds.value;
  }
});

const studentsToCourses = computed(
  () =>
    studentCourseInfoQuery.data.value?.pages?.flatMap((page) => page.items) ??
    [],
);

const subjectIds = computed(() =>
  [...new Set(studentsToCourses.value.map((studentToCourse) => studentToCourse.course.subjectId))]
);

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

const gradeIds = computed(() =>
  [...new Set(studentsToCourses.value
    .filter((studentToCourse) => studentToCourse.examGradeId != null)
    .map((studentToCourse) => studentToCourse.examGradeId!))]
);

const gradesQuery = useBulkGradesQuery(gradeIds);

const gradeValueMap = computed(() => {
  const map = new Map<number, number>();

  if (gradesQuery.data?.value) {
    gradesQuery.data.value.forEach((grade) => {
      map.set(grade.id, grade.value);
    });
  }
  return map;
})

const courseCards = computed(() =>
  studentsToCourses.value.map((studentToCourse) => {
    let examGradeValue = undefined;
    if (studentToCourse.examGradeId) {
      examGradeValue = gradeValueMap.value.get(studentToCourse.examGradeId);
    }

    const subjectTitle = subjectTitleMap.value.get(studentToCourse.course.subjectId);

    return {
      id: studentToCourse.course.id,
      title: studentToCourse.course.title,
      subject: subjectTitle ?? "",
      termMark: examGradeValue,
      averageMark: studentToCourse.averageGrade
    };
  })
);

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
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Term Selection Component -->
    <TermSelector
      v-if="selectedTerm"
      :useTermQuery="termsQuery"
      :selected-term="selectedTerm"
      @update:selectedTerm="handleTermChange"
    />

    <!-- Course Cards Grid -->
    <div
      class="grid flex-wrap gap-5 mt-2"
      style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))"
    >
      <GradesCourseCard
        v-for="courseCard in courseCards"
        :key="courseCard.id"
        :course-card="courseCard"
        class="hover:scale-103 transition-transform duration-400 ease-in-out"
      />
    </div>
  </div>
</template>
