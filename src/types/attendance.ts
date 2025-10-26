export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Student {
  id: string;
  name: string;
  rollNo: number;
}

export interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  remark?: string;
}

export interface AttendanceRecord {
  date: string;
  classId: string;
  sectionId: string;
  entries: AttendanceEntry[];
}
