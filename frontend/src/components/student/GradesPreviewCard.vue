<script setup>
import { computed } from "vue";
import { subjectCache } from "@/store/cache/subjectCache.js";

const props = defineProps({
  grade: {
    type: Number,
    required: true,
  },
  subjectId: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const formattedDate = computed(() =>
  new Intl.DateTimeFormat('uk', {
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(props.date))
);

const subject = subjectCache.get(props.subjectId);
console.log(subject);
const subjectTitle = subject.title;

</script>

<template>
  <div class="flex items-center justify-between">
    <!-- Grade Circle -->
    <div class="flex items-center space-x-4">
      <div
        class="w-14 h-14 rounded-full border-3 border-blue-400 flex items-center justify-center"
      >
        <span class="text-2xl font-bold text-blue-500">{{ grade }}</span>
      </div>

      <!-- Subject and Work Type -->
      <div>
        <h3 class="font-semibold text-lg text-red-500 truncate max-w-xs">
          {{ subjectTitle }}
        </h3>
        <p class="text-gray-700 text-sm">{{ type }}</p>
      </div>
    </div>

    <!-- Date -->
    <div class="text-right ml-5">
      <span class="text-gray-600 font-medium">{{ formattedDate }}</span>
    </div>
  </div>
</template>
