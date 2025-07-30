<template>
  <div
    :class="[
      'flex shadow-lg border border-zinc-200 rounded-lg bg-zinc-50 hover:bg-gray-750 cursor-pointer hover:scale-101 transition-transform duration-200 ease-in-out',
      isCompact
        ? 'flex-col min-h-20 p-3'
        : 'flex-row items-center justify-between min-h-24 p-4',
    ]"
    @click="handleClick"
  >
    <!-- Main content: Icon + Assignment details -->
    <div
      :class="[
        'flex items-start',
        isCompact ? 'space-x-3 mb-2' : 'items-center space-x-4',
      ]"
    >
      <span class="relative inline-block flex-shrink-0">
        <img
          :class="['rounded-md', isCompact ? 'h-10 w-10' : 'h-12 w-12']"
          :src="
            assignment.assignment.course.iconUrl ||
            'https://via.placeholder.com/72'
          "
          alt=""
        />
      </span>

      <!-- Assignment Details -->
      <div class="flex-1 min-w-0">
        <h3
          :class="[
            'font-medium text-gray-900 mb-1 truncate',
            isCompact ? 'text-sm leading-tight' : 'text-base',
          ]"
        >
          {{ assignment.assignment.title }}
        </h3>
        <div
          :class="[
            'flex flex-col text-gray-400',
            isCompact ? 'space-y-0.5 text-xs' : 'space-y-1 text-sm',
          ]"
        >
          <span
            v-if="assignment.submission.status === Status.NOT_SUBMITTED"
            class="truncate font-medium"
            >Due at:
            {{ formatDateTo21May2025at(assignment.assignment.deadline) }}
          </span>
          <span
            v-else-if="assignment.submission.status === Status.EXPIRED"
            class="truncate text-red-600 font-medium"
            >Due at:
            {{ formatDateTo21May2025at(assignment.assignment.deadline) }}
          </span>
          <span v-else-if="assignment.submission.submittedAt" class="truncate">
            Submitted at:
            {{ formatDateTo21May2025at(assignment.submission.submittedAt) }}
          </span>

          <!-- Course title with inline status badge for compact mode -->
          <div v-if="isCompact" class="flex items-center justify-between">
            <span class="truncate">{{
              assignment.assignment.course.title
            }}</span>
            <div
              :class="[
                'font-medium flex items-center space-x-1 flex-shrink-0 rounded px-2 py-1 text-xs ml-2',
                statusMetaMap[assignment.submission.status].bgColorClass,
                statusMetaMap[assignment.submission.status].textColorClass,
              ]"
            >
              <component
                :is="statusMetaMap[assignment.submission.status].icon"
                class="w-3 h-3"
              />
              <span class="hidden sm:inline">{{
                statusMetaMap[assignment.submission.status].text
              }}</span>
            </div>
          </div>

          <!-- Course title for non-compact mode -->
          <span v-else class="truncate">{{
            assignment.assignment.course.title
          }}</span>
        </div>
      </div>
    </div>

    <!-- Status badge for non-compact mode only -->
    <div v-if="!isCompact" class="flex justify-start">
      <div
        :class="[
          'font-medium flex items-center space-x-1 flex-shrink-0 rounded px-3 py-1 text-xs rounded-md',
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
  </div>
</template>

<script setup lang="ts">
import {
  EnrichedAssignmentWithSubmission,
  statusMetaMap,
} from "@/types/assignment";
import { formatDateTo21May2025at } from "@/utils/dateUtils";
import { computed } from "vue";
import { Status } from "@/services/assignmentApi";

const props = defineProps<{
  assignment: EnrichedAssignmentWithSubmission;
  width?: number;
}>();

const emit = defineEmits<{
  click: [assignment: EnrichedAssignmentWithSubmission];
}>();

const isCompact = computed(() => {
  return props.width ? props.width < 600 : false;
});

const handleClick = () => {
  emit("click", props.assignment);
};
</script>
