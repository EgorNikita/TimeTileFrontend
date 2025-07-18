<template>
  <!-- Empty State -->
  <div v-if="isEmptyState" class="flex justify-center items-center py-12">
    <div
      class="flex flex-col justify-center items-center text-gray-500 bg-gray-100 rounded-lg p-20"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No assignments found
      </h3>
      <p class="text-gray-500">
        No assignments available for the selected filters.
      </p>
    </div>
  </div>

  <LazyScrollWrapper
    v-else
    :query="assignmentsQuery"
    loading-text="Loading assignments..."
    :scroll-threshold="300"
  >
    <div class="space-y-6 p-3">
      <div
        v-for="dateGroup in groupedAssignments"
        :key="dateGroup.date"
        class="space-y-4"
      >
        <!-- Date Header -->
        <div class="flex items-center space-x-3">
          <h2 class="text-lg font-semibold">{{ dateGroup.date }}</h2>
          <span class="text-sm text-gray-400">{{ dateGroup.day }}</span>
        </div>
        <div class="space-y-3 px-2">
          <AssignmentPreviewCard
            v-for="assignment in dateGroup.items"
            :key="assignment.assignment.id"
            :assignment="assignment"
            @click="openModal"
          />
        </div>
      </div>
    </div>
  </LazyScrollWrapper>

  <!-- Assignment Details Modal -->
  <AssignmentDetailsModal
    v-if="selectedAssignment"
    :assignment="selectedAssignment"
    :isOpen="isModalOpen"
    @close="closeModal"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import {
  BasicAssignmentWithSubmission,
  EnrichedAssignmentWithSubmission,
  GroupedAssignmentByDate,
} from "@/types/assignment";
import { computed, ref } from "vue";
import { getDayAsText } from "@/components/common/timetable/timetableUtils";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { formatDateTo21May2025 } from "@/utils/dateUtils";
import AssignmentPreviewCard from "@/components/student/AssignmentPreviewCard.vue";
import AssignmentDetailsModal from "@/components/modals/AssignmentDetailsModal.vue";

const props = defineProps<{
  assignments: EnrichedAssignmentWithSubmission[];
  assignmentsQuery: ReturnType<
    typeof useInfiniteQuery<PagedList<BasicAssignmentWithSubmission>>
  >;
}>();

const groupedAssignments = computed<GroupedAssignmentByDate[]>(() => {
  const grouped: Record<string, EnrichedAssignmentWithSubmission[]> = {};

  props.assignments.forEach((assignment) => {
    const date = formatDateTo21May2025(assignment.assignment.deadline);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(assignment);
  });

  return Object.entries(grouped).map(([date, items]) => {
    const day = getDayAsText(new Date(date));

    return {
      date,
      day,
      items,
    };
  });
});

const isEmptyState = computed(() => {
  return (
    props.assignments.length === 0 && !props.assignmentsQuery.isFetching.value
  );
});

// Modal state
const isModalOpen = ref(false);
const selectedAssignment = ref<EnrichedAssignmentWithSubmission | null>(null);

// Methods
const openModal = (assignment: EnrichedAssignmentWithSubmission) => {
  selectedAssignment.value = assignment;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedAssignment.value = null;
};

const handleSubmit = (submissionId: number) => {
  props.assignmentsQuery.refetch();
  closeModal();
};
</script>
