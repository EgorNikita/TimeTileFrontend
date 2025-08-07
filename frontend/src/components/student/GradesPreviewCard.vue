<script setup lang="ts">
import { computed } from "vue";

interface GradeInfo {
  id: number;
  value: number;
  subjectId: number;
  subjectTitle: string;
  type: string;
  date: string;
}

const props = defineProps<{
  gradeInfo: GradeInfo;
}>();

const formattedDate = computed(() => {
  if (!props.gradeInfo.date) return "";

  const date = new Date(props.gradeInfo.date);
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("uk", {
    month: "2-digit",
    day: "2-digit",
  }).format(date);
});

const formatNumber = (n: number) => {
  return n % 1 === 0 ? n : n.toFixed(1);
}
</script>

<template>
  <div class="flex items-center space-x-4 w-full">
    <!-- Grade Circle -->
    <div
      class="w-14 h-14 rounded-full border-3 border-blue-400 flex items-center justify-center"
    >
      <span class="text-2xl font-bold text-blue-500">
        {{ formatNumber(gradeInfo.value) }}
      </span>
    </div>

    <!-- Text container that can shrink/grow -->
    <div class="flex-1 min-w-0">
      <h3
        ref="tooltipTrigger"
        class="truncate overflow-hidden whitespace-nowrap font-semibold text-lg text-red-500"
        v-tooltip="{
          content: gradeInfo.subjectTitle,
          theme: 'arrowed-tooltip',
          strategy: 'fixed',
          boundary: 'scrollParent',
          flip: true,
          preventOverflow: true,
        }"
      >
        {{ gradeInfo.subjectTitle }}
      </h3>
      <p class="text-gray-700 text-sm">
        {{ gradeInfo.type }}
      </p>
    </div>

    <!-- Date -->
    <div class="text-right ml-5">
      <span class="text-gray-600 font-medium">{{ formattedDate }}</span>
    </div>
  </div>
</template>
