export type AdmissionStatus = "Submitted" | "Shortlisted" | "Offered" | "Rejected" | "Accepted";

export type MeritCategory = "General" | "Orphan" | "Special" | "Zakat";

export type Gender = "Male" | "Female" | "Other";

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface StatusHistory {
  status: AdmissionStatus;
  changedAt: string;
  changedBy: string;
  notes?: string;
}

export interface Admission {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  email: string;
  phone: string;
  programId: string;
  programName: string;
  campusId: string;
  campusName: string;
  meritCategory: MeritCategory;
  status: AdmissionStatus;
  documents: Document[];
  statusHistory: StatusHistory[];
  submittedAt: string;
  updatedAt: string;
}

export interface CreateAdmissionInput {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  email: string;
  phone: string;
  programId: string;
  campusId: string;
  meritCategory: MeritCategory;
  documents?: File[];
}

export interface UpdateAdmissionStatusInput {
  status: AdmissionStatus;
  notes?: string;
} 