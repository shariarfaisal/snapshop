import { api } from "@/lib/api-client";

export interface TeacherDashboardStats {
  totalClasses: number;
  totalStudents: number;
  todayAttendancePercent: number;
  pendingMarks: number;
}

export interface TodayClass {
  id: number;
  name: string;
  section: string;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface PendingTask {
  id: string;
  title: string;
  type: "attendance" | "marks" | "lesson_plan";
  dueDate?: string;
  classId?: number;
}

export interface TeacherDashboardResponse {
  stats: TeacherDashboardStats;
  todayClasses: TodayClass[];
  pendingTasks: PendingTask[];
}

export const teacherDashboardService = {
  // Get teacher dashboard data
  async getDashboard(): Promise<TeacherDashboardResponse> {
    return api.get<TeacherDashboardResponse>("/dashboard/teacher");
  },
};
