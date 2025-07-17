<template>
  <!-- Empty State -->
  <div v-if="isEmptyState" class="text-center py-12">
    <div class="text-gray-500">
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
    :scroll-container="props.scrollContainer"
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

        <!-- Homework Items -->
        <div class="space-y-3 px-2">
          <div
            v-for="assignment in dateGroup.items"
            :key="assignment.submission.id"
            class="flex items-center justify-between min-h-24 shadow-lg border border-zinc-200 rounded-lg bg-zinc-50 rounded-lg p-4 hover:bg-gray-750 cursor-pointer hover:scale-101 transition-transform duration-200 ease-in-out"
          >
            <div class="flex items-center space-x-4">
              <span class="relative inline-block flex-shrink-0">
                <img
                  class="h-12 w-12 rounded-md"
                  :src="
                    assignment.assignment.course.iconUrl ||
                    'https://via.placeholder.com/72'
                  "
                  alt=""
                />
              </span>

              <!-- Homework Details -->
              <div class="flex-1">
                <h3 class="font-medium text-gray-900 mb-1">
                  {{ assignment.assignment.title }}
                </h3>
                <div class="flex flex-col space-x-4 text-sm text-gray-400">
                  <span v-if="assignment.submission.submittedAt"
                    >Submitted at:
                    {{
                      formatDateTo21May2025at(assignment.submission.submittedAt)
                    }}</span
                  >
                  <span>{{ assignment.assignment.course.title }}</span>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center space-x-2">
              <div
                :class="[
                  'px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1',
                  statusMetaMap[assignment.submission.status].bgColorClass,
                  statusMetaMap[assignment.submission.status].textColorClass,
                ]"
              >
                <component
                  :is="statusMetaMap[assignment.submission.status].icon"
                  class="w-4 h-4"
                />
                <span>{{
                  statusMetaMap[assignment.submission.status].text
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LazyScrollWrapper>
</template>

<script setup lang="ts">
import {
  BasicAssignmentWithSubmission,
  EnrichedAssignmentWithSubmission,
  GroupedAssignmentByDate,
  statusMetaMap,
} from "@/types/assignment";
import { computed, ref, watch } from "vue";
import { getDayAsText } from "@/components/common/timetable/timetableUtils";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import {
  formatDateTo21May2025,
  formatDateTo21May2025at,
} from "@/utils/dateUtils";

const props = defineProps<{
  scrollContainer: HTMLElement | null;
  assignments: EnrichedAssignmentWithSubmission[];
  assignmentsQuery: ReturnType<
    typeof useInfiniteQuery<PagedList<BasicAssignmentWithSubmission>>
  >;
}>();

const localAssignments = ref<EnrichedAssignmentWithSubmission[]>([]);

const groupedAssignments = computed<GroupedAssignmentByDate[]>(() => {
  const grouped: Record<string, EnrichedAssignmentWithSubmission[]> = {};

  localAssignments.value.forEach((assignment) => {
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
    localAssignments.value.length === 0 &&
    !props.assignmentsQuery.isFetching.value
  );
});

watch(
  () => localAssignments.value,
  (length) => {
    console.log("assignments22222 length changed:", length);
  },
);

watch(
  () => props.assignments,
  (val) => {
    // Only update if it's not an intermediate empty array
    if (val.length > 0 || !props.assignmentsQuery.isLoading) {
      localAssignments.value = val;
    }
  },
  { immediate: true },
);
</script>
