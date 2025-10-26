import { api } from "@/lib/api-client";

export interface DashboardStatistics {
  total_students: number;
  total_teachers: number;
  total_classes: number;
  total_sections: number;
  total_subjects: number;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  leave: number;
}

export interface AdminDashboardData {
  statistics: DashboardStatistics;
  attendance: AttendanceStats;
}

export interface TeacherClassInfo {
  id: number;
  name: string;
  section: string;
}

export interface Timetable {
  id: number;
  schoolClass: string;
  section: string;
  subject: string;
  startTime: string;
  endTime: string;
}

export interface TeacherDashboardData {
  classes: TeacherClassInfo[];
  today_timetable: Timetable[];
  pending_tasks: any[];
}

export interface StudentAttendance {
  present: number;
  absent: number;
  leave: number;
  percentage: number;
}

export interface StudentFeeStatus {
  total_due: number;
  paid: number;
  pending: number;
}

export interface StudentDashboardData {
  attendance: StudentAttendance;
  marks: any[];
  fee_status: StudentFeeStatus;
  timetable: Timetable[];
}

export const dashboardService = {
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    return api.get<AdminDashboardData>("/api/dashboard/admin");
  },

  getTeacherDashboard: async (): Promise<TeacherDashboardData> => {
    return api.get<TeacherDashboardData>("/api/dashboard/teacher");
  },

  getStudentDashboard: async (): Promise<StudentDashboardData> => {
    return api.get<StudentDashboardData>("/api/dashboard/student");
  },
};
