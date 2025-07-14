import {StudentAttendanceCountFilters} from "@/types/studentLessonsInfo";
import {useQuery} from "@tanstack/vue-query";
import {fetchStudentAttendanceCount} from "@/services/studentService";

export function useStudentAttendanceCount(
    studentId: number | string,
    filters: StudentAttendanceCountFilters = {}
) {
    return useQuery({
        queryKey: ["studentAttendanceCount", studentId, filters] as const,

        queryFn: async () => {
            return fetchStudentAttendanceCount(studentId, filters);
        },

        staleTime: 1000 * 60 * 5,
    });
}