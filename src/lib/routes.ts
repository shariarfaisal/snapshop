/**
 * Route paths for the application
 * Centralized route definitions to avoid hardcoding
 */

export const ROUTES = {
  // Auth Routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  LOGOUT: "/logout",

  // Dashboard Routes (Protected)
  DASHBOARD: "/dashboard",

  // Admin Routes
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_USERS_CREATE: "/admin/users/create",
  ADMIN_USERS_EDIT: (id: string) => `/admin/users/${id}/edit`,
  ADMIN_USERS_VIEW: (id: string) => `/admin/users/${id}`,
  
  // Academic Management
  ADMIN_CLASSES: "/admin/classes",
  ADMIN_CLASSES_CREATE: "/admin/classes/create",
  ADMIN_CLASSES_EDIT: (id: string) => `/admin/classes/${id}/edit`,
  ADMIN_SECTIONS: "/admin/sections",
  ADMIN_SECTIONS_CREATE: "/admin/sections/create",
  ADMIN_SECTIONS_EDIT: (id: string) => `/admin/sections/${id}/edit`,
  ADMIN_SUBJECTS: "/admin/subjects",
  ADMIN_SUBJECTS_CREATE: "/admin/subjects/create",
  ADMIN_SUBJECTS_EDIT: (id: string) => `/admin/subjects/${id}/edit`,
  ADMIN_COURSES: "/admin/courses",
  ADMIN_COURSES_CREATE: "/admin/courses/create",
  ADMIN_COURSES_EDIT: (id: string) => `/admin/courses/${id}/edit`,
  ADMIN_PROGRAMS: "/admin/programs",
  ADMIN_PROGRAMS_CREATE: "/admin/programs/create",
  ADMIN_PROGRAMS_EDIT: (id: string) => `/admin/programs/${id}/edit`,
  
  // Timetable
  ADMIN_TIMETABLE: "/admin/timetable",
  ADMIN_TIMETABLE_CREATE: "/admin/timetable/create",
  ADMIN_TIMETABLE_EDIT: (id: string) => `/admin/timetable/${id}/edit`,
  
  // Attendance
  ADMIN_ATTENDANCE: "/admin/attendance",
  ADMIN_ATTENDANCE_REPORT: "/admin/attendance/report",
  
  // Exams & Marks
  ADMIN_EXAMS: "/admin/exams",
  ADMIN_EXAMS_CREATE: "/admin/exams/create",
  ADMIN_EXAMS_EDIT: (id: string) => `/admin/exams/${id}/edit`,
  ADMIN_MARKS: "/admin/marks",
  ADMIN_MARKS_ENTRY: "/admin/marks/entry",
  ADMIN_MARKS_REPORT: "/admin/marks/report",
  
  // Admissions
  ADMIN_ADMISSIONS: "/admin/admissions",
  ADMIN_ADMISSIONS_APPLICATIONS: "/admin/admissions/applications",
  ADMIN_ADMISSIONS_APPLICATION_VIEW: (id: string) => `/admin/admissions/applications/${id}`,
  
  // Finance
  ADMIN_FINANCE: "/admin/finance",
  ADMIN_FEE_STRUCTURES: "/admin/finance/fee-structures",
  ADMIN_FEE_STRUCTURES_CREATE: "/admin/finance/fee-structures/create",
  ADMIN_FEE_STRUCTURES_EDIT: (id: string) => `/admin/finance/fee-structures/${id}/edit`,
  ADMIN_INVOICES: "/admin/finance/invoices",
  ADMIN_INVOICES_CREATE: "/admin/finance/invoices/create",
  ADMIN_INVOICES_VIEW: (id: string) => `/admin/finance/invoices/${id}`,
  ADMIN_PAYMENTS: "/admin/finance/payments",
  ADMIN_PAYMENTS_CREATE: "/admin/finance/payments/create",
  
  // Communication
  ADMIN_COMMUNICATION: "/admin/communication",
  ADMIN_NOTICES: "/admin/communication/notices",
  ADMIN_NOTICES_CREATE: "/admin/communication/notices/create",
  ADMIN_NOTICES_EDIT: (id: string) => `/admin/communication/notices/${id}/edit`,
  ADMIN_MESSAGES: "/admin/communication/messages",
  
  // Reports
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_REPORTS_ATTENDANCE: "/admin/reports/attendance",
  ADMIN_REPORTS_MARKS: "/admin/reports/marks",
  ADMIN_REPORTS_FINANCE: "/admin/reports/finance",
  
  // Settings
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_SETTINGS_GENERAL: "/admin/settings/general",
  ADMIN_SETTINGS_ACADEMIC: "/admin/settings/academic",
  ADMIN_SETTINGS_USERS: "/admin/settings/users",

  // Accountant Routes
  ACCOUNTANT: "/accountant",
  ACCOUNTANT_DASHBOARD: "/accountant",
  ACCOUNTANT_INVOICES: "/accountant/invoices",
  ACCOUNTANT_PAYMENTS: "/accountant/payments",
  ACCOUNTANT_REPORTS: "/accountant/reports",

  // Teacher Routes
  TEACHER: "/teacher",
  TEACHER_DASHBOARD: "/teacher",
  TEACHER_ATTENDANCE: "/teacher/attendance",
  TEACHER_MARKS: "/teacher/marks",
  TEACHER_TIMETABLE: "/teacher/timetable",
  TEACHER_LESSONS: "/teacher/lessons",
  TEACHER_ASSIGNMENTS: "/teacher/assignments",

  // Student Routes
  STUDENT: "/student",
  STUDENT_DASHBOARD: "/student",
  STUDENT_TIMETABLE: "/student/timetable",
  STUDENT_MARKS: "/student/marks",
  STUDENT_ATTENDANCE: "/student/attendance",
  STUDENT_FEES: "/student/fees",
  STUDENT_DOCUMENTS: "/student/documents",
  STUDENT_ID_CARD: "/student/id-card",

  // Parent Routes
  PARENT: "/parent",
  PARENT_DASHBOARD: "/parent",
  PARENT_STUDENTS: "/parent/students",
  PARENT_MARKS: "/parent/marks",
  PARENT_ATTENDANCE: "/parent/attendance",
  PARENT_FEES: "/parent/fees",

  // Profile & Settings
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  SETTINGS: "/settings",

  // Error Pages
  NOT_FOUND: "/404",
  SERVER_ERROR: "/500",
  UNAUTHORIZED: "/401",
} as const;

/**
 * Check if user is on a protected route
 */
export const isProtectedRoute = (pathname: string): boolean => {
  const publicRoutes = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
  ];
  return !publicRoutes.some(route => pathname.startsWith(route));
};

/**
 * Get dashboard route based on role
 */
export const getDashboardRoute = (role: string): string => {
  switch (role.toLowerCase()) {
    case "super_admin":
    case "admin":
      return ROUTES.ADMIN_DASHBOARD;
    case "accountant":
      return ROUTES.ACCOUNTANT_DASHBOARD;
    case "teacher":
      return ROUTES.TEACHER_DASHBOARD;
    case "student":
      return ROUTES.STUDENT_DASHBOARD;
    case "parent":
    case "guardian":
      return ROUTES.PARENT_DASHBOARD;
    default:
      return ROUTES.LOGIN;
  }
};
