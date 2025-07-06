// constants.ts
export const TOKEN_KEY = "auth_token" as const;
export const REFRESH_TOKEN_KEY = "refresh_token" as const;
export const API_BASE_URL = "http://localhost:5282" as const;

// User roles - matching your backend GeneralRoles
export const ROLES = {
  STUDENT: "Student",
  INSTITUTION_MEMBER: "InstitutionMember",
  ADMIN: "Admin",
} as const;

// Custom claim types - matching your backend CustomClaimTypes
export const CUSTOM_CLAIM_TYPES = {
  INSTITUTION_ID: "custom:institution_id",
  INSTITUTION_DOMAIN: "custom:institution_domain",
  PERMISSION: "custom:permission",
} as const;

// Standard .NET claim types
export const STANDARD_CLAIM_TYPES = {
  ROLE: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  EMAIL: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
} as const;

// Route names - ensure these match your actual route definitions
export const ROUTE_NAMES = {
  // Public routes
  LOGIN: "Login",
  UNAUTHORIZED: "Unauthorized",
  NOT_FOUND: "NotFound",

  // Student routes
  STUDENT_HOME: "StudentHome",
  STUDENT_COURSES: "StudentCourses",
  STUDENT_SCHEDULE: "StudentSchedule",
  STUDENT_GRADES: "StudentGrades",

  // Institution Member routes (Teachers, Staff, etc.)
  INSTITUTION_MEMBER_HOME: "InstitutionMemberHome",
  TEACHER_HOME: "TeacherHome",
  TEACHER_COURSES: "TeacherCourses",
  TEACHER_SCHEDULE: "TeacherSchedule",
  TEACHER_STUDENTS: "TeacherStudents",

  // Admin routes (if needed)
  ADMIN_HOME: "AdminHome",
  ADMIN_USERS: "AdminUsers",
  ADMIN_INSTITUTIONS: "AdminInstitutions",
} as const;

// Permissions
export const PERMISSIONS = {
  // Student permissions
  VIEW_COURSES: "view_courses",
  VIEW_GRADES: "view_grades",
  VIEW_SCHEDULE: "view_schedule",
  SUBMIT_ASSIGNMENTS: "submit_assignments",

  // Teacher permissions
  MANAGE_COURSES: "manage_courses",
  GRADE_ASSIGNMENTS: "grade_assignments",
  VIEW_ALL_STUDENTS: "view_all_students",
  MANAGE_SCHEDULE: "manage_schedule",

  // Admin permissions
  MANAGE_USERS: "manage_users",
  MANAGE_INSTITUTIONS: "manage_institutions",
  VIEW_REPORTS: "view_reports",
  SYSTEM_CONFIG: "system_config",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },

  // Institution management
  INSTITUTIONS: "/institutions",
  INSTITUTION_MEMBERS: "/institution-members",

  // User management
  USERS: "/users",
  ROLES: "/roles",

  // Academic structure
  COURSES: "/courses",
  SUBJECTS: {
    BASIC: "/subjects",
    BY_IDS: "/subjects/bulk",
  },
  GROUPS: "/groups",
  TERMS: "/terms",

  // People
  STUDENTS: "/students",
  TEACHERS: "/teachers",

  // Scheduling and classroom management
  SCHEDULES: "/schedules",
  LESSONS: "/lessons",
  CLASSROOMS: "/classrooms",
  CLASSROOM_TYPES: "/classroom-types",
  TIMETABLE_UNITS: "/timetable-units",

  // Academic records
  GRADES: "/grades",
  LESSON_STATUSES: "/lesson-statuses",

  // File management
  FILES: "/files",
} as const;

// Application settings
export const APP_CONFIG = {
  NAME: "TimeTile",
  VERSION: "1.0.0",

  // Session settings
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh token 5 minutes before expiry

  // UI settings
  ITEMS_PER_PAGE: 20,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes

  // Validation rules
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: "Invalid username or password",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  ACCESS_DENIED: "You do not have permission to access this resource",
} as const;

// Type definitions for better type safety
export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];
export type CustomClaimType =
  (typeof CUSTOM_CLAIM_TYPES)[keyof typeof CUSTOM_CLAIM_TYPES];
export type StandardClaimType =
  (typeof STANDARD_CLAIM_TYPES)[keyof typeof STANDARD_CLAIM_TYPES];
