<script setup lang="ts">
import { formatFileSize, getFileType, getFileTypeLabel } from "@/helpers/fileHelpers";
import {
  ArchiveBoxIcon, CodeBracketIcon, DocumentIcon,
  DocumentTextIcon, FilmIcon,
  PhotoIcon, PresentationChartLineIcon,
  SpeakerWaveIcon,
  TableCellsIcon
} from "@heroicons/vue/24/outline";

const props = defineProps({
  file: {
    type: File,
    required: true
  }
})

const fileType = getFileType(props.file)
</script>

<template>
  <div class="flex items-center space-x-3 flex-1 min-w-0">
    <!-- File Type Icon -->
    <div class="flex-shrink-0">
      <DocumentIcon
        v-if="fileType === 'document'"
        class="w-8 h-8 text-gray-800"
      />
      <PhotoIcon
        v-else-if="fileType === 'image'"
        class="w-8 h-8 text-gray-800"
      />
      <FilmIcon
        v-else-if="fileType === 'video'"
        class="w-8 h-8 text-purple-600"
      />
      <SpeakerWaveIcon
        v-else-if="fileType === 'audio'"
        class="w-8 h-8 text-orange-600"
      />
      <ArchiveBoxIcon
        v-else-if="fileType === 'archive'"
        class="w-8 h-8 text-yellow-600"
      />
      <CodeBracketIcon
        v-else-if="fileType === 'code'"
        class="w-8 h-8 text-red-600"
      />
      <DocumentTextIcon
        v-else-if="fileType === 'text'"
        class="w-8 h-8 text-gray-600"
      />
      <TableCellsIcon
        v-else-if="fileType === 'spreadsheet'"
        class="w-8 h-8 text-teal-600"
      />
      <PresentationChartLineIcon
        v-else-if="fileType === 'presentation'"
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
</template>