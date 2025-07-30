<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, nextTick, onMounted, watch } from "vue";
import { useMessagesWithSignalR } from "@/tanStackQueries/student/message/useMessagesWithSignalR";
import { useSignalRStore } from "@/store/modules/signalR";
import ChatMessage from "@/components/common/ChatMessage.vue";
import { useCreateMessage } from "@/tanStackQueries/student/message/useCreateMessage";
import { ArrowRightIcon } from "@heroicons/vue/24/outline";
import {EnrichedMessage} from "@/types/message";
import {EnrichedFile} from "@/types/file";
import FileManagementHandler, { UploadedFile } from "@/components/modals/file/FileManagementHandler.vue";
import {useUpdateMessage} from "@/tanStackQueries/student/message/useUpdateMessage";

const route = useRoute();
const courseId = Number.parseInt(route.params.courseId as string);
const signalR = useSignalRStore();

const messagesQuery = useMessagesWithSignalR({
  courseIds: [courseId],
  sortBy: 'sentAt',
  descending: true,
});

const messages = computed(
  () =>
    messagesQuery.data.value?.pages?.flatMap((page) => page.items) ??
    [],
);

const reversedMessages = computed(() => messages.value.reverse());

// Data
const messagesContainer = ref<HTMLElement>();
const isAtBottom = ref(true);

const isFormOpened = ref(false);
const isEditForm = ref(false);

const selectedFiles = ref<EnrichedFile[]>([]);
const content = ref<string>("");
const messageToEditId = ref<number>(-1);
const addedFilesCounter = ref<number>(0);

const isInProgress = ref(false);

const isFormEmpty = computed(
    () => selectedFiles.value.length === 0 && content.value.length === 0,
);

const openForm = () => {
  isFormOpened.value = true;
  isEditForm.value = false;

  scrollToBottom();
};

const openEditForm = (message: EnrichedMessage) => {
  content.value = message.content ?? "";
  selectedFiles.value = message.files ?? [];
  messageToEditId.value = message.id;

  isFormOpened.value = true;
  isEditForm.value = true;
};

const closeForm = () => {
  clearForm();
  isFormOpened.value = false;
};

const clearForm = () => {
  content.value = "";
  selectedFiles.value = [];
};

const handleFilesUpdate = (updatedFiles: UploadedFile[]) => {
  if (!isEditForm.value) return;

  // Conversion of UploadedFile[] to EnrichedFile[]
  selectedFiles.value = updatedFiles.map(uploadedFile => ({
      file: uploadedFile.file,
      guid: uploadedFile.isNew
        ? (++addedFilesCounter.value).toString()
        : uploadedFile.guid!
    })
  );
}

const calculateFileChanges = () => {
  const message = messages.value.find(message => message.id === messageToEditId.value)!;
  const originalFiles = message.files ?? [];

  const originalGuids = originalFiles.map(file => file.guid);
  const currentGuids = selectedFiles.value?.map(file => file.guid) ?? [];

  const addedFiles = selectedFiles.value
      .filter(file => !originalGuids.includes(file.guid))
      .map(enrichedFile => enrichedFile.file);

  const deletedGuids = originalGuids.filter(guid => !currentGuids.includes(guid));

  return { addedFiles, deletedGuids };
}

const { mutate: create } = useCreateMessage();
const { mutate: update } = useUpdateMessage();

const submitForm = async () => {
  if (isInProgress.value) return;

  isInProgress.value = true;

  try {
    if (isEditForm.value) {
      await editMessage();
    } else {
      await sendMessage();
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isInProgress.value = false;
    closeForm();
  }
};

const sendMessage = async () => {
  if (selectedFiles.value.length > 0) {
    create({
      courseId: courseId,
      content: content.value.trim(),
      files: selectedFiles.value.map<File>(enrichedFile => enrichedFile.file),
    });
  } else {
    await signalR.sendMessage(courseId, content.value.trim());
  }
}

const editMessage = async () => {
  const { addedFiles, deletedGuids } = calculateFileChanges();
  if (addedFiles.length === 0 && deletedGuids.length === 0) {
    await signalR.editMessage(messageToEditId.value, content.value.trim());
  } else {
    update({
      messageId: messageToEditId.value,
      payload: {
        content: content.value.trim(),
        filesToAdd: addedFiles,
        filesToRemove: deletedGuids
      }
    });
  }
}

// Handle scroll events to determine if user scrolled up
const handleScroll = () => {
  if (!messagesContainer.value) return;

  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  const threshold = clientHeight / 4; // 1/4 of the viewport height
  isAtBottom.value = scrollTop + clientHeight >= scrollHeight - threshold;

  // Load more messages when scrolled to top
  if (
    scrollTop === 0 &&
    messagesQuery.hasNextPage.value &&
    !messagesQuery.isFetchingNextPage.value
  ) {
    const previousScrollHeight = scrollHeight;
    messagesQuery.fetchNextPage().then(() => {
      // Maintain scroll position after loading more messages
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight - previousScrollHeight;
        }
      });
    });
  }
};

