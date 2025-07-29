<template>
  <FileUploadSection
    :files="rawFiles"
    :disabled="disabled"
    @process:files="processFiles"
    @remove:file="removeFile"
  />
</template>

<script setup lang="ts">

import { EnrichedFile } from "@/types/file";
import FileUploadSection from "@/components/modals/file/FileUploadSection.vue";
import { computed } from "vue";

export interface UploadedFile {
  file: File;
  guid?: string;
  isNew: boolean;
}

const props = defineProps<{
  files: EnrichedFile[];
  disabled?: boolean;
}>();

const rawFiles = computed<File[]>(() =>
  props.files.map((enrichedFile) => enrichedFile.file)
);

const uploadedFiles = computed<UploadedFile[]>(() =>
  props.files.map((enrichedFile) => {
    return {
      file: enrichedFile.file,
      guid: enrichedFile.guid,
      isNew: false,
    }
  })
);

const emit = defineEmits<{
  "update:files": [files: UploadedFile[]];
}>();

const processFiles = (files: File[]) => {
  const newFiles = files.map<UploadedFile>((file) => {
    return {
      file: file,
      guid: undefined,
      isNew: true,
    };
  });

  emit("update:files", [...uploadedFiles.value, ...newFiles]);
};

const removeFile = (index: number) => {
  const newFiles = [...uploadedFiles.value];
  newFiles.splice(index, 1);
  emit("update:files", newFiles);
};

</script>