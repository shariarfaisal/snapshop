import type { User } from './user';

export interface Teacher {
  id: number;
  userId: number;      // UNIQUE - single user per teacher
  user?: User;         // User data (firstName, lastName, email, phone, etc.)
  employeeId: string;
  departmentId?: number;
  designationId?: number;
  qualification?: string;
  experience?: number;
  joiningDate?: string;
  salary?: number;
  address?: string;
  profileImage?: string;
  status: string;
  created_at: string;
  updated_at: string;
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
  departmentId: number;
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
}

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  password?: string;
  phone?: string;
  address?: string;
  employeeId?: string;
  departmentId?: number;
  designationId?: number;
  qualification?: string;
  experience?: number;
  joiningDate?: string;
  salary?: number;
  status?: string;
  subjectIds?: number[];
}

export interface TeacherFilters {
  search?: string;
  departmentId?: number;
  designationId?: number;
  status?: string;
  perPage?: number;
  page?: number;
}

export interface TeacherListResponse {
  success: boolean;
  data: Teacher[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface TeacherStats {
  total: number;
  active: number;
  inactive: number;
  byDepartment: Record<string, number>;
}
