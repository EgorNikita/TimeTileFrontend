<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-800/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-xl bg-white transition-all sm:my-8 sm:w-full sm:max-w-4xl"
            >
              <!-- Header -->
              <AssignmentModalHeader
                :assignment="assignment"
                @close="closeModal"
              />

              <!-- Content -->
              <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
                <!-- Status and Key Info -->
                <AssignmentStatusGrid :assignment="assignment" />

                <!-- Grade Display -->
                <AssignmentGrade
                  v-if="assignment.submission.gradeId"
                  :grade-id="assignment.submission.gradeId"
                />

                <!-- Expired Warning -->
                <AssignmentExpiredWarning
                  v-if="assignment.submission.status === Status.EXPIRED"
                  :upload-after-deadline="
                    assignment.assignment.uploadAfterDeadline
                  "
                />

                <!-- Submission Form -->
                <AssignmentSubmissionForm
                  v-if="canSubmit"
                  @submit="handleSubmitAssignment"
                />

                <!-- Submission Info -->
                <AssignmentSubmissionInfo
                  v-if="assignment.submission.submittedAt"
                  :submission="enrichedAssignment.submission"
                />

                <!-- Teacher Feedback -->
                <AssignmentTeacherFeedback
                  v-if="assignment.submission.feedback"
                  :feedback="assignment.submission.feedback"
                />

                <!-- Assignment Description -->
                <AssignmentDescription
                  :description="assignment.assignment.description"
                />

                <!-- Assignment Files -->
                <!--                <AssignmentFiles-->
                <!--                  :assignment="assignment.assignment"-->
                <!--                  :files="assigmentFiles"-->
                <!--                  :is-loading="assignmentFilesQuery.isLoading"-->
                <!--                />-->
              </div>

              <!-- Footer -->
              <div
                class="bg-gray-50 border-t px-6 py-4 flex justify-end space-x-3"
              >
                <button
                  @click="closeModal"
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { EnrichedAssignmentWithSubmission, Status } from "@/types/assignment";
import { useAssignmentFiles } from "@/tanStackQueries/student/assignment/useAssignmentFiles";
import AssignmentModalHeader from "@/components/modals/assignmentDetailsModal/AssignmentModalHeader.vue";
import AssignmentStatusGrid from "@/components/modals/assignmentDetailsModal/AssignmentStatusGrid.vue";
import AssignmentExpiredWarning from "@/components/modals/assignmentDetailsModal/AssignmentExpiredWarning.vue";
import AssignmentSubmissionForm from "@/components/modals/assignmentDetailsModal/AssignmentSubmissionForm.vue";
import AssignmentDescription from "@/components/modals/assignmentDetailsModal/AssignmentDescription.vue";
import AssignmentTeacherFeedback from "@/components/modals/assignmentDetailsModal/AssignmentTeacherFeedback.vue";
import AssignmentSubmissionInfo from "@/components/modals/assignmentDetailsModal/AssignmentSubmissionInfo.vue";
import { useSubmitSubmission } from "@/tanStackQueries/student/assignment/useSubmitSubmission";
import { useSubmissionFiles } from "@/tanStackQueries/student/assignment/useSubmissionFiles";
import AssignmentGrade from "@/components/modals/assignmentDetailsModal/AssignmentGrade.vue";

const props = defineProps<{
  assignment: EnrichedAssignmentWithSubmission;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [submissionId: number];
}>();

const assignmentFilesQuery = useAssignmentFiles(props.assignment.assignment.id);
const submissionFilesQuery = useSubmissionFiles(props.assignment.submission.id);

const enrichedAssignment = computed(() => {
  const assignment = props.assignment.assignment;
  const submission = props.assignment.submission;

  const assignmentFileUrls =
    assignment.hasAttachments && assignmentFilesQuery.isSuccess.value
      ? (assignmentFilesQuery.data.value ?? [])
      : [];

  const submissionFileUrls =
    submission.hasAttachments && submissionFilesQuery.isSuccess.value
      ? (submissionFilesQuery.data.value ?? [])
      : [];

  return {
    assignment: {
      ...assignment,
      fileUrls: assignmentFileUrls,
    },
    submission: {
      ...submission,
      fileUrls: submissionFileUrls,
    },
  };
});

watch(
  () => props.assignment,
  (newVal) => {
    assignmentFilesQuery.refetch();
    submissionFilesQuery.refetch();
  },
  { immediate: true },
);

const closeModal = () => {
  emit("close");
};

const { mutate: submit, isPending } = useSubmitSubmission();

const handleSubmitAssignment = (files: File[], note: string) => {
  submit(
    {
      id: props.assignment.submission.id,
      studentNote: note,
      filesToAdd: files,
    },
    {
      onSuccess: () => {
        console.log("Assignment submitted successfully!");
        emit("submit", props.assignment.submission.id);
      },
      onError: (err: unknown) => {
        console.error("Assignment submission failed:", err);
        // Handle error (e.g., show an error toast, update UI, etc.)
      },
    },
  );
};

const canSubmit = computed(() => {
  return (
    props.assignment.submission.status === Status.NOT_SUBMITTED ||
    (props.assignment.submission.status === Status.EXPIRED &&
      props.assignment.assignment.uploadAfterDeadline)
  );
});
</script>
