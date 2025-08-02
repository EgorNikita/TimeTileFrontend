<template>
  <div class="flex flex-col h-full">
    <!-- Messages -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-2"
      @scroll="handleScroll"
    >
      <ChatMessage
        v-for="(message, index) in reversedMessages"
        :key="message.id"
        :message="message"
        :belongs-to-previous-message="isContinuationOfPrevious(index)"
        @openEditForm="form.openEditForm"
      />
    </div>

    <!-- Add message button -->
    <button
      v-if="!form.isOpen"
      @click="form.openForm"
      class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2 z-10"
    >
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

    <!-- Form -->
    <form
      v-if="form.isOpen"
      @submit.prevent="form.submitForm"
      class="space-y-4 border-t bg-gray-50 p-3"
    >
      <FileManagementHandler
        v-model:files="form.selectedFiles"
        :disabled="form.isSubmitting"
        @update:files="form.handleFilesUpdate"
      />

      <textarea
        v-model="form.content"
        rows="1"
        :disabled="form.isSubmitting"
        class="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
        placeholder="Add any note..."
      />

      <div class="flex justify-between items-center">
        <button
          type="button"
          @click="form.closeForm"
          :disabled="form.isSubmitting"
          class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <svg class="w-4 h-4" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          :disabled="form.isSubmitting || form.isEmpty"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <ArrowRightIcon class="w-4 h-4" />
          <span>{{ form.isEditMode ? "Update" : "Send" }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useChatForm } from "@/composables/useChatForm";
import { useMessagesWithRealTime } from "@/composables/useMessagesWithRealTime";
//
// import ChatMessage from "@/components/common/ChatMessage.vue";
// import FileManagementHandler from "@/components/modals/file/FileManagementHandler.vue";
//
// import { useMessagesWithSignalR } from "@/tanStackQueries/student/message/useMessagesWithSignalR";
// import { useChatForm } from "@/composables/useChatForm";
// import type { EnrichedMessage } from "@/types/message";

const route = useRoute();
const courseId = Number.parseInt(route.params.courseId as string);

// === Messages ===
const messagesQuery = useMessagesWithRealTime({
  courseIds: [courseId],
  sortBy: "sentAt",
  descending: true,
});

const messages = computed(
  () => messagesQuery.data.value?.pages.flatMap((page) => page.items) ?? [],
);
const reversedMessages = computed(() => [...messages.value].reverse());

// === Chat Form (composable) ===
const form = useChatForm(courseId, () => messages.value);

// === Scroll handling ===
const messagesContainer = ref<HTMLElement>();
const isAtBottom = ref(true);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const handleScroll = () => {
  if (!messagesContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  const threshold = clientHeight / 4;

  isAtBottom.value = scrollTop + clientHeight >= scrollHeight - threshold;

  if (
    scrollTop === 0 &&
    messagesQuery.hasNextPage.value &&
    !messagesQuery.isFetchingNextPage.value
  ) {
    const prevHeight = scrollHeight;
    messagesQuery.fetchNextPage().then(() => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop =
            messagesContainer.value.scrollHeight - prevHeight;
        }
      });
    });
  }
};

const isContinuationOfPrevious = (index: number) => {
  if (index === 0) return false;
  const current = reversedMessages.value[index];
  const prev = reversedMessages.value[index - 1];
  return (
    current.userId === prev.userId &&
    Math.abs(
      new Date(current.sentAt).getTime() - new Date(prev.sentAt).getTime(),
    ) /
      60000 <=
      15
  );
};

// Auto scroll
watch(messages, () => {
  if (isAtBottom.value) scrollToBottom();
});
onMounted(scrollToBottom);
</script>
