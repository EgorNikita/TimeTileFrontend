<!-- AssignmentFiles.vue -->
<template>
  <div v-if="assignment.fileUrls.length > 0" class="mb-6">
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
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <!-- File Type Icon -->
            <div class="flex-shrink-0">
              <DocumentIcon
                v-if="getFileType(file) === 'document'"
                class="w-8 h-8 text-gray-800"
              />
              <PhotoIcon
                v-else-if="getFileType(file) === 'image'"
                class="w-8 h-8 text-gray-800"
              />
              <FilmIcon
                v-else-if="getFileType(file) === 'video'"
                class="w-8 h-8 text-purple-600"
              />
              <SpeakerWaveIcon
                v-else-if="getFileType(file) === 'audio'"
                class="w-8 h-8 text-orange-600"
              />
              <ArchiveBoxIcon
                v-else-if="getFileType(file) === 'archive'"
                class="w-8 h-8 text-yellow-600"
              />
              <CodeBracketIcon
                v-else-if="getFileType(file) === 'code'"
                class="w-8 h-8 text-red-600"
              />
              <DocumentTextIcon
                v-else-if="getFileType(file) === 'text'"
                class="w-8 h-8 text-gray-600"
              />
              <TableCellsIcon
                v-else-if="getFileType(file) === 'spreadsheet'"
                class="w-8 h-8 text-teal-600"
              />
              <PresentationChartLineIcon
                v-else-if="getFileType(file) === 'presentation'"
                class="w-8 h-8 text-indigo-600"
              />
              <DocumentIcon v-else class="w-8 h-8 text-gray-500" />
            </div>

            <!-- File Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ file.name }}
              </p>
              <p class="text-xs text-gray-800">
                {{ formatFileSize(file.size) }} • {{ getFileTypeLabel(file) }}
              </p>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentTextIcon } from "@heroicons/vue/24/outline";
import { computed, onMounted, reactive, watch } from "vue";
import { fetchFileByGuidAsFile } from "@/services/fileService";
import { EnrichedAssignmentWithFiles } from "@/types/assignment";
import {
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  SpeakerWaveIcon,
  ArchiveBoxIcon,
  CodeBracketIcon,
  TableCellsIcon,
  PresentationChartLineIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
import {
  canBePreviewed,
  downloadFile,
  formatFileSize,
  getFileType,
  getFileTypeLabel,
  openFile
} from "@/helpers/fileHelpers";

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
    const filePromises = props.assignment.fileUrls.map(async (fileUrl) => {
      return await fetchFileByGuidAsFile(fileUrl.fileUrl);
    });
    fileState.files = await Promise.all(filePromises);
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
