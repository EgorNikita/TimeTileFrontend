<script setup>
defineProps({
  grade: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  subjectColor: {
    type: String,
    default: "text-red-500",
  },
  workType: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});
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
        <h3 class="font-semibold text-lg" :class="subjectColor">
          {{ subject }}
        </h3>
        <p class="text-gray-700 text-sm">{{ workType }}</p>
      </div>
    </div>

    <!-- Date -->
    <div class="text-right ml-5">
      <span class="text-gray-600 font-medium">{{ date }}</span>
    </div>
  </div>
</template>
