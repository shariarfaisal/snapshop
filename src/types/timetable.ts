export interface Period {
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "10:00"
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TimetableSlot {
  day: DayOfWeek;
  period: Period;
  subjectId: string;
  teacherId: string;
  roomId?: string;
}

export interface ClassTimetable {
  classId: string;
  sectionId: string;
  slots: TimetableSlot[];
}
