<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { hideAllPoppers } from "floating-vue";
import { useInfiniteQuery } from "@tanstack/vue-query";

interface Props {
  query: ReturnType<typeof useInfiniteQuery>;
  scrollThreshold?: number;
  scrollContainer?: HTMLElement | null;
  loadingText?: string;
  showNoMoreText?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  scrollThreshold: 200,
  loadingText: "Loading more...",
  showNoMoreText: true,
});

const localContainer = ref<HTMLElement | null>(null);

const isLoading = computed(() => props.query.isFetching.value || false);
const hasMore = computed(() => props.query.hasNextPage.value || false);

const loadMore = async () => {
  console.log("Loading more items...");
  if (isLoading.value || !hasMore.value) return;
  console.log("AAAAAAAAfd", props.query.data.value);
  await props.query.fetchNextPage?.();
};

const activeScrollContainer = computed(() => {
  return props.scrollContainer || localContainer.value;
});

const onScroll = (event: Event) => {
  event.stopPropagation();
  hideAllPoppers();

  const container = activeScrollContainer.value;
  if (!container || isLoading.value || !hasMore.value) return;

  const remaining =
    container.scrollHeight + container.scrollTop - container.clientHeight;

  if (remaining < props.scrollThreshold) {
    loadMore();
  }
};

onMounted(() => {
  activeScrollContainer.value?.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  activeScrollContainer.value?.removeEventListener("scroll", onScroll);
});

watch(activeScrollContainer, (newVal, oldVal) => {
  oldVal?.removeEventListener("scroll", onScroll);
  newVal?.addEventListener("scroll", onScroll);
});
</script>

<template>
  <div class="relative h-full flex flex-col">
    <!-- Scrollable container -->
    <div
      ref="localContainer"
      class="overflow-y-auto overflow-x-hidden flex-1 min-h-0 thin-scrollbar flex flex-col-reverse"
    >
      <slot />

      <!-- Loading indicator: inside scroll container at bottom -->
      <div v-if="isLoading" class="flex items-center justify-center py-6">
        <div class="flex items-center gap-3 text-gray-600">
          <!-- Improved spinner with multiple dots -->
          <div class="flex space-x-1">
            <div
              class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style="animation-delay: 0ms"
            ></div>
            <div
              class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style="animation-delay: 150ms"
            ></div>
            <div
              class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style="animation-delay: 300ms"
            ></div>
          </div>
          <span class="text-sm font-medium">{{ loadingText }}</span>
        </div>
      </div>

      <!-- End of content indicator -->
      <!--      <div-->
      <!--        v-else-if="showNoMoreText && !hasMore"-->
      <!--        class="flex items-center justify-center py-4"-->
      <!--      >-->
      <!--        <div class="text-gray-500 text-sm">-->
      <!--          <div class="flex items-center gap-2">-->
      <!--            <div class="h-px bg-gray-300 flex-1"></div>-->
      <!--            <span>No more items to load</span>-->
      <!--            <div class="h-px bg-gray-300 flex-1"></div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}
</style>
