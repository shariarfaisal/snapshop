export type SubjectType = 'core' | 'elective' | 'optional';

export interface Subject {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  type: SubjectType;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ClassSubject {
  id: number;
  class_id: number;
  subject_id: number;
  subject_name: string;
  subject_code: string;
  subject_type: SubjectType;
  subject_description: string | null;
  teacher_id: number | null;
  teacher_name: string | null;
  credit_hours: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectInput {
  name: string;
  code?: string;
  description?: string;
  type: SubjectType;
}

export interface UpdateSubjectInput {
  name?: string;
  code?: string;
  description?: string;
  type?: SubjectType;
}

export interface CreateClassSubjectInput {
  subject_id: number;
  teacher_id?: number;
  credit_hours: number;
}

export interface CreateClassSubjectDirectInput {
  name: string;
  code?: string;
  description?: string;
  type: SubjectType;
  teacher_id?: number;
  credit_hours: number;
}

export interface UpdateClassSubjectInput {
  teacher_id?: number;
  credit_hours: number;
}

export interface SubjectFilters {
  search?: string;
  type?: SubjectType | '';
  sort_by?: 'name' | 'code' | 'type' | 'created_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number | 'all';
}

export interface SubjectStatistics {
  total: number;
  core: number;
  elective: number;
  optional: number;
}
