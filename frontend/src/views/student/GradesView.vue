<script setup>
import { ref } from "vue";
import TermSelector from "@/components/common/TermSelector.vue";
import CourseCard from "@/components/student/GradeCourseCard.vue";

const courseGrades = ref([
  {
    id: 1,
    title: "Mathematics_LK_GYI231",
    subject: "Mathematics",
    color: "from-blue-400 to-blue-600",
    termMark: 85,
    averageMark: 88,
    totalLessons: 30,
    completedLessons: 28,
    lessons: [
      {
        id: 1,
        title: "Algebra Basics",
        date: "2024-01-15",
        classwork: 88,
        homework: 92,
      },
      {
        id: 2,
        title: "Linear Equations",
        date: "2024-01-22",
        classwork: 85,
        homework: 87,
      },
      {
        id: 3,
        title: "Quadratic Functions",
        date: "2024-01-29",
        classwork: 82,
        homework: 89,
      },
      {
        id: 4,
        title: "Polynomials",
        date: "2024-02-05",
        classwork: 90,
        homework: 85,
      },
      {
        id: 5,
        title: "Factoring",
        date: "2024-02-12",
        classwork: 87,
        homework: 91,
      },
      {
        id: 6,
        title: "Rational Expressions",
        date: "2024-02-19",
        classwork: 83,
        homework: 88,
      },
      {
        id: 7,
        title: "Systems of Equations",
        date: "2024-02-26",
        classwork: 89,
        homework: 86,
      },
      {
        id: 8,
        title: "Inequalities",
        date: "2024-03-05",
        classwork: 91,
        homework: 93,
      },
      {
        id: 9,
        title: "Exponential Functions",
        date: "2024-03-12",
        classwork: 84,
        homework: 87,
      },
    ],
  },
  {
    id: 2,
    title: "Physics_LK_GYI231",
    subject: "Physics",
    color: "from-purple-400 to-purple-600",
    termMark: 90,
    averageMark: 92,
    totalLessons: 25,
    completedLessons: 24,
    lessons: [
      {
        id: 1,
        title: "Newton's Laws",
        date: "2024-01-10",
        classwork: 95,
        homework: 93,
      },
      {
        id: 2,
        title: "Kinematics",
        date: "2024-01-17",
        classwork: 88,
        homework: 90,
      },
      {
        id: 3,
        title: "Dynamics",
        date: "2024-01-24",
        classwork: 92,
        homework: 91,
      },
      {
        id: 4,
        title: "Energy Conservation",
        date: "2024-01-31",
        classwork: 89,
        homework: 94,
      },
      {
        id: 5,
        title: "Momentum",
        date: "2024-02-07",
        classwork: 90,
        homework: 92,
      },
      {
        id: 6,
        title: "Waves",
        date: "2024-02-14",
        classwork: 93,
        homework: 95,
      },
      {
        id: 7,
        title: "Thermodynamics",
        date: "2024-02-21",
        classwork: 91,
        homework: 89,
      },
      {
        id: 8,
        title: "Electromagnetism",
        date: "2024-02-28",
        classwork: 94,
        homework: 96,
      },
    ],
  },
  {
    id: 3,
    title: "Chemistry_LK_GYI231",
    subject: "Chemistry",
    color: "from-green-400 to-green-600",
    termMark: 88,
    averageMark: 90,
    totalLessons: 28,
    completedLessons: 27,
    lessons: [
      {
        id: 1,
        title: "Atomic Structure",
        date: "2024-01-12",
        classwork: 85,
        homework: 87,
      },
      {
        id: 2,
        title: "Periodic Table",
        date: "2024-01-19",
        classwork: 90,
        homework: 92,
      },
      {
        id: 3,
        title: "Chemical Bonds",
        date: "2024-01-26",
        classwork: 88,
        homework: 89,
      },
      {
        id: 4,
        title: "Stoichiometry",
        date: "2024-02-02",
        classwork: 91,
        homework: 93,
      },
      {
        id: 5,
        title: "Thermochemistry",
        date: "2024-02-09",
        classwork: 87,
        homework: 90,
      },
      {
        id: 6,
        title: "Kinetics",
        date: "2024-02-16",
        classwork: 89,
        homework: 91,
      },
      {
        id: 7,
        title: "Equilibrium",
        date: "2024-02-23",
        classwork: 92,
        homework: 94,
      },
      {
        id: 8,
        title: "Acids and Bases",
        date: "2024-03-01",
        classwork: 86,
        homework: 88,
      },
    ],
  },
  {
    id: 4,
    title: "Biology_LK_GYI231",
    subject: "Biology",
    color: "from-teal-400 to-teal-600",
    termMark: 92,
    averageMark: 91,
    totalLessons: 26,
    completedLessons: 25,
    lessons: [
      {
        id: 1,
        title: "Cell Structure",
        date: "2024-01-14",
        classwork: 90,
        homework: 92,
      },
      {
        id: 2,
        title: "Genetics",
        date: "2024-01-21",
        classwork: 93,
        homework: 95,
      },
      {
        id: 3,
        title: "Evolution",
        date: "2024-01-28",
        classwork: 88,
        homework: 90,
      },
      {
        id: 4,
        title: "Ecology",
        date: "2024-02-04",
        classwork: 91,
        homework: 89,
      },
      {
        id: 5,
        title: "Human Anatomy",
        date: "2024-02-11",
        classwork: 94,
        homework: 96,
      },
      {
        id: 6,
        title: "Plant Biology",
        date: "2024-02-18",
        classwork: 87,
        homework: 88,
      },
      {
        id: 7,
        title: "Microbiology",
        date: "2024-02-25",
        classwork: 89,
        homework: 91,
      },
      {
        id: 8,
        title: "Biotechnology",
        date: "2024-03-04",
        classwork: 92,
        homework: 93,
      },
    ],
  },
  {
    id: 5,
    title: "English Literature_LK_GYI231",
    subject: "English Literature",
    color: "from-red-400 to-red-600",
    termMark: 88,
    averageMark: 89,
    totalLessons: 15,
    completedLessons: 11,
    lessons: [
      {
        id: 1,
        title: "Shakespeare's Hamlet",
        date: "2024-01-18",
        classwork: 86,
        homework: 89,
      },
      {
        id: 2,
        title: "Victorian Poetry",
        date: "2024-01-25",
        classwork: 92,
        homework: 85,
      },
      {
        id: 3,
        title: "Modern Drama",
        date: "2024-02-01",
        classwork: 88,
        homework: 90,
      },
      {
        id: 4,
        title: "Narrative Techniques",
        date: "2024-02-08",
        classwork: 84,
        homework: 87,
      },
      {
        id: 5,
        title: "Critical Analysis",
        date: "2024-02-15",
        classwork: 91,
        homework: 93,
      },
      {
        id: 6,
        title: "Romanticism",
        date: "2024-02-22",
        classwork: 89,
        homework: 86,
      },
      {
        id: 7,
        title: "Contemporary Fiction",
        date: "2024-03-01",
        classwork: 87,
        homework: 92,
      },
      {
        id: 8,
        title: "Essay Writing",
        date: "2024-03-08",
        classwork: 90,
        homework: 88,
      },
      {
        id: 9,
        title: "Literary Devices",
        date: "2024-03-15",
        classwork: 85,
        homework: 91,
      },
      {
        id: 10,
        title: "Comparative Literature",
        date: "2024-03-22",
        classwork: 88,
        homework: 89,
      },
      {
        id: 11,
        title: "Poetry Analysis",
        date: "2024-03-29",
        classwork: 93,
        homework: 87,
      },
    ],
  },
]);

const terms = [
  { id: 1, title: "Term 1", start_date: "2024-01-01", end_date: "2024-03-31" },
  { id: 2, title: "Term 2", start_date: "2024-04-01", end_date: "2024-06-30" },
  { id: 3, title: "Term 3", start_date: "2024-07-01", end_date: "2024-09-30" },
];

const selectedTerm = ref(terms[0]);

const handleTermChange = (term) => {
  selectedTerm.value = term;
};
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Term Selection Component -->
    <TermSelector
      :terms="terms"
      :selectedTerm="selectedTerm"
      @update:selectedTerm="handleTermChange"
    />

    <!-- Course Cards Grid -->
    <div
      class="grid flex-wrap gap-5 mt-2"
      style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))"
    >
      <CourseCard
        v-for="subject in courseGrades"
        :key="subject.id"
        :course="subject"
      />
    </div>
  </div>
</template>
