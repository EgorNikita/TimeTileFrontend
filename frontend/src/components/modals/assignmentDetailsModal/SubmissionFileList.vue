<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center p-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"
      ></div>
      <span class="ml-2 text-sm text-gray-600">Loading files...</span>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-red-800 font-medium">Failed to load files</p>
          <p class="text-sm text-red-600 mt-1">{{ error }}</p>
        </div>
        <button
          @click="retry"
          class="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- File List -->
    <div v-else-if="files.length > 0" class="flex flex-wrap gap-2">
      <SubmissionFileItem
        v-for="(file, index) in files"
        :key="`${file.name}-${index}`"
        :file="file"
      />
    </div>

    <!-- No Files State -->
    <div v-else class="p-4 text-center text-gray-500 italic text-sm">
      No files attached to this submission
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import { useFileLoader } from "@/composables/useFileLoader";
import SubmissionFileItem from "@/components/modals/assignmentDetailsModal/SubmissionFileItem.vue";

const props = defineProps<{
  fileUrls: string[];
}>();

// Use the file loader composable to handle fetching files
const { files, loading, error, retry } = useFileLoader(
  toRef(props, "fileUrls"),
);
</script>
