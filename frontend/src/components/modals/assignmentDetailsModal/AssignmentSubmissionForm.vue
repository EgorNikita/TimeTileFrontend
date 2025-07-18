<template>
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
    <h3 class="font-medium text-blue-800 mb-4 flex items-center">
      <DocumentArrowUpIcon class="w-5 h-5 mr-2" />
      Submit Assignment
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- File Upload Section -->
      <FileUploadSection
        v-model:files="selectedFiles"
        :disabled="isSubmitting"
      />

      <!-- Student Note -->
      <div>
        <label
          for="studentNote"
          class="block text-sm font-medium text-blue-800 mb-2"
        >
          Add a Note (Optional)
        </label>
        <textarea
          id="studentNote"
          v-model="submissionNote"
          rows="3"
          :disabled="isSubmitting"
          class="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
          placeholder="Add any comments or notes about your submission..."
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="clearForm"
          :disabled="isSubmitting"
          class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Clear
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Assignment</span>
          <ArrowRightIcon v-if="!isSubmitting" class="w-4 h-4" />
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DocumentArrowUpIcon, ArrowRightIcon } from "@heroicons/vue/24/outline";
import FileUploadSection from "./FileUploadSection.vue";

const emit = defineEmits<{
  submit: [files: File[], note: string];
}>();

const selectedFiles = ref<File[]>([]);
const submissionNote = ref("");
const isSubmitting = ref(false);

const clearForm = () => {
  selectedFiles.value = [];
  submissionNote.value = "";
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    emit("submit", selectedFiles.value, submissionNote.value);
    clearForm();
  } catch (error) {
    console.error("Error submitting assignment:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
