export type FeeItemType = "Admission" | "Term" | "Hostel" | "Transport";

export interface FeeItem {
  id: string;
  label: string;
  amount: number;
  type: FeeItemType;
}

export interface FeePlan {
  id: string;
  name: string;
  programId: string;
  programName: string;
  effectiveFrom: string;
  items: FeeItem[];
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = "Cash" | "Bank" | "Cheque" | "Online";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  transactionReference?: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = "Unpaid" | "Paid" | "Overdue" | "Partially Paid";

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  programId: string;
  programName: string;
  campusId: string;
  campusName: string;
  termId: string;
  termName: string;
  feePlanId: string;
  feePlanName: string;
  items: FeeItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export type ScholarshipType = "Zakat" | "Waqf" | "Other";

export interface ScholarshipAward {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  amount: number;
  type: ScholarshipType;
  source: string;
  notes?: string;
  awardedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeePlanInput {
  name: string;
  programId: string;
  effectiveFrom: string;
  items: Omit<FeeItem, "id">[];
}

export type UpdateFeePlanInput = Partial<CreateFeePlanInput>;

export interface CreatePaymentInput {
  amount: number;
  method: PaymentMethod;
  transactionReference?: string;
  paymentDate: string;
}

export interface CreateScholarshipAwardInput {
  studentId: string;
  amount: number;
  type: ScholarshipType;
  source: string;
  notes?: string;
  awardedDate: string;
} 