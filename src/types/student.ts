import { User } from "./user";

export type StudentStatus = "Active" | "Inactive" | "Graduated" | "Suspended" | "Withdrawn";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface StudentProfile {
  id: string;
  userId: string;
  user?: User;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  nationality: string;
  campusId: string;
  campusName?: string;
  currentLevel: string;
  admissionDate: string;
  status: StudentStatus;
  programId: string;
  programName?: string;
  registrationNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: string;
  updatedAt: string;
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

export interface CreateStudentProfileInput {
  userId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  nationality: string;
  campusId: string;
  currentLevel: string;
  admissionDate: string;
  status: StudentStatus;
  programId: string;
  registrationNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
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