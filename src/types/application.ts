export type ApplicationStatus = 'Submitted' | 'Shortlisted' | 'Offered' | 'Rejected' | 'Accepted';

export type DocumentType = 'BIRTH_CERT' | 'MARKSHEET' | 'PASSPORT' | 'OTHER';

export interface Document {
  id: string;
  type: DocumentType;
  url: string;
  created_at: string;
}

export interface Application {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  email: string;
  nationality: string;
  applied_level: string;
  applied_term: string;
  campus: string;
  merit_cat_id: string;
  status: ApplicationStatus;
  documents: Document[];
  created_at: string;
  updated_at: string;
}

export interface ApplicationCreate {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  email: string;
  nationality: string;
  applied_level: string;
  applied_term: string;
  campus: string;
  merit_cat_id: string;
}

export interface ApplicationUpdate {
  status?: ApplicationStatus;
} 