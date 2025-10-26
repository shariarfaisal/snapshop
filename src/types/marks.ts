export interface Exam {
  id: string;
  name: string; // e.g., "Midterm Exam"
  classId: string;
  subject: string;
}

export interface MarkEntry {
  studentId: string;
  studentName: string;
  score: number | null;
}

export interface MarksSubmission {
  examId: string;
  marks: Omit<MarkEntry, 'studentName'>[];
}

export interface StudentResult {
  subject: string;
  score: number;
  grade: string;
  totalMarks: number;
}
