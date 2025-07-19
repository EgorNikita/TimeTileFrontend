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
              :title="canPreview(file) ? 'Preview file' : 'Open file'"
            >
              <EyeIcon v-if="canPreview(file)" class="w-4 h-4" />
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

// Function to get file type based on MIME type
const getFileType = (file: File): string => {
  const mimeType = file.type.toLowerCase();

  // Primary check using MIME type
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("text/")) return "text";

  // Specific MIME types
  const typeMap: Record<string, string> = {
    // Documents
    "application/pdf": "document",
    "application/msword": "document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "document",
    "application/rtf": "document",
    "application/vnd.oasis.opendocument.text": "document",

    // Spreadsheets
    "application/vnd.ms-excel": "spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "spreadsheet",
    "application/vnd.oasis.opendocument.spreadsheet": "spreadsheet",
    "text/csv": "spreadsheet",

    // Presentations
    "application/vnd.ms-powerpoint": "presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "presentation",
    "application/vnd.oasis.opendocument.presentation": "presentation",

    // Archives
    "application/zip": "archive",
    "application/x-rar-compressed": "archive",
    "application/x-7z-compressed": "archive",
    "application/x-tar": "archive",
    "application/gzip": "archive",

    // Code/Development
    "application/javascript": "code",
    "application/json": "code",
    "application/xml": "code",
    "text/html": "code",
    "text/css": "code",
    "text/javascript": "code",
    "application/x-python": "code",
    "text/x-python": "code",

    // Text
    "text/plain": "text",
    "text/markdown": "text",
    "application/yaml": "text",
    "text/yaml": "text",
  };

  // If MIME type matches, return the category
  if (typeMap[mimeType]) {
    return typeMap[mimeType];
  }

  // Fallback to extension-based detection if MIME type is generic or unknown
  if (mimeType === "application/octet-stream" || !mimeType) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const extMap: Record<string, string> = {
      doc: "document",
      docx: "document",
      pdf: "document",
      jpg: "image",
      jpeg: "image",
      png: "image",
      gif: "image",
      svg: "image",
      mp4: "video",
      avi: "video",
      mkv: "video",
      mov: "video",
      mp3: "audio",
      wav: "audio",
      flac: "audio",
      zip: "archive",
      rar: "archive",
      "7z": "archive",
      js: "code",
      ts: "code",
      py: "code",
      java: "code",
      cpp: "code",
      txt: "text",
      md: "text",
      xls: "spreadsheet",
      xlsx: "spreadsheet",
      ppt: "presentation",
      pptx: "presentation",
    };
    return extMap[ext] || "document";
  }

  return "document";
};

// Function to get file extension
const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

// Function to get file type label for display
const getFileTypeLabel = (file: File): string => {
  const mimeType = file.type.toLowerCase();

  // Show specific MIME type labels for better user understanding
  const labelMap: Record<string, string> = {
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
    "application/zip": "ZIP",
    "application/x-rar-compressed": "RAR",
    "application/json": "JSON",
    "text/csv": "CSV",
    "text/plain": "TXT",
    "text/html": "HTML",
    "text/css": "CSS",
    "text/javascript": "JS",
    "application/javascript": "JS",
  };

  // If we have a specific label for this MIME type, use it
  if (labelMap[mimeType]) {
    return labelMap[mimeType];
  }

  // For generic MIME types, show the subtype
  if (mimeType.includes("/")) {
    const subtype = mimeType.split("/")[1].toUpperCase();
    return subtype;
  }

  // Fallback to file extension
  return getFileExtension(file.name).toUpperCase() || "FILE";
};

// Function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Function to check if file can be previewed
const canPreview = (file: File): boolean => {
  const mimeType = file.type.toLowerCase();

  // Check MIME type first
  if (mimeType.startsWith("image/")) return true;
  if (mimeType.startsWith("text/")) return true;
  if (mimeType === "application/pdf") return true;
  if (mimeType === "application/json") return true;

  // Fallback to extension check for unknown MIME types
  if (!mimeType || mimeType === "application/octet-stream") {
    const ext = getFileExtension(file.name);
    const previewableExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "svg",
      "webp",
      "pdf",
      "txt",
      "md",
      "json",
      "xml",
      "csv",
      "html",
      "css",
      "js",
    ];
    return previewableExtensions.includes(ext);
  }

  return false;
};

// Function to open/preview file
const openFile = (file: File) => {
  const url = URL.createObjectURL(file);

  if (canPreview(file)) {
    // For previewable files, open in a new tab
    window.open(url, "_blank");
  } else {
    // For non-previewable files, trigger download
    downloadFile(file);
  }

  // Clean up the URL after a delay
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Function to download file
const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

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
  () => props.submission,
  (newSubmission) => {
    console.log("Submission changed:", newSubmission);
  },
  { immediate: true },
);

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
