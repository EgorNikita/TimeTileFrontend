<template>
  <div class="grid grid-rows-[auto_auto_1fr] h-full">
    <!-- Header -->
    <div class="bg-gray-100 pt-10 px-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="flex-1 text-2xl font-semibold text-gray-900">
          Assignments Dashboard
        </h1>
        <div class="flex-1 flex justify-end">
          <CourseSelector @course-selected="handleCourseSelected" />
        </div>
      </div>
    </div>

    <!-- Sticky Tabs -->
    <div class="flex items-center rounded-lg mb-4 space-x-4 mx-6 bg-white p-2">
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

    <!-- Scrollable Content -->
    <div class="bg-white rounded-lg shadow-lg p-2 overflow-auto mx-6 mb-5">
      <AssignmentsList
        :assignments="enrichedAssignments"
        :assignments-query="assignmentsQuery"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, watchEffect } from "vue";
import { useAssignmentsWithSubmission } from "@/tanStackQueries/student/assignment/useAssignmentsWithSubmission";
import { EnrichedAssignmentWithSubmission } from "@/types/assignment";
import AssignmentsList from "@/components/common/assigments/AssignmentsList.vue";
import { useBulkCourses } from "@/tanStackQueries/student/course/useBulkCourses";
import CourseSelector from "@/components/common/CourseSelector.vue";
import { Status, SubmissionFilters } from "@/services/assignmentApi";
import { Course } from "@/services/courseApi";

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
const selectedCourseId = ref<number | null>(null);

const currentFilters = computed(() => {
  const baseFilters = tabsToFilters[activeTab.value];

  console.log(selectedCourseId.value);

  // Add course filter if a course is selected
  if (selectedCourseId.value !== null) {
    const filters = {
      ...baseFilters,
      courseIds: selectedCourseId.value,
    };
    return filters;
  }

  return baseFilters;
});

const assignmentsQuery = useAssignmentsWithSubmission({
  filters: currentFilters,
});
const assignments = computed(
  () => assignmentsQuery.data.value?.pages?.flatMap((page) => page.items) ?? [],
);

const uniqueCourseIds = computed(() => {
  const courseIds = assignments.value.map(
    (assignment) => assignment.assignment.courseId,
  );
  return [...new Set(courseIds)];
});

const coursesQuery = useBulkCourses(uniqueCourseIds);

const fetchedCourses = ref(new Map<number, Course>());

watchEffect(() => {
  const newCourses = coursesQuery.data.value ?? [];
  newCourses.forEach((course) => {
    fetchedCourses.value.set(course.id, course);
  });
});

const coursesMap = computed(() => fetchedCourses.value);

const enrichedAssignments: ComputedRef<EnrichedAssignmentWithSubmission[]> =
  computed(() => {
    if (assignments.value.length === 0) {
      return [];
    }

    return assignments.value
      .map((entry) => {
        const course = coursesMap.value.get(entry.assignment.courseId);

        // If course not found, skip this assignment
        if (!course) {
          return null;
        }

        return {
          assignment: {
            ...entry.assignment,
            course: course,
          },
          submission: entry.submission,
        };
      })
      .filter(
        (entry): entry is EnrichedAssignmentWithSubmission => entry !== null,
      );
  });

const handleCourseSelected = (courseId: number | null) => {
  selectedCourseId.value = courseId;
};
</script>
