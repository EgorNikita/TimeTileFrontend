export const TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const API_BASE_URL = "http://localhost:5282";

// User roles - matching your backend GeneralRoles
export const ROLES = {
  STUDENT: "Student",
  INSTITUTION_MEMBER: "InstitutionMember", // This covers teachers and other staff
  ADMIN: "Admin",
};

// Custom claim types - matching your backend CustomClaimTypes
export const CUSTOM_CLAIM_TYPES = {
  INSTITUTION_ID: "custom:institution_id",
  INSTITUTION_DOMAIN: "custom:institution_domain",
  PERMISSION: "custom:permission",
};

// Standard .NET claim types
export const STANDARD_CLAIM_TYPES = {
  ROLE: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  EMAIL: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
};

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
  TEACHER_HOME: "TeacherHome", // Alias for backward compatibility
  TEACHER_COURSES: "TeacherCourses",
  TEACHER_SCHEDULE: "TeacherSchedule",
  TEACHER_STUDENTS: "TeacherStudents",

  // Admin routes (if needed)
  ADMIN_HOME: "AdminHome",
  ADMIN_USERS: "AdminUsers",
  ADMIN_INSTITUTIONS: "AdminInstitutions",
};

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
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  COURSES: "/courses",
  STUDENTS: "/students",
  TEACHERS: "/teachers",
  SCHEDULES: "/schedules",
  GRADES: "/grades",
};

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
};

// Error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: "Invalid username or password",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  ACCESS_DENIED: "You do not have permission to access this resource",
};
