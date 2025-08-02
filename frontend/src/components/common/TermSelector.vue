<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/20/solid";
import { ChevronUpDownIcon } from "@heroicons/vue/24/outline";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { computed } from "vue";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";
import { Term } from "@/services/termApi";

const props = defineProps<{
  useTermQuery: ReturnType<typeof useInfiniteQuery<PagedList<Term>>>;
  selectedTerm: Term;
}>();

const emit = defineEmits<{
  "update:selectedTerm": [term: Term];
}>();

const terms = computed(() => {
  return (
    props.useTermQuery.data.value?.pages.flatMap((page) => page.items) || []
  );
});

const handleSelection = (term: Term) => {
  emit("update:selectedTerm", term);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "Invalid date"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};
</script>

<template>
  <Listbox
    as="div"
    :model-value="selectedTerm"
    @update:model-value="handleSelection"
    class="w-full max-w-sm"
  >
    <ListboxLabel class="block text-sm font-medium text-gray-900 mb-2">
      Selected Term
    </ListboxLabel>
    <div class="relative">
      <ListboxButton
        class="grid w-full cursor-pointer grid-cols-1 rounded-md bg-white py-3 sm:py-2 pr-10 pl-3 sm:pl-3 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm transition-colors hover:bg-gray-50 touch-manipulation"
      >
        <span v-if="selectedTerm" class="col-start-1 row-start-1 pr-6 min-w-0">
          <div class="font-medium truncate text-sm sm:text-base">
            {{ selectedTerm.title }}
          </div>
          <div class="text-xs text-gray-500 mt-0.5 truncate">
            {{ formatDate(selectedTerm.startDate) }} -
            {{ formatDate(selectedTerm.endDate) }}
          </div>
        </span>
        <ChevronUpDownIcon
          class="col-start-1 row-start-1 w-5 h-5 self-center justify-self-end text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      </ListboxButton>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <ListboxOptions
          class="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg focus:outline-none overflow-hidden"
          :style="{ maxHeight: 'min(50vh, 320px)' }"
        >
          <LazyScrollWrapper
            :query="useTermQuery"
            :scroll-threshold="100"
            :show-no-more-text="false"
            loading-text="Loading more terms..."
            class="max-h-full overflow-y-auto"
            :style="{ maxHeight: 'min(50vh, 300px)' }"
          >
            <ListboxOption
              as="template"
              v-for="term in terms"
              :key="term.id"
              :value="term"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  active ? 'bg-blue-600 text-white' : 'text-gray-900',
                  'relative cursor-pointer select-none py-3 sm:py-2 pl-10 pr-4 transition-colors touch-manipulation',
                ]"
              >
                <div class="min-w-0">
                  <div
                    :class="[
                      selected ? 'font-semibold' : 'font-normal',
                      'truncate text-sm sm:text-base',
                    ]"
                  >
                    {{ term.title }}
                  </div>
                  <div
                    :class="[
                      active ? 'text-blue-200' : 'text-gray-500',
                      'text-xs mt-0.5 truncate',
                    ]"
                  >
                    {{ formatDate(term.startDate) }} -
                    {{ formatDate(term.endDate) }}
                  </div>
                </div>
                <span
                  v-if="selected"
                  :class="[
                    active ? 'text-white' : 'text-blue-600',
                    'absolute inset-y-0 left-0 flex items-center pl-3',
                  ]"
                >
                  <CheckIcon class="w-5 h-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </LazyScrollWrapper>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
