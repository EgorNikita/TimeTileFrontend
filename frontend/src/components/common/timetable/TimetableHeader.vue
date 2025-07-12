<template>
  <header class="flex flex-none items-center justify-between px-6 pt-4 pb-3">
    <h1 class="text-base font-semibold text-gray-900">
      <time :datetime="currentDate">{{ displayDate }}</time>
    </h1>
    <div class="flex items-center">
      <div
        class="relative flex items-center rounded-md bg-white shadow-xs md:items-stretch"
      >
        <button
          type="button"
          class="cursor-pointer flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
          @click="$emit('previous')"
          v-tooltip.left="{
            content: 'Previous week',
            theme: 'simple-tooltip',
            boundary: 'scrollParent',
            strategy: 'fixed',
            flip: true,
            preventOverflow: true,
          }"
        >
          <span class="sr-only">Previous week</span>
          <ChevronLeftIcon class="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="cursor-pointer hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
          @click="$emit('today')"
        >
          Today
        </button>
        <span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
        <button
          type="button"
          class="cursor-pointer flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
          @click="$emit('next')"
          v-tooltip.right="{
            content: 'Next week',
            theme: 'simple-tooltip',
            boundary: 'scrollParent',
            strategy: 'fixed',
            flip: true,
            preventOverflow: true,
          }"
        >
          <span class="sr-only">Next week</span>
          <ChevronRightIcon class="size-5" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden md:ml-4 md:flex md:items-center">
        <Menu as="div" class="relative cursor-pointer">
          <MenuButton
            type="button"
            class="cursor-pointer flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
          >
            {{ currentView }}
            <ChevronDownIcon
              class="-mr-1 size-5 text-gray-400"
              aria-hidden="true"
            />
          </MenuButton>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden"
            >
              <div class="py-1">
                <MenuItem v-slot="{ active }" v-for="view in views" :key="view">
                  <a
                    href="#"
                    :class="[
                      active
                        ? 'bg-gray-100 text-gray-900 outline-hidden'
                        : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    ]"
                    @click.prevent="$emit('view-change', view)"
                    >{{ view }}</a
                  >
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        <div class="ml-6 h-6 w-px bg-gray-300" />
        <button
          type="button"
          class="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          @click="$emit('add-event')"
        >
          Add event
        </button>
      </div>
      <Menu as="div" class="relative ml-6 md:hidden">
        <MenuButton
          class="relative flex items-center rounded-full border border-transparent text-gray-400 outline-offset-8 hover:text-gray-500"
        >
          <span class="absolute -inset-2"></span>
          <span class="sr-only">Open menu</span>
          <EllipsisHorizontalIcon class="size-5" aria-hidden="true" />
        </MenuButton>

        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden"
          >
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active
                      ? 'bg-gray-100 text-gray-900 outline-hidden'
                      : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  @click.prevent="$emit('add-event')"
                  >Create event</a
                >
              </MenuItem>
            </div>
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active
                      ? 'bg-gray-100 text-gray-900 outline-hidden'
                      : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  @click.prevent="$emit('today')"
                  >Go to today</a
                >
              </MenuItem>
            </div>
            <div class="py-1">
              <MenuItem v-slot="{ active }" v-for="view in views" :key="view">
                <a
                  href="#"
                  :class="[
                    active
                      ? 'bg-gray-100 text-gray-900 outline-hidden'
                      : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  @click.prevent="$emit('view-change', view)"
                  >{{ view }}</a
                >
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </header>
</template>

<script setup>
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

// Props
const props = defineProps({
  currentDate: {
    type: String,
    default: "2022-01",
  },
  displayDate: {
    type: String,
    default: "January 2022",
  },
  currentView: {
    type: String,
    default: "Week view",
  },
  views: {
    type: Array,
    default: () => ["Day view", "Week view"],
  },
});

// Emits
defineEmits(["previous", "next", "today", "view-change", "add-event"]);
</script>
