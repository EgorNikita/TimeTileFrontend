<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/20/solid";
import { useAuth } from "@/composables/useAuth";
import { EnrichedStudentCourseInfo } from "@/types/studentCourseInfo";
import { ROUTE_NAMES } from "@/constants";

const props = defineProps<{
  course: EnrichedStudentCourseInfo;
}>();

const { institution } = useAuth();
</script>

<template>
  <RouterLink
    :to="{
      name: ROUTE_NAMES.STUDENT_COURSE_CHAT,
      params: {
        institutionDomain: institution.currentInstitution.value?.domain,
        courseId: course.courseId,
      },
    }"
    class="block"
  >
    <div
      class="relative flex h-full cursor-pointer justify-between items-center border border-gray-200 rounded-lg bg-white shadow-sm px-3 pt-3 pb-4 [&:hover:not(:has(.menu-area:hover))]:bg-gray-50 focus-within:z-[60] hover:z-[60] group isolate"
    >
      <a
        v-tooltip="{
          content: course.course.title,
          theme: 'arrowed-tooltip',
          strategy: 'fixed',
          boundary: 'scrollParent',
          flip: true,
          preventOverflow: true,
        }"
        class="flex-1 flex items-center min-w-0"
      >
        <span class="relative inline-block flex-shrink-0">
          <img
            class="h-18 w-18 rounded-md"
            :src="course.course.iconUrl || 'https://via.placeholder.com/72'"
            alt=""
          />
        </span>

        <div class="flex-1 truncate px-2 py-2 text-sm min-w-0">
          <div
            class="font-medium text-gray-900 hover:text-gray-600 break-words whitespace-normal"
          >
            {{ course.course.title }}
          </div>
          <p class="text-gray-500">{{ course.subjectTitle }}</p>
        </div>
      </a>

      <Menu as="div" class="relative ml-2 flex-shrink-0 menu-area z-[9999]">
        <MenuButton
          class="relative block text-gray-400 hover:text-gray-500 p-1 rounded-md hover:bg-gray-100"
          v-tooltip.right="{
            content: 'More options',
            theme: 'simple-tooltip',
            boundary: 'scrollParent',
            strategy: 'fixed',
            flip: true,
            preventOverflow: true,
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
            class="absolute right-0 z-[9999] mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
          >
            <MenuItem v-slot="{ active }">
              <!--&lt;!&ndash;            <a&ndash;&gt;-->
              <!--&lt;!&ndash;              :href="course.href"&ndash;&gt;-->
              <!--&lt;!&ndash;              :class="[&ndash;&gt;-->
              <!--&lt;!&ndash;                active ? 'bg-gray-50 outline-none' : '',&ndash;&gt;-->
              <!--&lt;!&ndash;                'block px-3 py-1 text-sm leading-6 text-gray-900',&ndash;&gt;-->
              <!--&lt;!&ndash;              ]"&ndash;&gt;-->
              <!--&lt;!&ndash;            >&ndash;&gt;-->
              <!--              View-->
              <!--            </a>-->
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
  </RouterLink>
</template>
