import { createApi } from '@/utils/apiClient.js'
const api = createApi()

export async function fetchCoursesByStudentId(studentId) {
    return await api.get(`/students/${studentId}/courses`)
}