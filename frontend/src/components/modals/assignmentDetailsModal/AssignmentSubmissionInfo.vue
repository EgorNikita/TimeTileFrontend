<template>
  <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
    <div class="flex flex-col items-start justify-center">
      <h3 class="font-medium text-green-800 mb-2 flex items-center">
        <CheckCircleIcon class="w-5 h-5 mr-2" />
        Submission Details
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-green-700 pl-3">
            <span class="font-medium">Submitted at:</span>
            {{ formatDateTo21May2025at(submission.submittedAt) }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="submission.studentNote" class="mt-3">
      <p class="text-sm font-medium text-green-800">Student Note:</p>
      <p class="text-sm text-green-700 mt-1 bg-white/50 p-3 rounded border">
        {{ submission.studentNote }}
      </p>
    </div>

    <div v-if="submissionWithFiles.files.length > 0">
      <div v-if="fileState.loading" class="bg-gray-50 rounded-lg p-4">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <div v-else class="mt-3">
        <p class="text-sm font-medium text-gray-800 mb-2">Attached Files:</p>
        <div class="space-y-2">
          <div
            v-for="(file, index) in submissionWithFiles.files"
            :key="index"
            class="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-gray-800 hover:bg-white/90 transition-colors"
          >
            <FilePreview :file="file" />
            <FileActionBar :file="file" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
import { formatDateTo21May2025at } from "@/utils/dateUtils";
import { EnrichedSubmissionWithFiles } from "@/types/assignment";
import { computed, onMounted, reactive, watch } from "vue";
import { fetchFilesByUrls } from "@/services/fileService";
import FilePreview from "@/components/modals/assignmentDetailsModal/FilePreview.vue";
import FileActionBar from "@/components/modals/assignmentDetailsModal/FileActionBar.vue";

const props = defineProps<{
  submission: EnrichedSubmissionWithFiles;
}>();

const fileState = reactive<{
  files: File[];
  loading: boolean;
  error: string | null;
}>({
  files: [],
  loading: false,
  error: null,
});

const submissionWithFiles = computed(() => ({
  ...props.submission,
  files: fileState.files,
}));

// Function to fetch all files
const fetchFiles = async () => {
  fileState.loading = true;
  fileState.error = null;
  fileState.files = [];

  try {
    const fileUrls = props.submission.fileUrls.map((fileInfo) => fileInfo.fileUrl)
    fileState.files = await fetchFilesByUrls(fileUrls);
    console.log("Fetched files:", fileState.files);
  } catch (err) {
    fileState.error =
      err instanceof Error ? err.message : "Failed to fetch files";
    console.error("Error fetching files:", fileState.error);
  } finally {
    fileState.loading = false;
  }
};

watch(
  () => props.submission.fileUrls,
  (newFileUrls) => {
    if (newFileUrls.length > 0) {
      fetchFiles();
    } else {
      fileState.files = [];
    }
  },
  { immediate: true },
);

// Fetch files when the component mounts or when fileUrls change
onMounted(fetchFiles);
</script>
