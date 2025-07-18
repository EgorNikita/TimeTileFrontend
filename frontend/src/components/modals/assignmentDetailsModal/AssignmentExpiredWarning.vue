<template>
  <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
    <div class="flex flex-col justify-center items-center">
      <div class="flex items-center mb-2">
        <ExclamationTriangleIcon class="w-6 h-6 text-amber-400 mr-2" />
        <h3 class="font-medium text-amber-800 mb-1">Assignment Expired</h3>
      </div>

      <p class="text-sm text-amber-700">
        This assignment deadline has passed.
        <span v-if="uploadAfterDeadline">
          However, you can still submit your work as late submission is allowed.
        </span>
        <span v-else>
          Late submissions are not allowed for this assignment.
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

defineProps<{
  uploadAfterDeadline: boolean;
}>();
</script>
