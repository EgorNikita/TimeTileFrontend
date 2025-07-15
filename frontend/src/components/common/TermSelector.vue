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
import { Term } from "@/types/term";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { computed } from "vue";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";

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
    class="w-sm"
  >
    <ListboxLabel class="block text-sm/6 font-medium text-gray-900"
      >Select Term</ListboxLabel
    >
    <div class="relative mt-2">
      <ListboxButton
        class="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-3 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
      >
        <span v-if="selectedTerm" class="col-start-1 row-start-1 truncate pr-6">
          <div class="font-medium truncate">{{ selectedTerm.title }}</div>
          <div class="text-xs text-gray-500">
            {{ formatDate(selectedTerm.startDate) }} -
            {{ formatDate(selectedTerm.endDate) }}
          </div>
        </span>
        <ChevronUpDownIcon
          class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          aria-hidden="true"
        />
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
          style="max-height: calc(4 * (2rem + 1rem + 0.5rem))"
        >
          <LazyScrollWrapper
            :query="useTermQuery"
            :scroll-threshold="100"
            :show-no-more-text="false"
            loading-text="Loading more terms..."
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
                  active
                    ? 'bg-blue-600 text-white outline-hidden'
                    : 'text-gray-900',
                  'relative cursor-default py-2 pr-4 pl-8 select-none',
                ]"
              >
                <div
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate',
                  ]"
                >
                  <div class="truncate">{{ term.title }}</div>
                  <div
                    :class="[
                      active ? 'text-blue-200' : 'text-gray-500',
                      'text-xs',
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
                    'absolute inset-y-0 left-0 flex items-center pl-1.5',
                  ]"
                >
                  <CheckIcon class="size-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </LazyScrollWrapper>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
