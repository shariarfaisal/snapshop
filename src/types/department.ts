export interface Department {
  id: number;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentFilters {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number | 'all';
}

export interface DepartmentFormData {
  name: string;
  description?: string;
  status?: string;
}
