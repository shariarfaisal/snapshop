export interface Teacher {
  id: number;
  userId?: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  departmentId?: number;
  designationId?: number;
  qualification?: string;
  experience?: number;
  joiningDate?: string;
  salary?: number;
  roleId: number;
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
  first_name: string;
  last_name: string;
  email: string;
  username?: string;
  password?: string;
  phone?: string;
  address?: string;
  employee_id?: string;
  department_id?: number;
  designation_id?: number;
  qualification?: string;
  experience?: number;
  joining_date?: string;
  salary?: number;
  status?: string;
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
  current_page: number;
  data: Teacher[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface TeacherStats {
  total: number;
  active: number;
  inactive: number;
  byDepartment: Record<string, number>;
}
