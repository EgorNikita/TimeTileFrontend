<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center space-x-2 mb-2">
        <component
          :is="statusMetaMap[assignment.submission.status].icon"
          class="w-5 h-5"
          :class="statusMetaMap[assignment.submission.status].textColorClass"
        />
        <span class="font-medium text-gray-700">Status</span>
      </div>
      <div
        :class="[
          'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium',
          statusMetaMap[assignment.submission.status].bgColorClass,
          statusMetaMap[assignment.submission.status].textColorClass,
        ]"
      >
        <component
          :is="statusMetaMap[assignment.submission.status].icon"
          class="w-4 h-4"
        />
        <span>{{ statusMetaMap[assignment.submission.status].text }}</span>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center space-x-2 mb-2">
        <ClockIcon class="w-5 h-5 text-gray-600" />
        <span class="font-medium text-gray-700">Due Date</span>
      </div>
      <div class="flex items-center space-x-2">
        <p
          class="text-sm font-medium"
          :class="
            assignment.submission.status === Status.EXPIRED
              ? 'text-red-600'
              : 'text-gray-900'
          "
        >
          {{ formatDateTo21May2025at(assignment.assignment.deadline) }}
        </p>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center space-x-2 mb-2">
        <CalendarIcon class="w-5 h-5 text-gray-600" />
        <span class="font-medium text-gray-700">Published</span>
      </div>
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium text-gray-900">
          {{ formatDateTo21May2025at(assignment.assignment.publishedAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, ClockIcon } from "@heroicons/vue/24/outline";
import {
  EnrichedAssignmentWithSubmission,
  statusMetaMap,
} from "@/types/assignment";
import { formatDateTo21May2025at } from "@/utils/dateUtils";
import { Status } from "@/services/assignmentApi";

const props = defineProps<{
  assignment: EnrichedAssignmentWithSubmission;
}>();
</script>
