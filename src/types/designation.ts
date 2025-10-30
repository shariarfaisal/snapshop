import { Department } from './department';

export interface Designation {
  id: number;
  name: string;
  description?: string;
  departmentId: number;
  status: string;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface DesignationFilters {
  search?: string;
  status?: string;
  department_id?: number;
  page?: number;
  per_page?: number | 'all';
}

export interface DesignationFormData {
  name: string;
  description?: string;
  departmentId: number;
  status?: string;
}
