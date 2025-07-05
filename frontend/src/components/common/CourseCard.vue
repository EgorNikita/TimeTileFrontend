<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  course: {
    type: Object,
    required: true,
    default: () => ({
      name: "",
      initials: "",
      href: "",
      members: 0,
      bgColor: "bg-gray-500",
    }),
  },
});
</script>

<template>
  <div
    class="relative flex h-full justify-between items-center border border-gray-200 rounded-lg bg-white shadow-sm px-3 pt-3 pb-4 [&:hover:not(:has(.menu-area:hover))]:bg-gray-50"
  >
    <a
      :href="course.href"
      v-tooltip="{
        content: course.name,
        theme: 'arrowed-tooltip',
      }"
      class="flex-1 flex items-center min-w-0"
    >
      <span class="relative inline-block flex-shrink-0">
        <img
          class="h-18 w-18 rounded-md"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <span
          class="absolute right-0 bottom-0 block translate-x-1/2 translate-y-1/2 transform rounded-full border-2 border-white"
        >
          <span class="block h-4 w-4 rounded-full bg-gray-300" />
        </span>
      </span>

      <div class="flex-1 truncate px-2 py-2 text-sm min-w-0">
        <div
          class="font-medium text-gray-900 hover:text-gray-600 break-words whitespace-normal"
        >
          {{ course.name }}
        </div>
        <p class="text-gray-500">{{ course.members }} Members</p>
      </div>
    </a>

    <Menu as="div" class="relative ml-2 flex-shrink-0 menu-area">
      <MenuButton
        class="relative block text-gray-400 hover:text-gray-500 p-1 rounded-md hover:bg-gray-100"
        v-tooltip.right="{
          content: 'More options',
          theme: 'simple-tooltip',
        }"
      >
        <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
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
          class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
        >
          <MenuItem v-slot="{ active }">
            <a
              :href="course.href"
              :class="[
                active ? 'bg-gray-50 outline-none' : '',
                'block px-3 py-1 text-sm leading-6 text-gray-900',
              ]"
            >
              View
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active ? 'bg-gray-50 outline-none' : '',
                'block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900',
              ]"
            >
              Sign out
            </button>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
