export type ProgramLevel = "School" | "Madrasha" | "College" | "University";

export interface Program {
  id: number;
  title: string;
  code: string;
  level: ProgramLevel;
  duration_year: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  credit: number;
}

export interface CurriculumMapEntry {
  id: number;
  name: string;
  code: string;
  credit: number;
  programId: number;
  subjectId: number;
  year_no: number;
  term_no: number;
  mandatory: boolean;
  prerequisite_subject_id?: number;
}

export interface CurriculumMap {
  program_id: number;
  entries: CurriculumMapEntry[];
}

export interface ProgramWithSubjects extends Program {
  subjects: Subject[];
}

export interface CreateSubjectInput {
  code: string;
  name: string;
  credit: number;
}

export interface UpdateSubjectInput {
  code?: string;
  name?: string;
  credit?: number;
}

export interface CreateCurriculumEntryInput {
  subjectId: string;
  year: number;
  term: number;
  mandatory: boolean;
}

export interface UpdateCurriculumEntryInput {
  year_no?: number;
  term_no?: number;
  mandatory?: boolean;
  prerequisite_subject_id?: number;
} 