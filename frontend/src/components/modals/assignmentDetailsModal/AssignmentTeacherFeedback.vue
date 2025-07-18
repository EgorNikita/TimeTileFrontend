<template>
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
    <h3 class="font-medium text-blue-800 mb-2 flex items-center">
      <ChatBubbleLeftRightIcon class="w-5 h-5 mr-2" />
      Teacher Feedback
    </h3>
    <p class="text-sm text-blue-700 bg-white/50 p-3 rounded border">
      {{ feedback }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ChatBubbleLeftRightIcon } from "@heroicons/vue/24/outline";

defineProps<{
  feedback: string;
}>();
</script>
