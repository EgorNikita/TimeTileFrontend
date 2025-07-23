<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
      <DocumentTextIcon class="w-5 h-5 mr-2 text-gray-600" />
      Description
    </h3>
    <div class="prose max-w-none text-left">
      <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentTextIcon } from "@heroicons/vue/24/outline";

defineProps<{
  description: string;
}>();
</script>
