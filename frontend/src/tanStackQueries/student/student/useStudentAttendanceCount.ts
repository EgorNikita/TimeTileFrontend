import { useQuery } from "@tanstack/vue-query";
import {
  studentApi,
  StudentAttendanceCountFilters,
} from "@/services/studentApi";

export function useStudentAttendanceCount(
  studentId: number | string,
  filters: StudentAttendanceCountFilters = {},
) {
  return useQuery({
    queryKey: ["studentAttendanceCount", studentId, filters] as const,

    queryFn: async () => {
      return studentApi.fetchStudentAttendanceCount(studentId, filters);
    },

    staleTime: 1000 * 60 * 5,
  });
}
