export type ExamStatus = "Draft" | "Scheduled" | "Completed" | "Graded" | "Finalized";

export interface Exam {
  id: string;
  name: string;
  subjectOfferingId: string;
  subjectName: string;
  programId: string;
  programName: string;
  termId: string;
  termName: string;
  examDate: string;
  maxMarks: number;
  weight: number;
  status: ExamStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  marks: number | null;
  status: "Graded" | "Not Graded";
  isFinalized: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamInput {
  name: string;
  subjectOfferingId: string;
  examDate: string;
  maxMarks: number;
  weight: number;
}

export interface UpdateExamInput extends Partial<CreateExamInput> {}

export interface UpdateGradeInput {
  marks: number;
}

export interface GradeModerationInput {
  adjustment: number;
  notes?: string;
} 