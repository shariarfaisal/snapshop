export interface Section {
  id: number;
  schoolClassId: number;
  name: string;
  maxCapacity: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  schoolClass?: SchoolClass;
  students?: Student[];
  courseSections?: CourseSection[];
}

export interface SchoolClass {
  id: number;
  name: string;
  description?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  userId: number;
  sectionId: number;
  rollNumber: string;
  status: string;
}

export interface CourseSection {
  id: number;
  sectionId: number;
  courseId: number;
  teacherId: number;
  course?: Course;
  teacher?: Teacher;
}

export interface Course {
  id: number;
  name: string;
  code: string;
}

export interface Teacher {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
}

export interface SectionStats {
  maxCapacity: number;
  currentStudents: number;
  availableSlots: number;
  totalCourses: number;
  activeStudents: number;
}

export interface CreateSectionInput {
  schoolClassId: number;
  name: string;
  maxCapacity: number;
  status?: boolean;
}

export interface UpdateSectionInput {
  schoolClassId?: number;
  name?: string;
  maxCapacity?: number;
  status?: boolean;
}

export interface SectionFilters {
  search?: string;
  schoolClassId?: number;
  status?: boolean;
  minCapacity?: number;
  maxCapacity?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
}

export interface SectionResponse {
  success: boolean;
  message: string;
  data: Section;
}

export interface SectionsResponse {
  success: boolean;
  message: string;
  data: Section[];
  pagination: Pagination;
}

export interface SectionStatsResponse {
  success: boolean;
  message: string;
  data: SectionStats;
}

export interface Pagination {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
}