// Auto-scroll to bottom when new messages arrive
const scrollToBottom = async () => {
  if (messagesContainer.value) {
    await nextTick();
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Check if message is from same user as previous message and was sent in almost the same time
const belongsToPreviousMessage = (index: number) => {
  if (index === 0) return false;
  return (
    reversedMessages.value[index].userId ===
    reversedMessages.value[index - 1].userId &&
    Math.abs(
      new Date(reversedMessages.value[index].sentAt).getTime() -
      new Date(reversedMessages.value[index - 1].sentAt).getTime(),
    ) /
    (1000 * 60) <=
    15
  );
};

// Watch for new messages and scroll to bottom
watch(messages, () => {
  if (isAtBottom.value) scrollToBottom();
});

onMounted(scrollToBottom);
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-2"
      @scroll="handleScroll"
    >
      <!-- Loading indicator for fetching older messages -->
      <!--      <div-->
      <!--        v-if="messagesQuery.isFetchingNextPage.value"-->
      <!--        class="flex justify-center py-2"-->
      <!--      >-->
      <!--        <div-->
      <!--          class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"-->
      <!--        ></div>-->
      <!--      </div>-->

      <!-- Error state -->
      <!--      <div v-if="messagesQuery.error.value" class="text-center py-4">-->
      <!--        <p class="text-red-500 mb-2">Failed to load messages</p>-->
      <!--        <button-->
      <!--          @click="messagesQuery.refetch()"-->
      <!--          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"-->
      <!--        >-->
      <!--          Retry-->
      <!--        </button>-->
      <!--      </div>-->

      <!-- Messages -->
      <ChatMessage
        v-for="(message, index) in reversedMessages"
        :key="message.id"
        :message="message"
        :belongs-to-previous-message="belongsToPreviousMessage(index)"
        @openEditForm="openEditForm"
      />

      <!-- Initial loading state -->
      <!--      <div-->
      <!--        v-if="messagesQuery.isLoading.value"-->
      <!--        class="flex justify-center py-8"-->
      <!--      >-->
      <!--        <div-->
      <!--          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"-->
      <!--        ></div>-->
      <!--      </div>-->

      <!-- No messages state -->
      <!--      <div-->
      <!--        v-if="!messagesQuery.isLoading.value && messages.length === 0"-->
      <!--        class="text-center py-8"-->
      <!--      >-->
      <!--        <p class="text-gray-500">-->
      <!--          No messages yet. Be the first to start the conversation!-->
      <!--        </p>-->
      <!--      </div>-->
      <!--    </div>-->

      <!-- Scroll to bottom button (show when user scrolled up) -->
      <!--    <div-->
      <!--      v-if="!isAtBottom && messages.length > 0"-->
      <!--      class="absolute bottom-20 right-5"-->
      <!--    >-->
      <!--      <button-->
      <!--        @click="scrollToBottom"-->
      <!--        class="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors"-->
      <!--        title="Scroll to bottom"-->
      <!--      >-->
      <!--        <svg-->
      <!--          class="w-5 h-5"-->
      <!--          fill="none"-->
      <!--          stroke="currentColor"-->
      <!--          viewBox="0 0 24 24"-->
      <!--        >-->
      <!--          <path-->
      <!--            stroke-linecap="round"-->
      <!--            stroke-linejoin="round"-->
      <!--            stroke-width="2"-->
      <!--            d="M19 14l-7 7m0 0l-7-7m7 7V3"-->
      <!--          />-->
      <!--        </svg>-->
      <!--      </button>-->
    </div>

    <!-- Action Button -->
    <button
      v-if="!isFormOpened"
      @click="openForm"
      class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 z-10"
    >
      <!-- Icon (you can change this based on your variable state) -->
      <svg class="w-5 h-5" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>

      <span>Add Message</span>
    </button>

    <form
      v-if="isFormOpened"
      @submit.prevent="submitForm"
      class="space-y-4 border-t bg-gray-50 p-3"
    >
      <!-- File Upload Section -->
      <FileManagementHandler
        v-model:files="selectedFiles"
        :disabled="isInProgress"
        @update:files="handleFilesUpdate"
      />

      <!-- Content -->
      <div>
        <textarea
          id="content"
          v-model="content"
          rows="1"
          :disabled="isInProgress"
          class="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
          placeholder="Add any note..."
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-between items-center">
        <!-- Close button on the left -->
        <button
          type="button"
          @click="closeForm"
          :disabled="isInProgress"
          class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-500 border border-gray-300 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg class="w-4 h-4" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Close</span>
        </button>

        <!-- Clear and Send buttons on the right -->
        <div class="flex space-x-3">
          <button
            type="button"
            @click="clearForm"
            :disabled="isInProgress || isFormEmpty"
            class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="submit"
            :disabled="isInProgress || isFormEmpty"
            class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span v-if="isInProgress">In progress...</span>
            <span v-else>{{ isEditForm ? "Edit" : "Send" }}</span>
            <ArrowRightIcon v-if="!isInProgress" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>