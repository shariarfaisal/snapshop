export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface Timetable {
  id: number;
  institute_id: number;
  academic_year_id: number;
  class_id: number;
  section_id: number;
  subject_id: number;
  teacher_id: number;
  day_of_week: DayOfWeek;
  period_number: number;
  start_time: string; // "HH:MM" format
  end_time: string; // "HH:MM" format
  room_number?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;

  // Relationships (when loaded)
  schoolClass?: {
    id: number;
    name: string;
    description?: string;
  };
  section?: {
    id: number;
    name: string;
    schoolClassId: number;
  };
  subject?: {
    id: number;
    name: string;
    code?: string;
  };
  teacher?: {
    id: number;
    user?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  academicYear?: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
  };
}

export interface CreateTimetableInput {
  class_id: number;
  section_id: number;
  subject_id: number;
  teacher_id: number;
  academic_year_id: number;
  day_of_week: DayOfWeek;
  period_number: number;
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  room_number?: string;
}

export interface UpdateTimetableInput {
  class_id?: number;
  section_id?: number;
  subject_id?: number;
  teacher_id?: number;
  academic_year_id?: number;
  day_of_week?: DayOfWeek;
  period_number?: number;
  start_time?: string;
  end_time?: string;
  room_number?: string;
}

export interface TimetableFilters {
  class_id?: number;
  section_id?: number;
  teacher_id?: number;
  subject_id?: number;
  academic_year_id?: number;
  day_of_week?: DayOfWeek;
  room_number?: string;
  page?: number;
  per_page?: number | 'all';
}

export interface TimetableConflict {
  has_conflicts: boolean;
  conflicts: string[];
}

export interface TimetableStatistics {
  total: number;
  by_day: Record<DayOfWeek, number>;
  total_teachers: number;
  total_classes: number;
}

// For grid display
export interface TimetableSlot {
  id?: number;
  day: DayOfWeek;
  period_number: number;
  start_time: string;
  end_time: string;
  subject?: {
    id: number;
    name: string;
    code?: string;
  };
  teacher?: {
    id: number;
    name: string;
  };
  room_number?: string;
}

export interface ClassTimetable {
  class_id: number;
  section_id: number;
  academic_year_id?: number;
  slots: Record<DayOfWeek, TimetableSlot[]>;
}

export interface BulkTimetableEntry {
  class_id: number;
  section_id: number;
  subject_id: number;
  teacher_id: number;
  academic_year_id: number;
  day_of_week: DayOfWeek;
  period_number: number;
  start_time: string;
  end_time: string;
  room_number?: string;
}

export interface BulkCreateResponse {
  created: number;
  failed: number;
  entries: Timetable[];
  errors: Array<{
    index: number;
    data: BulkTimetableEntry;
    error: string;
  }>;
}

// Helper constants
export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
};
