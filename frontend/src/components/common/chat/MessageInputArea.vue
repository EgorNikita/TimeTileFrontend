<template>
  <div class="bg-white border-t border-gray-200 px-4 py-4">
    <div class="flex items-end justify-center space-x-3">
      <!-- File Upload Button -->
      <div class="flex-shrink-0 mb-2">
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileSelect"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />
        <button
          @click="triggerFileInput"
          class="cursor-pointer p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors transform hover:scale-105"
          :disabled="isUploading"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>
      </div>

      <!-- Message Input Area -->
      <div class="flex-1 relative">
        <!-- File Previews -->
        <div v-if="selectedFiles.length > 0" class="mb-3">
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
            >
              <svg
                class="h-4 w-4 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-gray-700 truncate max-w-32">{{
                file.name
              }}</span>
              <button
                @click="removeFile(index)"
                class="cursor-pointer text-gray-400 hover:text-red-500 ml-1"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Textarea -->
        <div class="relative">
          <textarea
            ref="textareaRef"
            v-model="messageContent"
            @keydown="handleKeyDown"
            placeholder="Type a message..."
            class="w-full border border-gray-300 overflow-auto thin-scrollbar rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm resize-none textarea-auto-resize whitespace-pre-wrap break-words"
            :disabled="isUploading"
            rows="1"
          ></textarea>

          <!--          &lt;!&ndash; Character Count &ndash;&gt;-->
          <!--          <div-->
          <!--            v-if="messageContent.length > 800"-->
          <!--            class="absolute -top-6 right-0 text-xs"-->
          <!--            :class="-->
          <!--              messageContent.length > 1000 ? 'text-red-500' : 'text-gray-400'-->
          <!--            "-->
          <!--          >-->
          <!--            {{ messageContent.length }}/1000-->
          <!--          </div>-->
        </div>
      </div>

      <!-- Send Button -->
      <div class="flex-shrink-0 mb-2">
        <button
          @click="sendMessage"
          :disabled="!canSend"
          class="cursor-pointer p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="
            canSend
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          "
        >
          <PaperAirplaneIconOutline
            v-if="!isUploading && !canSend"
            class="h-5 w-5"
          />
          <PaperAirplaneIconSolid
            v-else-if="!isUploading && canSend"
            class="h-5 w-5 text-white"
          />
          <div
            v-else
            class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
          ></div>
        </button>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="isUploading" class="mt-3">
      <div class="bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Uploading files... {{ uploadProgress }}%
      </p>
    </div>
  </div>
</template>

<style scoped>
.textarea-auto-resize {
  field-sizing: content;
  min-height: 44px;
  max-height: 120px;
  overflow-y: auto;
}

/* Fallback for browsers that don't support field-sizing */
@supports not (field-sizing: content) {
  .textarea-auto-resize {
    height: auto;
    line-height: 1.5;
    min-height: 44px;
    max-height: 120px;
    overflow-y: auto;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { PaperAirplaneIcon as PaperAirplaneIconOutline } from "@heroicons/vue/24/outline";
import { PaperAirplaneIcon as PaperAirplaneIconSolid } from "@heroicons/vue/24/solid";

const emit = defineEmits<{
  sendMessage: [content: string, selectedFiles?: File[]];
}>();

const messageContent = ref("");
const selectedFiles = ref<File[]>([]);
const textareaRef = ref<HTMLTextAreaElement>();
const fileInput = ref<HTMLInputElement>();
const isUploading = ref(false);
const uploadProgress = ref(0);

const canSend = computed(() => {
  return (
    (messageContent.value.trim().length > 0 ||
      selectedFiles.value.length > 0) &&
    messageContent.value.length <= 1000 &&
    !isUploading.value
  );
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    const validFiles = Array.from(files).slice(
      0,
      5 - selectedFiles.value.length,
    ); // Max 5 files
    selectedFiles.value.push(...validFiles);
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const sendMessage = async () => {
  if (!canSend.value) return;

  const content = messageContent.value.trim();
  const files =
    selectedFiles.value.length > 0 ? [...selectedFiles.value] : undefined;

  if (files && files.length > 0) {
    isUploading.value = true;
    uploadProgress.value = 0;

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      uploadProgress.value += 10;
      if (uploadProgress.value >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          isUploading.value = false;
          uploadProgress.value = 0;
        }, 500);
      }
    }, 100);
  }

  emit("sendMessage", content, files);

  // Reset form
  messageContent.value = "";
  selectedFiles.value = [];

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

onMounted(() => {
  // Focus on textarea when component mounts
  textareaRef.value?.focus();
});
</script>
