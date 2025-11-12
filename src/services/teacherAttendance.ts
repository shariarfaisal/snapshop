import { api } from "@/lib/api-client";

export interface AttendanceRecord {
  id: number;
  date: string;
  studentId?: number;
  student?: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  classId?: number;
  schoolClass?: {
    id: number;
    name: string;
  };
  sectionId?: number;
  section?: {
    id: number;
    name: string;
  };
  status: "present" | "absent" | "late" | "sick_leave" | "other_leave";
  period?: number;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceFilters {
  classId?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
  per_page?: number;
  page?: number;
}

export interface AttendanceListResponse {
  success: boolean;
  data: AttendanceRecord[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  total?: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

export const teacherAttendanceService = {
  // Get attendance records for teacher's classes
  async getAttendance(filters?: AttendanceFilters): Promise<AttendanceListResponse> {
    const params = new URLSearchParams();
    if (filters?.classId) params.append("class_id", filters.classId.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.from_date) params.append("from_date", filters.from_date);
    if (filters?.to_date) params.append("to_date", filters.to_date);
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());
    if (filters?.page) params.append("page", filters.page.toString());

    const url = params.toString() ? `/attendance?${params.toString()}` : "/attendance";
    const response = await api.get<AttendanceListResponse>(url);
    return response;
  },

  // Mark attendance
  async markAttendance(data: {
    class_id: number;
    section_id?: number;
    date: string;
    records: Array<{
      student_id: number;
      status: string;
      remarks?: string;
    }>;
  }): Promise<any> {
    return api.post("/attendance/mark", data);
  },

  // Update attendance record
  async updateAttendance(id: number, data: any): Promise<AttendanceRecord> {
    return api.put(`/attendance/${id}`, data);
  },

  // Delete attendance record
  async deleteAttendance(id: number): Promise<void> {
    return api.delete(`/attendance/${id}`);
  },
};
