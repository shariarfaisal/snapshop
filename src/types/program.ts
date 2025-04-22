export type ProgramLevel = "School" | "Madrasha" | "College" | "University";

export interface Program {
  id: string;
  title: string;
  code: string;
  level: ProgramLevel;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  creditHours: number;
  year: number;
  term: number;
  mandatory: boolean;
  programId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramWithSubjects extends Program {
  subjects: Subject[];
} 