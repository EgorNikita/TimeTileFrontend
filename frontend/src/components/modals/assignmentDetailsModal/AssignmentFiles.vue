<!-- AssignmentFiles.vue -->
<template>
  <div v-if="assignmentWithFiles.files.length > 0" class="mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
      <DocumentTextIcon class="w-5 h-5 mr-2 text-gray-600" />
      Files
    </h3>

    <!-- Loading state -->
    <div v-if="fileState.loading" class="bg-gray-50 rounded-lg p-4">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Files list -->
    <div v-else class="bg-gray-50 rounded-lg p-4">
      <div class="space-y-3">
        <div
          v-for="(file, index) in assignmentWithFiles.files"
          :key="index"
          class="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <FilePreview :file="file" />
          <FileActionBar :file="file" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentTextIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, reactive, watch } from "vue";
import { fetchFilesByUrls } from "@/services/fileService";
import { EnrichedAssignmentWithFiles } from "@/types/assignment";
import FileActionBar from "@/components/modals/assignmentDetailsModal/FileActionBar.vue";
import FilePreview from "@/components/modals/assignmentDetailsModal/FilePreview.vue";

const props = defineProps<{
  assignment: EnrichedAssignmentWithFiles;
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

const assignmentWithFiles = computed(() => ({
  ...props.assignment,
  files: fileState.files,
}));

// Function to fetch all files
const fetchFiles = async () => {
  fileState.loading = true;
  fileState.error = null;
  fileState.files = [];

  try {
    const fileUrls = props.assignment.fileUrls.map((fileInfo) => fileInfo.fileUrl)
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
  () => props.assignment.fileUrls,
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
