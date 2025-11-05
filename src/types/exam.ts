export type ExamStatus = "draft" | "scheduled" | "ongoing" | "completed" | "cancelled";
export type ExamTerm = "first" | "second" | "third" | "final" | "other";

export interface Exam {
  id: number;
  academic_year_id: number;
  name: string;
  code?: string;
  term: ExamTerm;
  start_date: string;
  end_date: string;
  status: ExamStatus;
  results_published: boolean;
  results_published_at?: string;
  created_at: string;
  updated_at: string;
  academic_year?: AcademicYear;
  exam_subjects?: ExamSubject[];
}

export interface AcademicYear {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface ExamSubject {
  id: number;
  exam_id: number;
  class_id: number;
  subject_id: number;
  max_marks: number;
  pass_marks: number;
  exam_date?: string;
  exam_time?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
  subject?: Subject;
  school_class?: SchoolClass;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
}

export interface SchoolClass {
  id: number;
  name: string;
  section?: string;
}

export interface Mark {
  id: number;
  exam_id: number;
  student_id: number;
  subject_id: number;
  marks_obtained?: number;
  max_marks: number;
  grade?: string;
  grade_point?: number;
  is_absent: boolean;
  remarks?: string;
  entered_by: number;
  entered_at: string;
  created_at: string;
  updated_at: string;
  student?: Student;
  subject?: Subject;
  exam?: Exam;
}

export interface Student {
  id: number;
  user_id: number;
  roll_number?: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface GradeScale {
  id: number;
  name: string;
  grade: string;
  min_percentage: number;
  max_percentage: number;
  grade_point?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExamInput {
  name: string;
  code?: string;
  term: ExamTerm;
  exam_type: string;
  academic_year_id: number;
  start_date: string;
  end_date: string;
  status?: ExamStatus;
}

export type UpdateExamInput = Partial<CreateExamInput>;

export interface CreateExamSubjectInput {
  class_id: number;
  subject_id: number;
  max_marks: number;
  pass_marks: number;
  exam_date?: string;
  exam_time?: string;
  duration?: number;
}

export interface ScheduleClassForExamSubject {
  subject_id: number;
  max_marks?: number;
  pass_marks?: number;
  exam_date?: string;
  exam_time?: string;
  duration?: number;
}

export interface ScheduleClassForExam {
  class_id: number;
  subjects: ScheduleClassForExamSubject[];
}

export interface ScheduleClassesInput {
  max_marks: number;
  pass_marks: number;
  duration: number;
  exam_date?: string;
  exam_time?: string;
  classes: ScheduleClassForExam[];
}

export interface CreateMarkInput {
  student_id: number;
  exam_id: number;
  subject_id: number;
  marks_obtained?: number;
  max_marks: number;
  is_absent?: boolean;
  remarks?: string;
}

export interface BulkCreateMarksInput {
  exam_id: number;
  subject_id: number;
  max_marks: number;
  marks: Array<{
    student_id: number;
    marks_obtained?: number;
    is_absent?: boolean;
    remarks?: string;
  }>;
}

export interface CreateGradeScaleInput {
  name: string;
  grade: string;
  min_percentage: number;
  max_percentage: number;
  grade_point?: number;
  description?: string;
}

// Exam Room Types
export type ExamRoomStatus = "active" | "inactive" | "maintenance";

export interface ExamRoom {
  id: number;
  name: string;
  code?: string;
  capacity: number;
  building?: string;
  floor?: string;
  facilities?: string[];
  status: ExamRoomStatus;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExamRoomInput {
  name: string;
  code?: string;
  capacity: number;
  building?: string;
  floor?: string;
  facilities?: string[];
  status?: ExamRoomStatus;
  remarks?: string;
}

export type UpdateExamRoomInput = Partial<CreateExamRoomInput>;

// Exam Participant Types
export type ParticipantStatus = "registered" | "absent" | "disqualified" | "expelled";

export interface ExamParticipant {
  id: number;
  exam_id: number;
  student_id: number;
  class_id: number;
  roll_number: string;
  status: ParticipantStatus;
  admit_card_generated: boolean;
  admit_card_generated_at?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  student?: Student;
  exam?: Exam;
  school_class?: SchoolClass;
  seat_allocations?: SeatAllocation[];
  admit_card?: AdmitCard;
}

export interface CreateParticipantInput {
  exam_id: number;
  student_id: number;
  class_id: number;
  roll_number?: string;
  status?: ParticipantStatus;
  remarks?: string;
}

export interface BulkCreateParticipantsInput {
  exam_id: number;
  class_id: number;
  student_ids: number[];
}

// Seat Allocation Types
export interface SeatAllocation {
  id: number;
  exam_id: number;
  participant_id: number;
  room_id: number;
  exam_subject_id?: number;
  seat_number: string;
  row_number?: string;
  column_number?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  participant?: ExamParticipant;
  room?: ExamRoom;
  exam_subject?: ExamSubject;
}

export interface AllocateSeatsInput {
  exam_id: number;
  exam_subject_id?: number;
}

export interface AllocateByRoomInput {
  exam_id: number;
  room_id: number;
  participant_ids: number[];
}

export interface SeatPlan {
  room: ExamRoom;
  seats: Array<{
    allocation_id: number;
    seat_number: string;
    row: string;
    column: string;
    participant: {
      id: number;
      roll_number: string;
      student_name: string;
    };
  }>;
}

// Admit Card Types
export interface AdmitCard {
  id: number;
  participant_id: number;
  template_id?: number;
  barcode?: string;
  qr_code?: string;
  custom_fields?: Record<string, any>;
  file_path?: string;
  generated_at?: string;
  generated_by?: number;
  created_at: string;
  updated_at: string;
  participant?: ExamParticipant;
}

export interface GenerateAdmitCardInput {
  participant_id: number;
  template_id?: number;
}

export interface BulkGenerateAdmitCardsInput {
  exam_id: number;
  template_id?: number;
}

export interface AdmitCardData {
  exam: {
    name: string;
    code?: string;
    academic_year: string;
    start_date: string;
    end_date: string;
  };
  student: {
    name: string;
    roll_number: string;
    class: string;
    photo?: string;
  };
  admit_card: {
    barcode?: string;
    qr_code?: string;
    generated_at?: string;
  };
  subjects: Array<{
    name: string;
    date: string;
    time: string;
    duration: string;
    room: string;
    max_marks: number;
  }>;
  seat_allocations: Array<{
    room: string;
    seat_number: string;
    row?: string;
    column?: string;
  }>;
}

// Exam Ranking Types
export type RankType = "overall" | "class" | "section" | "subject";
export type ResultType = "pass" | "fail" | "promoted" | "detained";

export interface ExamRanking {
  id: number;
  exam_id: number;
  student_id: number;
  class_id?: number;
  rank: number;
  rank_type: RankType;
  subject_id?: number;
  total_marks: number;
  max_marks: number;
  percentage: number;
  grade_point?: number;
  grade?: string;
  result: ResultType;
  created_at: string;
  updated_at: string;
  student?: Student;
  school_class?: SchoolClass;
  subject?: Subject;
}

export interface GenerateRankingsInput {
  exam_id: number;
  rank_type: RankType;
}

export interface MeritListFilters {
  rank_type?: RankType;
  class_id?: number;
  subject_id?: number;
  result?: ResultType;
  top_n?: number;
}

// Exam Invigilator Types
export type InvigilatorRole = "chief" | "assistant" | "relief";

export interface ExamInvigilator {
  id: number;
  exam_subject_id: number;
  teacher_id: number;
  room_id?: number;
  role: InvigilatorRole;
  remarks?: string;
  created_at: string;
  updated_at: string;
  exam_subject?: ExamSubject;
  teacher?: Teacher;
  room?: ExamRoom;
}

export interface Teacher {
  id: number;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateInvigilatorInput {
  exam_subject_id: number;
  teacher_id: number;
  room_id?: number;
  role: InvigilatorRole;
  remarks?: string;
}

// Mark History Types
export type ChangeType = "create" | "update" | "delete" | "verify";

export interface MarkHistory {
  id: number;
  mark_id: number;
  old_marks?: number;
  new_marks?: number;
  old_grade?: string;
  new_grade?: string;
  reason?: string;
  change_type: ChangeType;
  changed_by: number;
  changed_at: string;
  mark?: Mark;
  changed_by_user?: {
    id: number;
    name: string;
  };
}

// Statistics Types
export interface ParticipantStats {
  total: number;
  registered: number;
  absent: number;
  with_admit_card: number;
}

export interface RoomAvailability {
  id: number;
  name: string;
  code?: string;
  capacity: number;
  available_capacity: number;
  building?: string;
  floor?: string;
} 