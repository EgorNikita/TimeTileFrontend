<template>
  <div class="flex flex-col flex-1 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">
        Assignments Dashboard
      </h1>
      <button class="text-gray-400 hover:text-white">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </div>

    <div class="flex-1 bg-white rounded-lg shadow-lg p-2 overflow-auto">
      <!-- Tabs -->
      <div class="flex items-baseline space-x-4 mb-4 m-3">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'rounded-md px-3 py-2 text-md font-medium bg-gray-100 cursor-pointer',
            activeTab === tab.id
              ? 'bg-gray-900 text-white'
              : 'text-gray-400 hover:bg-gray-200',
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Homework List -->
      <AssignmentsList
        :assignments="enrichedAssignments"
        :scroll-container="scrollContainer"
        :assignments-query="assignmentsQuery"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from "vue";
import { useAssignmentsWithSubmission } from "@/tanStackQueries/student/assignment/useAssignmentsWithSubmission";
import {
  EnrichedAssignmentWithSubmission,
  Status,
  SubmissionFilters,
} from "@/types/assignment";
import AssignmentsList from "@/components/common/assigments/AssignmentsList.vue";
import { useBulkCourses } from "@/tanStackQueries/student/course/useBulkCourses";

const props = defineProps<{
  scrollContainer: HTMLElement | null;
}>();

const tabs = [
  { id: "upcoming", name: "Upcoming" },
  { id: "past_due", name: "Past due" },
  { id: "completed", name: "Completed" },
  { id: "rejected", name: "Rejected" },
];

const tabsToFilters: Record<string, SubmissionFilters> = {
  upcoming: { statuses: [Status.NOT_SUBMITTED] },
  past_due: { statuses: [Status.EXPIRED] },
  completed: {
    statuses: [Status.SUBMITTED, Status.SUBMITTED_LATE, Status.ACCEPTED],
  },
  rejected: { statuses: [Status.REJECTED] },
};

const activeTab = ref(tabs[0].id);

const currentFilters = computed(() => tabsToFilters[activeTab.value]);

const assignmentsQuery = useAssignmentsWithSubmission(currentFilters);
const assignments = computed(
  () => assignmentsQuery.data.value?.pages?.flatMap((page) => page.items) ?? [],
);

const coursesIds = computed(() => {
  return assignments.value.map((assignment) => assignment.assignment.courseId);
});

const coursesQuery = useBulkCourses(coursesIds);
const courses = computed(() => {
  return coursesQuery.data.value ?? [];
});

const enrichedAssignments: ComputedRef<EnrichedAssignmentWithSubmission[]> =
  computed(() => {
    return assignments.value
      .map((entry) => {
        const course = courses.value.find(
          (c) => c.id === entry.assignment.courseId,
        );
        return {
          assignment: {
            ...entry.assignment,
            course: course!, // assuming course always exists, otherwise handle null
          },
          submission: entry.submission,
        };
      })
      .filter((entry) => entry.assignment.course != null);
  });

watch(assignments, (val) => {
  console.log("assignments changed:", val.length);
});
</script>
