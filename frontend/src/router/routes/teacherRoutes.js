import { ROLES } from '@/constants.js';

export const teacherRoutes = [
    {
        path: '/:institutionDomain/InstitutionMember',
        component: () => import('@/layouts/TeacherLayout.vue'),
        meta: { role: ROLES.INSTITUTION_MEMBER },
        children: [
            {
                path: '',
                name: 'TeacherHome',
                component: () => import('@/views/teacher/TeacherHome.vue'),
            },
            {
                path: 'schedule',
                name: 'TeacherSchedule',
                component: () => import('@/views/teacher/TeacherSchedule.vue'),
            },
            {
                path: 'grades',
                name: 'TeacherGrades',
                component: () => import('@/views/teacher/TeacherGrades.vue'),
                meta: { role: 'teacher', permissions: ['view_grades'] },
            },
        ],
    },
];