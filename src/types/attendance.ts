export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'sick_leave' | 'other_leave';

export interface AttendanceRecord {
  id: number;
  institute_id: number;
  student_id: number;
  class_id: number;
  section_id?: number;
  date: string;
  status: AttendanceStatus;
  period?: number;
  remarks?: string;
  marked_by: number;
  marked_at: string;
  created_at?: string;
  updated_at?: string;
  student?: {
    id: number;
    admissionNumber?: string;
    rollNumber?: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  };
  schoolClass?: {
    id: number;
    name: string;
  };
  section?: {
    id: number;
    name: string;
  };
  markedBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface AttendanceFilters {
  class_id?: number | string;
  section_id?: number | string;
  date?: string;
  from_date?: string;
  to_date?: string;
  student_id?: number | string;
  status?: AttendanceStatus | 'all';
  search?: string;
  per_page?: number;
}

export interface AttendanceStatistics {
  total: number;
  present: number;
  absent: number;
  late: number;
  present_percentage: number;
}

export interface MarkAttendanceRequest {
  student_id: number;
  class_id: number;
  section_id?: number;
  date: string;
  status: AttendanceStatus;
  period?: number;
  remarks?: string;
}

export interface BulkAttendanceRequest {
  class_id: number;
  section_id?: number;
  date: string;
  period?: number;
  students: Array<{
    student_id: number;
    status: AttendanceStatus;
    remarks?: string;
  }>;
}

export interface AttendanceListResponse {
  data: AttendanceRecord[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AttendanceExportData {
  Date: string;
  'Student Name': string;
  'Admission No': string;
  'Roll No': string;
  Class: string;
  Section: string;
  Status: string;
  Period: number;
  Remarks: string;
  'Marked By': string;
  'Marked At': string;
}
