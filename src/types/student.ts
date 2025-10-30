import { User } from "./user";

export type StudentStatus = "active" | "inactive" | "graduated" | "suspended" | "withdrawn";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface Student {
  id: number;
  userId: number;
  user?: User;
  admissionNumber: string;
  schoolClassId: number | null;
  schoolClass?: {
    id: number;
    name: string;
    description?: string;
  };
  sectionId: number | null;
  section?: {
    id: number;
    name: string;
  };
  academicYearId: number | null;
  academicYear?: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
  };
  rollNumber: string | null;
  dateOfBirth: string | null;
  bloodGroup: BloodGroup | null;
  nationality: string | null;
  parentPhone: string | null;
  parentEmail: string | null;
  enrollmentDate: string | null;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface StudentProfile extends Student {
  // Legacy compatibility
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
}

export interface StudentMedical {
  id: string;
  studentId: string;
  bloodGroup: BloodGroup;
  allergies: string;
  chronicDisease: string;
  medications: string;
  notes: string;
}

export interface StudentGuardian {
  id: string;
  studentId: string;
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
  occupation: string;
  isPrimary: boolean;
}

export interface CreateStudentInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  username?: string;
  password?: string;
  gender?: "male" | "female" | "other";
  admissionNumber?: string;
  schoolClassId: number;
  sectionId?: number | null;
  academicYearId?: number | null;
  rollNumber?: string;
  dateOfBirth?: string;
  bloodGroup?: BloodGroup;
  nationality?: string;
  parentPhone?: string;
  parentEmail?: string;
  enrollmentDate?: string;
  status?: StudentStatus;
}

export type UpdateStudentInput = Partial<CreateStudentInput>;

export interface StudentFilters {
  search?: string;
  class_id?: string | number;
  section_id?: string | number;
  academic_year_id?: string | number;
  status?: StudentStatus | "all";
  gender?: string;
  blood_group?: BloodGroup;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
}

export interface StudentStatistics {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
  male: number;
  female: number;
}

export interface CreateStudentProfileInput extends CreateStudentInput {
  // Legacy compatibility
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  campusId?: string;
  currentLevel?: string;
  admissionDate?: string;
  programId?: string;
  registrationNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export type UpdateStudentProfileInput = Partial<CreateStudentProfileInput>;

export interface CreateStudentMedicalInput {
  studentId: string;
  bloodGroup: BloodGroup;
  allergies?: string;
  chronicDisease?: string;
  medications?: string;
  notes?: string;
}

export type UpdateStudentMedicalInput = Partial<CreateStudentMedicalInput>;

export interface CreateStudentGuardianInput {
  studentId: string;
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
  occupation: string;
  isPrimary: boolean;
}

export type UpdateStudentGuardianInput = Partial<CreateStudentGuardianInput>; 