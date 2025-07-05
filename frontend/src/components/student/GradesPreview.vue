<script setup>
import { ref } from "vue";
import GradesPreviewCard from "./GradesPreviewCard.vue";

const grades = ref([
  {
    id: 1,
    grade: 12,
    subject: "Українська мова",
    subjectColor: "text-red-500",
    workType: "Контрольна робота",
    date: "17.06",
  },
  {
    id: 2,
    grade: 8,
    subject: "Математика",
    subjectColor: "text-red-500",
    workType: "Самостійна робота",
    date: "14.06",
  },
  {
    id: 3,
    grade: 10,
    subject: "Фізика",
    subjectColor: "text-red-500",
    workType: "Лабораторна робота",
    date: "13.06",
  },
  {
    id: 3,
    grade: 10,
    subject: "Фізика",
    subjectColor: "text-red-500",
    workType: "Лабораторна робота",
    date: "13.06",
  },
  {
    id: 3,
    grade: 10,
    subject: "Фізика",
    subjectColor: "text-red-500",
    workType: "Лабораторна робота",
    date: "13.06",
  },
  {
    id: 3,
    grade: 10,
    subject: "Фізика",
    subjectColor: "text-red-500",
    workType: "Лабораторна робота",
    date: "13.06",
  },
  {
    id: 3,
    grade: 10,
    subject: "Фізика",
    subjectColor: "text-red-500",
    workType: "Лабораторна робота",
    date: "13.06",
  },
  {
    id: 3,
    grade: 10,
    subject: "Фізика",
    subjectColor: "text-red-500",
    workType: "Лабораторна робота",
    date: "13.06",
  },
  {
    id: 3,
    grade: 10,
    subject: "Фізика",
    subjectColor: "text-red-500",
    workType: "Лабораторна робота",
    date: "13.06",
  },
]);
</script>

<template>
  <div class="relative bg-white rounded-xl shadow-lg p-6 pr-4 flex flex-col">
    <!-- Header -->
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex-shrink-0">
      Нові оцінки
    </h2>

    <!-- Grades List -->
    <div class="flex-1 overflow-x-hidden min-h-0 custom-scrollbar">
      <div class="space-y-4 pr-3">
        <GradesPreviewCard
          v-for="grade in grades"
          :key="grade.id"
          :grade="grade.grade"
          :subject="grade.subject"
          :subject-color="grade.subjectColor"
          :work-type="grade.workType"
          :date="grade.date"
        />
      </div>
    </div>
  </div>
</template>
