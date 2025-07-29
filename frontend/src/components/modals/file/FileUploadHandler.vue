<template>
  <FileUploadSection
    :files="files"
    :disabled="disabled"
    @process:files="processFiles"
    @remove:file="removeFile"
  />
</template>

<script setup lang="ts">
import FileUploadSection from "@/components/modals/file/FileUploadSection.vue";

const props = defineProps<{
  files: File[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:files": [files: File[]];
}>();

const processFiles = (files: File[]) => {
  emit("update:files", [...props.files, ...files]);
};

const removeFile = (index: number) => {
  const newFiles = [...props.files];
  newFiles.splice(index, 1);
  emit("update:files", newFiles);
};

</script>