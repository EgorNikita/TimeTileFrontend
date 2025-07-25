<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, nextTick, onMounted, watch, onBeforeUnmount, onUnmounted } from "vue";
import { useMessagesWithSignalR } from "@/tanStackQueries/student/message/useMessagesWithSignalR";
import { useSignalRStore } from "@/store/modules/signalR";

const route = useRoute();
const courseId = Number.parseInt(route.params.courseId as string);

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

const signalR = useSignalRStore();

const messagesContainer = ref<HTMLElement>();
const isAtBottom = ref(true);

// Auto-scroll to bottom when new messages arrive
const scrollToBottom = async () => {
  if (messagesContainer.value) {
    await nextTick();
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Watch for new messages and scroll to bottom
watch(messages, scrollToBottom);

const newMessage = ref('');

const sendMessage = async () => {
  await signalR.sendMessage(courseId, newMessage.value.trim());
  newMessage.value = '';
}

onMounted(() => {
  scrollToBottom();
});

// Handle scroll events to determine if user scrolled up
const handleScroll = () => {
  if (!messagesContainer.value) return;

  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value;
  isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

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

// Format date helper
const formatMessageTime = (date: Date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInHours =
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInHours < 168) {
    // 7 days
    return messageDate.toLocaleDateString([], {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

// Check if message is from same user as previous message and was sent in almost the same time
const belongsToPreviousMessage = (index: number) => {
  if (index === 0) return false;
  return (
    reversedMessages.value[index].userId ===
    reversedMessages.value[index - 1].userId
    &&
    Math.abs(
      (new Date(reversedMessages.value[index].sentAt)).getTime() -
      (new Date(reversedMessages.value[index - 1].sentAt)).getTime()
    ) / (1000 * 60) <= 15
  );
};
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
      <div
          v-for="(message, index) in reversedMessages"
          :key="message.id"
          class="group animate-fade-in"
      >
        <!-- Message bubble -->
        <div
            class="flex items-start space-x-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
            :class="{
        'mt-0': belongsToPreviousMessage(index),
        'mt-4': !belongsToPreviousMessage(index),
      }"
        >
          <!-- Avatar -->
          <div
              v-if="!belongsToPreviousMessage(index)"
              class="relative flex-shrink-0"
          >
            <!-- Avatar image with fallback to initials -->
            <img
                class="w-10 h-10 rounded-full object-cover shadow-md"
                :src="message.user.avatarUrl"
                alt="`${message.user.firstname} avatar`"
            />
          </div>

          <!-- Spacer for grouped messages -->
          <div v-else class="flex-shrink-0 w-10"></div>

          <!-- Message content -->
          <div class="flex-1 min-w-0">
            <!-- User info (only show if not same user as previous) -->
            <div
                v-if="!belongsToPreviousMessage(index)"
                class="flex items-center space-x-2 mb-1"
            >
        <span class="font-semibold text-gray-900 text-sm">
          {{ message.user.firstname }} {{ message.user.lastname }}
        </span>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {{ formatMessageTime(message.sentAt) }}
        </span>
            </div>

            <!-- Message bubble -->
            <div class="relative">
              <div class="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-2xl"
                   :class="{
               'rounded-tl-md': !belongsToPreviousMessage(index)
             }">
                <p class="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {{ message.content || "(No content)" }}
                </p>

                <!-- Edited indicator -->
                <div
                    v-if="message.editedAt"
                    class="flex items-center space-x-1 mt-2 pt-2 border-t border-gray-100"
                >
                  <svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                  <span class="text-xs text-gray-400 italic">edited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

    <div class="border-t p-4 flex items-center space-x-2">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type your message..."
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keydown.enter="sendMessage"
      />
      <button
        @click="sendMessage"
        :disabled="!newMessage.trim()"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 transition"
      >
        Send
      </button>
    </div>
  </div>
</template>