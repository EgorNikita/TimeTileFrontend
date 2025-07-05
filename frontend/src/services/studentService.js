import { createApi } from '@/utils/apiClient.js'
const api = createApi()

export async function fetchStudentById(id) {
    return await api.get(`/students/${id}`)
}