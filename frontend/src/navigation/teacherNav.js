export default [
    {
        label: 'Home',
        name: 'TeacherHome',
        icon: 'mdi-home',
    },
    {
        label: 'Grades',
        name: 'TeacherGrades',
        icon: 'mdi-table',
        permissions: ['view_grades'],
    },
    {
        label: 'Edit Grades',
        name: 'TeacherGradesEdit',
        icon: 'mdi-pencil',
        permissions: ['edit_grades'],
    },
    {
        label: 'Settings',
        name: 'TeacherSettings',
        icon: 'mdi-cog',
        permissions: ['manage_settings'], // optional
    },
];