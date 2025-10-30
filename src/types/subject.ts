export type SubjectType = 'core' | 'elective' | 'optional';

export interface Subject {
  id: number;
  institute_id: number;
  name: string;
  code: string | null;
  description: string | null;
  type: SubjectType;
  credit_hours: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateSubjectInput {
  name: string;
  code?: string;
  description?: string;
  type: SubjectType;
  credit_hours: number;
}

export interface UpdateSubjectInput {
  name?: string;
  code?: string;
  description?: string;
  type?: SubjectType;
  credit_hours?: number;
}

export interface SubjectFilters {
  search?: string;
  type?: SubjectType | '';
  sort_by?: 'name' | 'code' | 'type' | 'credit_hours' | 'created_at';
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
