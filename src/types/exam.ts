export type ExamStatus = "draft" | "scheduled" | "ongoing" | "completed" | "cancelled";
export type ExamTerm = "first" | "second" | "third" | "final" | "other";

export interface Exam {
  id: number;
  institute_id: number;
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
  institute_id: number;
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
  institute_id: number;
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