<template>
  <div
    v-if="grade !== -1"
    class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 flex items-center justify-center">
            <AcademicCapIcon />
          </div>
        </div>
        <div class="flex flex-col justify-center items-start">
          <h3 class="text-lg font-semibold text-gray-900">Grade Received</h3>
          <p class="text-sm text-gray-600">Assignment has been graded</p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold text-blue-600">
          {{ grade.value }}
          <span v-if="maxPoints" class="text-lg text-gray-500">
            / {{ maxPoints }}
          </span>
        </div>

        <div v-if="percentage" class="text-sm text-gray-500">
          {{ percentage }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGradeByIdQuery } from "@/tanStackQueries/student/grades/useGradeById";
import { AcademicCapIcon } from "@heroicons/vue/24/outline";

interface Props {
  gradeId: number;
}

const props = defineProps<Props>();

const maxPoints = 15;

const gradeQuery = useGradeByIdQuery(props.gradeId);
const grade = computed(() => {
  console.log("Grade Query Data:", gradeQuery.data);
  return gradeQuery.data?.value || -1;
});

const percentage = computed(() => {
  if (grade.value === -1 || !maxPoints) return null;
  return Math.round((grade.value.value / maxPoints) * 100);
});
</script>
