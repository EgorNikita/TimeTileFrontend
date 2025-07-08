<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from "@headlessui/vue";
import { ChevronUpDownIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";

interface Term {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
}

const props = defineProps<{
  terms: Term[];
  selectedTerm: Term;
}>();

const emit = defineEmits<{
  "update:selectedTerm": [term: Term];
}>();

const handleSelection = (term: Term) => {
  emit("update:selectedTerm", term);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
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
        class="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      >
        <span class="col-start-1 row-start-1 truncate pr-6">
          <div class="font-medium">{{ selectedTerm.title }}</div>
          <div class="text-xs text-gray-500">
            {{ formatDate(selectedTerm.start_date) }} -
            {{ formatDate(selectedTerm.end_date) }}
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
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
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
                  ? 'bg-indigo-600 text-white outline-hidden'
                  : 'text-gray-900',
                'relative cursor-default py-2 pr-9 pl-3 select-none',
              ]"
            >
              <div
                :class="[
                  selected ? 'font-semibold' : 'font-normal',
                  'block truncate',
                ]"
              >
                <div>{{ term.title }}</div>
                <div
                  :class="[
                    active ? 'text-indigo-200' : 'text-gray-500',
                    'text-xs',
                  ]"
                >
                  {{ formatDate(selectedTerm.start_date) }} -
                  {{ formatDate(selectedTerm.end_date) }}
                </div>
              </div>
              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-indigo-600',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <CheckIcon class="size-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
