<template>
  <div>
    <label class="block text-sm font-medium text-blue-800 mb-2">
      Upload Files
    </label>
    <div
      ref="dropZone"
      class="cursor-pointer border-2 border-dashed rounded-lg p-6 text-center bg-white/50 transition-all duration-200"
      :class="[
        isDragOver
          ? 'border-blue-500 bg-blue-50/70 scale-[1.02]'
          : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50/30',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      @click="handleDropZoneClick"
      @dragover.prevent="handleDragOver"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        @change="handleFileSelect"
        :disabled="disabled"
        :accept="acceptedTypes"
        class="hidden"
      />

      <CloudArrowUpIcon
        class="w-8 h-8 mx-auto mb-2 transition-colors duration-200"
        :class="isDragOver ? 'text-blue-500' : 'text-blue-400'"
      />

      <p
        class="text-sm mb-2 transition-colors duration-200"
        :class="isDragOver ? 'text-blue-700' : 'text-blue-600'"
      >
        <button
          type="button"
          @click.stop="$refs.fileInput?.click()"
          :disabled="disabled"
          class="font-medium hover:text-blue-500 disabled:opacity-50 transition-colors duration-200"
          :class="isDragOver ? 'text-blue-700' : 'text-blue-600'"
        >
          Click to upload files
        </button>
        or drag and drop
      </p>

      <p
        class="text-xs transition-colors duration-200"
        :class="isDragOver ? 'text-blue-600' : 'text-blue-500'"
      >
        PDF, DOC, DOCX, TXT, ZIP, JPG, JPEG, PNG up to 10MB each
      </p>

      <!-- Loading state -->
      <div v-if="isProcessing" class="mt-2">
        <div class="inline-flex items-center text-sm text-blue-600">
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing files...
        </div>
      </div>
    </div>

    <!-- Selected Files Display -->
    <SelectedFilesList
      v-if="files.length > 0"
      :files="files"
      @remove="removeFile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CloudArrowUpIcon } from "@heroicons/vue/24/outline";
import SelectedFilesList from "./SelectedFilesList.vue";

const props = defineProps<{
  files: File[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "process:files": [files: File[]];
  "remove:file": [index: number];
}>();

const isDragOver = ref(false);
const isProcessing = ref(false);
const dropZone = ref<HTMLDivElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const acceptedTypes = ".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png";

const validMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "image/jpeg",
  "image/png",
];
const maxSize = 10 * 1024 * 1024; // 10MB

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (files) {
    processFiles(Array.from(files));
  }
};

const handleDropZoneClick = () => {
  if (!props.disabled) {
    fileInput.value?.click();
  }
};

const handleDragEnter = () => {
  if (!props.disabled) {
    isDragOver.value = true;
  }
};

const handleDragOver = () => {
  if (!props.disabled) {
    isDragOver.value = true;
  }
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  if (props.disabled || !event.dataTransfer) return;
  const droppedFiles = Array.from(event.dataTransfer.files);
  processFiles(droppedFiles);
};

const processFiles = (files: File[]) => {
  isProcessing.value = true;
  const validFiles = files.filter(
      (file) => validMimeTypes.includes(file.type) && file.size <= maxSize,
  );

  emit("process:files", validFiles);
  isProcessing.value = false;
};

const removeFile = (index: number) => {
  emit("remove:file", index);
};
</script>
