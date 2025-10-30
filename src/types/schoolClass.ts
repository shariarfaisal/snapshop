export interface SchoolClass {
  id: number;
  name: string;
  description?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  sections?: Section[];
  students?: Student[];
}

export interface Section {
  id: number;
  schoolClassId: number;
  name: string;
  maxCapacity: number;
  status: boolean;
}

export interface Student {
  id: number;
  userId: number;
  schoolClassId: number;
  rollNumber: string;
  status: string;
}

export interface SchoolClassStats {
  totalSections: number;
  totalStudents: number;
  activeSections: number;
  activeStudents: number;
}

export interface CreateSchoolClassInput {
  name: string;
  description?: string;
  status?: boolean;
}

export interface UpdateSchoolClassInput {
  name?: string;
  description?: string;
  status?: boolean;
}

export interface SchoolClassFilters {
  search?: string;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
}

export interface SchoolClassResponse {
  success: boolean;
  message: string;
  data: SchoolClass;
}

export interface SchoolClassesResponse {
  success: boolean;
  message: string;
  data: SchoolClass[];
  pagination: Pagination;
}

export interface SchoolClassStatsResponse {
  success: boolean;
  message: string;
  data: SchoolClassStats;
}

export interface BulkUpdateStatusInput {
  ids: number[];
  status: boolean;
}

export interface Pagination {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
}
