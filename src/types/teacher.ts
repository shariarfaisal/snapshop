import type { User } from './user';

export interface Teacher {
  id: number;
  userId: number;      // UNIQUE - single user per teacher
  user?: User;         // User data (firstName, lastName, email, phone, etc.)
  employeeId?: string;
  departmentId?: number;
  designationId?: number;
  qualification?: string;
  experience?: number;
  joiningDate?: string;
  salary?: number;
  address?: string;
  profileImage?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  
  // Relations
  department?: Department;
  designation?: Designation;
  role?: Role;
  subjects?: Subject[];
  courseSections?: CourseSection[];
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Designation {
  id: number;
  name: string;
  description?: string;
  departmentId?: number;
  status: string;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface Role {
  id: number;
  name: string;
  status: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface CourseSection {
  id: number;
  courseId: number;
  sectionId: number;
  teacherId: number;
  course?: any;
  section?: any;
}

export interface TeacherFormData {
  user_id?: number;
  employeeId?: string;
  qualification?: string;
  experience?: number;
  joining_date?: string;
  salary?: number;
  designation_id?: number;
  department_id?: number;
  address?: string;
  subject_ids?: number[];
}

export interface TeacherFilters {
  search?: string;
  department_id?: number;
  designation_id?: number;
  status?: string;
  per_page?: number;
  page?: number;
}

export interface TeacherListResponse {
  success?: boolean;
  data: Teacher[];
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  paginationInfo?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface TeacherStats {
  total: number;
  active: number;
  inactive: number;
  byDepartment: Record<string, number>;
}
