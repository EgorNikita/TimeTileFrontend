import {
  HomeIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  VariableIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/outline";

export default [
  {
    label: "Home",
    name: "StudentHome",
    icon: HomeIcon,
  },
  {
    label: "Timetable",
    name: "StudentTimetable",
    icon: CalendarDaysIcon,
  },
  {
    label: "Assignments",
    name: "StudentAssignments",
    icon: ClipboardDocumentListIcon,
  },
  // {
  //   label: "Courses",
  //   name: "StudentCourses",
  //   icon: UserGroupIcon,
  // },
  {
    label: "Grades",
    name: "StudentGrades",
    icon: VariableIcon,
  },
];
