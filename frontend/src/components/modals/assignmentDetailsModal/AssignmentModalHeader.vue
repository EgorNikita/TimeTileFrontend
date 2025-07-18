<template>
  <div class="bg-zinc-800 text-white px-6 py-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <img
          :src="
            assignment.assignment.course.iconUrl ||
            'https://via.placeholder.com/64'
          "
          alt="Course icon"
          class="w-16 h-16 rounded-lg bg-white/10 p-2"
        />
        <div>
          <DialogTitle as="h2" class="text-2xl font-bold mb-1">
            {{ assignment.assignment.title }}
          </DialogTitle>
          <p class="text-blue-100 text-sm">
            {{ assignment.assignment.course.title }}
          </p>
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { EnrichedAssignmentWithSubmission } from "@/types/assignment";

defineProps<{
  assignment: EnrichedAssignmentWithSubmission;
}>();

defineEmits<{
  close: [];
}>();
</script>
