import { api } from "@/lib/api-client";
import {
  AttendanceRecord,
  AttendanceFilters,
  AttendanceStatistics,
  MarkAttendanceRequest,
  BulkAttendanceRequest,
  AttendanceListResponse,
  AttendanceExportData,
} from "@/types/attendance";

export const attendanceService = {
  /**
   * Get all attendance records with filters and pagination
   */
  getAll: async (
    filters?: AttendanceFilters,
    page = 1
  ): Promise<AttendanceListResponse> => {
    const params = {
      ...filters,
      page,
      per_page: filters?.per_page || 15,
    };

    // Remove 'all' values
    if (params.class_id === 'all') delete params.class_id;
    if (params.section_id === 'all') delete params.section_id;
    if (params.status === 'all') delete params.status;

    return api.get<AttendanceListResponse>("/attendance", { params });
  },

  /**
   * Mark attendance for a single student
   */
  mark: async (data: MarkAttendanceRequest): Promise<AttendanceRecord> => {
    return api.post<AttendanceRecord>("/attendance/mark", data);
  },

  /**
   * Mark attendance for multiple students (bulk)
   */
  bulk: async (data: BulkAttendanceRequest): Promise<AttendanceRecord[]> => {
    return api.post<AttendanceRecord[]>("/attendance/bulk", data);
  },

  /**
   * Get attendance for a specific student
   */
  getStudentAttendance: async (
    studentId: number,
    filters?: Partial<AttendanceFilters>
  ): Promise<AttendanceRecord[]> => {
    return api.get<AttendanceRecord[]>(`/attendance/student/${studentId}`, {
      params: filters,
    });
  },

  /**
   * Get attendance for a specific class on a specific date
   */
  getClassAttendanceByDate: async (
    classId: number,
    date: string
  ): Promise<AttendanceRecord[]> => {
    return api.get<AttendanceRecord[]>(`/attendance/class/${classId}/date`, {
      params: { date },
    });
  },

  /**
   * Get attendance statistics
   */
  getStatistics: async (
    filters?: Partial<AttendanceFilters>
  ): Promise<AttendanceStatistics> => {
    const params = { ...filters };

    // Remove 'all' values
    if (params.class_id === 'all') delete params.class_id;
    if (params.section_id === 'all') delete params.section_id;
    if (params.status === 'all') delete params.status;

    return api.get<AttendanceStatistics>("/attendance/statistics", {
      params,
    });
  },

  /**
   * Update an existing attendance record
   */
  update: async (
    id: number,
    data: Partial<MarkAttendanceRequest>
  ): Promise<AttendanceRecord> => {
    return api.put<AttendanceRecord>(`/attendance/${id}`, data);
  },

  /**
   * Export attendance records to CSV
   */
  export: async (filters?: Partial<AttendanceFilters>): Promise<AttendanceExportData[]> => {
    const params = { ...filters };

    // Remove 'all' values
    if (params.class_id === 'all') delete params.class_id;
    if (params.section_id === 'all') delete params.section_id;
    if (params.status === 'all') delete params.status;

    return api.get<AttendanceExportData[]>("/attendance/export", { params });
  },
};
