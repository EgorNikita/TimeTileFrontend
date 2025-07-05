// import { io } from "socket.io-client";
// import { useStudentCourseStore } from "@/store/modules/student/studentCoursesStore";
// import { CourseDto } from "@/types/course";
//
// export const socket = io("ws://your-server-url");
//
// export function initCourseSocketHandlers() {
//   const store = useStudentCourseStore();
//
//   socket.on("course_updated", (course: CourseDto) => {
//     try {
//       store.updateCourse(course);
//     } catch (error) {
//       console.error("Failed to handle course update:", error);
//     }
//   });
//
//   socket.on("course_deleted", (courseId: number) => {
//     try {
//       store.removeCourse(courseId);
//     } catch (error) {
//       console.error("Failed to handle course deletion:", error);
//     }
//   });
//
//   socket.on("connect_error", (error) => {
//     console.error("Socket connection error:", error);
//   });
// }
//
// // Cleanup function
// export function cleanupCourseSocketHandlers() {
//   socket.off("course_updated");
//   socket.off("course_deleted");
//   socket.off("connect_error");
// }
