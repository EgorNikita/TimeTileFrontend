<template>
  <div class="mt-4 space-y-2">
    <div
      v-for="(file, index) in files"
      :key="index"
      class="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
    >
      <div class="flex items-center space-x-3">
        <DocumentIcon class="w-5 h-5 text-blue-500" />
        <div class="flex flex-col items-start">
          <p class="text-sm font-medium text-gray-900">
            {{ file.name }}
          </p>
          <p class="text-xs text-gray-500">
            {{ formatFileSize(file.size) }}
          </p>
        </div>
      </div>
      <button
        type="button"
        @click="$emit('remove', index)"
        class="cursor-pointer text-red-500 hover:text-red-700"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentIcon, XMarkIcon } from "@heroicons/vue/24/outline";

defineProps<{
  files: File[];
}>();

defineEmits<{
  remove: [index: number];
}>();

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>
