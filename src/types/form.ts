export type FormStatus = "Draft" | "Published" | "Closed";

export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "file";

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  status: FormStatus;
  fields: FormField[];
  roles: string[];
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, string | string[] | File>;
  submittedBy: {
    id: string;
    name: string;
    email: string;
  };
  submittedAt: string;
} 