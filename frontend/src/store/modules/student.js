import { defineStore } from "pinia";
import { success, failure } from "@/utils/resultPattern.js";
import { fetchStudentById } from "@/services/studentService.js";

const initialStudent = () => ({
  id: null,
  firstname: null,
  lastname: null,
  login: null,
  homeAddress: null,
  phoneNumber: null,
  birthDate: null,
  avatarUrl: null,
  permissions: [],
  group: null,
});

export const useStudentStore = defineStore("student", {
  state: () => ({
    student: initialStudent(),
    loading: false,
    error: null,
  }),

  getters: {
    isLoaded: (state) => !!state.student?.id,
    fullName: (state) =>
      state.student.firstname && state.student.lastname
        ? `${state.student.firstname} ${state.student.lastname}`
        : "",
    avatarUrl: (state) => {
      const guid = state.student?.avatarUrl; // this is just a GUID
      if (!guid || guid.includes("undefined")) return null;
      return `http://localhost:5282/files/${guid}`;
    },
  },

  actions: {
    async fetchStudentById(studentId) {
      this.loading = true;
      this.error = null;

      const response = await fetchStudentById(studentId);
      console.log("Student fetch response:", response);

      if (response.isFailure) {
        this.student = initialStudent();
        this.error = response.error;
        this.loading = false;
        return failure(this.error);
      }

      this.student = response.data;
      this.loading = false;
      return success(response.data);
    },

    clearStudent() {
      this.student = initialStudent();
      this.error = null;
      this.loading = false;
    },
  },
});
