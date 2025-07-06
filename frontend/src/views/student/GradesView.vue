<script setup>
import { ref } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/24/outline";

const courseGrades = ref([
  {
    id: 1,
    subject: "Mathematics",
    termMark: 85,
    avarageMark: 88,
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
    subject: "Physics",
    termMark: 90,
    avarageMark: 92,
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
    subject: "Chemistry",
    termMark: 88,
    avarageMark: 90,
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
    subject: "Biology",
    termMark: 92,
    avarageMark: 91,
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
    subject: "English Literature",
    color: "bg-red-500",
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
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
  { id: 7, name: "Caroline Schultz" },
  { id: 8, name: "Mason Heaney" },
  { id: 9, name: "Claudie Smitham" },
  { id: 10, name: "Emil Schaefer" },
];

const selectedTerm = ref(terms[0]);
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Term selection (optional) -->
    <div>
      <Listbox v-model="selectedTerm">
        <div class="relative mt-1">
          <ListboxButton
            class="relative w-64 cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border shadow-md focus:outline-none"
          >
            <span class="block truncate">{{ selectedTerm.name }}</span>
            <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <ListboxOptions
            class="absolute mt-1 w-64 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
          >
            <ListboxOption
              v-for="term in terms"
              :key="term.id"
              :value="term"
              class="cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-100"
            >
              {{ term.name }}
            </ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>
    </div>

    <!-- Subject Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="subject in courseGrades"
        :key="subject.id"
        class="bg-white border rounded-lg shadow p-5"
      >
        <h2 class="text-xl font-bold text-gray-800 mb-2">
          {{ subject.subject }}
        </h2>
        <p class="text-sm text-gray-600">
          Term Mark: <span class="font-medium">{{ subject.termMark }}</span>
        </p>
        <p class="text-sm text-gray-600">
          Average Mark:
          <span class="font-medium">{{
            subject.avarageMark || subject.averageMark
          }}</span>
        </p>
        <p class="text-sm text-gray-600">
          Completed Lessons:
          <span class="font-medium"
            >{{ subject.completedLessons }}/{{ subject.totalLessons }}</span
          >
        </p>

        <div class="mt-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-1">Lessons</h3>
          <ul class="space-y-1 max-h-48 overflow-y-auto pr-2">
            <li
              v-for="lesson in subject.lessons"
              :key="lesson.id"
              class="text-sm text-gray-700 border-b py-1"
            >
              <span class="font-medium">{{ lesson.title }}</span
              ><br />
              <span class="text-xs text-gray-500"
                >Classwork: {{ lesson.classwork }}, Homework:
                {{ lesson.homework }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
