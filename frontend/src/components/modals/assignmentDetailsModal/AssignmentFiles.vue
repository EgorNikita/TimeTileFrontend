<!-- AssignmentFiles.vue -->
<template>
  <div v-if="assignment.hasAttachment" class="mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
      <DocumentTextIcon class="w-5 h-5 mr-2 text-gray-600" />
      Assignment Files
    </h3>

    <!-- Loading state -->
    <div v-if="isLoading" class="bg-gray-50 rounded-lg p-4">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Files list -->
    <div v-else-if="files.length > 0" class="bg-gray-50 rounded-lg p-4">
      <div class="space-y-3">
        <div
          v-for="file in files"
          :key="file.id"
          class="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <DocumentTextIcon class="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p class="font-medium text-gray-900">
                {{ file.filename }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatFileSize(file.size) }} •
                {{ getFileExtension(file.filename) }}
              </p>
            </div>
          </div>
          <a
            :href="file.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentTextIcon } from "@heroicons/vue/24/outline";

defineProps<{
  assignment: {
    hasAttachment: boolean;
  };
  files: Array<{
    id: string;
    filename: string;
    size: number;
    url: string;
  }>;
  isLoading: boolean;
}>();

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileExtension = (filename: string) => {
  return filename.split(".").pop()?.toUpperCase() || "";
};
</script>
