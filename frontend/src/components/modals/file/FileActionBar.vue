<script setup lang="ts">
import { canBePreviewed, downloadFile, openFile } from "@/helpers/fileHelpers";
import { ArrowDownTrayIcon, ArrowTopRightOnSquareIcon, EyeIcon } from "@heroicons/vue/24/outline";

defineProps({
  file: {
    type: File,
    required: true
  }
})
</script>


<template>
  <!-- Actions -->
  <div class="flex items-center space-x-2 ml-4">
    <!-- Open/Preview button -->
    <button
      @click="openFile(file)"
      class="cursor-pointer p-2 text-gray-800 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
      :title="canBePreviewed(file) ? 'Preview file' : 'Open file'"
    >
      <EyeIcon v-if="canBePreviewed(file)" class="w-4 h-4" />
      <ArrowTopRightOnSquareIcon v-else class="w-4 h-4" />
    </button>

    <!-- Download button -->
    <button
      @click="downloadFile(file)"
      class="cursor-pointer p-2 text-gray-800 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
      title="Download file"
    >
      <ArrowDownTrayIcon class="w-4 h-4" />
    </button>
  </div>
</template>