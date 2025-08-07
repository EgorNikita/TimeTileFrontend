<template>
  <div
    class="flex items-center justify-between p-3 bg-white/80 rounded-lg transition-colors group w-2xs"
  >
    <div class="flex items-center space-x-3 flex-1 min-w-0">
      <!-- File Type Icon -->
      <div class="flex-shrink-0">
        <icon :name="`file-${fileInfo.label.toLowerCase()}`" size="w-10 h-10" />
      </div>

      <!-- File Info -->
      <div class="flex-1 flex-col items-center justify-center min-w-0">
        <p
          class="text-sm font-medium text-gray-800 truncate"
          :title="file.name"
        >
          {{ file.name }}
        </p>
        <div class="flex items-center space-x-2 text-xs text-gray-600">
          <span>{{ formattedFileSize }}</span>
          <span>•</span>
          <span class="font-medium">{{ fileInfo.label }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex ml-2 items-center space-x-1">
      <!-- Preview/Open Button -->
      <button
        @click="handleOpenFile"
        :class="[
          'cursor-pointer p-2 rounded-lg transition-colors',
          fileInfo.canPreview
            ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
        ]"
        :title="fileInfo.canPreview ? 'Preview file' : 'Open file'"
      >
        <EyeIcon v-if="fileInfo.canPreview" class="w-4 h-4" />
        <ArrowTopRightOnSquareIcon v-else class="w-4 h-4" />
      </button>

      <!-- Download Button -->
      <button
        @click="handleDownloadFile"
        class="cursor-pointer p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        title="Download file"
      >
        <ArrowDownTrayIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getFileInfo, formatFileSize } from "@/utils/fileUtils";
import {
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
import { useFileOperations } from "@/composables/useFileOperations";
import Icon from "@/components/common/Icon.vue";

const props = defineProps<{
  file: File;
}>();

// Get file information
const fileInfo = computed(() => getFileInfo(props.file));
const formattedFileSize = computed(() => formatFileSize(props.file.size));

// File operations
const { openFile, downloadFile } = useFileOperations({
  onError: (error) => {
    console.error("File operation error:", error);
  },
  onSuccess: (message) => {
    console.log("File operation success:", message);
  },
});

// Event handlers
const handleOpenFile = () => {
  openFile(props.file);
};

const handleDownloadFile = () => {
  downloadFile(props.file);
};
</script>
