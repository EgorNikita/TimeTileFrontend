import { ROLES } from '@/constants.js';

export const studentRoutes = [
    {
        path: '/:institutionDomain/Student',
        component: () => import('@/layouts/StudentLayout.vue'),
        meta: { role: ROLES.STUDENT },
        children: [
            {
                path: '',
                name: 'StudentHome',
                component: () => import('@/views/student/StudentHome.vue'),
            },
            {
                path: 'timetable',
                name: 'StudentTimetable',
                component: () => import('@/views/student/StudentCourses.vue'),
            },
            {
                path: 'assignments',
                name: 'StudentAssignments',
                component: () => import('@/views/student/StudentCourses.vue'),
            },
            {
                path: 'courses',
                name: 'StudentCourses',
                component: () => import('@/views/student/StudentCourses.vue'),
            },
            {
                path: 'grades',
                name: 'StudentGrades',
                component: () => import('@/views/student/StudentCourses.vue'),
            },

        ],
    },
];