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

    <div v-if="submissionWithFiles.files.length > 0" class="mt-3">
      <p class="text-sm font-medium text-gray-800 mb-2">Attached Files:</p>
      <div class="space-y-2">
        <div
          v-for="(file, index) in submissionWithFiles.files"
          :key="index"
          class="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-gray-800 hover:bg-white/90 transition-colors"
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
import {
  CheckCircleIcon,
  DocumentIcon,
  DocumentTextIcon,
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
import { formatDateTo21May2025at } from "@/utils/dateUtils";
import { EnrichedSubmissionWithFiles } from "@/types/assignment";
import { computed, onMounted, reactive, watch } from "vue";
import { fetchFileByGuidAsFile } from "@/services/fileService";
import {
  canBePreviewed,
  downloadFile,
  formatFileSize,
  getFileType,
  getFileTypeLabel,
  openFile
} from "@/helpers/fileHelpers";

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
    const filePromises = props.submission.fileUrls.map(async (fileUrl) => {
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
