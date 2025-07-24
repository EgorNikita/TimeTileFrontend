import { ROLES, ROUTE_NAMES } from "@/constants.ts";

export const studentRoutes = [
  {
    path: "/:institutionDomain/Student",
    component: () => import("@/layouts/StudentLayout.vue"),
    meta: { role: ROLES.STUDENT },
    children: [
      {
        path: "",
        name: ROUTE_NAMES.STUDENT_HOME,
        component: () => import("@/views/student/StudentHome.vue"),
      },
      {
        path: "timetable",
        name: ROUTE_NAMES.STUDENT_TIMETABLE,
        component: () => import("@/views/student/TimetableView.vue"),
      },
      {
        path: "assignments",
        name: ROUTE_NAMES.STUDENT_ASSIGNMENTS,
        component: () => import("@/views/student/StudentAssignments.vue"),
      },
      // {
      //   path: "courses",
      //   name: "StudentCourses",
      //   component: () => import("@/views/student/StudentCourses.vue"),
      // },
      {
        path: "grades",
        name: ROUTE_NAMES.STUDENT_GRADES,
        component: () => import("@/views/student/GradesView.vue"),
      },
      {
        path: "course/:courseId/chat",
        name: ROUTE_NAMES.STUDENT_COURSE_CHAT,
        component: () => import("@/views/student/CourseChatView.vue")
      }
    ],
  },
];
