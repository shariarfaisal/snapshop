// Fee Head types
export interface FeeHead {
  id: number;
  institute_id: number;
  name: string;
  code?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFeeHeadInput {
  name: string;
  code?: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateFeeHeadInput extends Partial<CreateFeeHeadInput> {}

export interface FeeHeadFilters {
  search?: string;
  is_active?: boolean;
  per_page?: number;
}

// Fee Structure types
export type FeeFrequency = "one_time" | "monthly" | "quarterly" | "term" | "annual";

export interface FeeStructureItem {
  id?: number;
  fee_structure_id?: number;
  fee_head_id: number;
  fee_head?: FeeHead;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface FeeStructure {
  id: number;
  institute_id: number;
  name: string;
  academic_year_id: number;
  academic_year?: any;
  class_id: number;
  school_class?: any;
  frequency: FeeFrequency;
  items: FeeStructureItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateFeeStructureInput {
  name: string;
  academic_year_id: number;
  class_id: number;
  frequency: FeeFrequency;
  items: {
    fee_head_id: number;
    amount: number;
  }[];
}

export interface UpdateFeeStructureInput extends Partial<CreateFeeStructureInput> {}

export interface FeeStructureFilters {
  search?: string;
  class_id?: number | string;
  academic_year_id?: number | string;
  frequency?: FeeFrequency;
  per_page?: number;
}

// Invoice types
export type InvoiceStatus = "pending" | "partially_paid" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: number;
  institute_id: number;
  invoice_number: string;
  student_id: number;
  student?: any;
  fee_structure_id?: number;
  fee_structure?: FeeStructure;
  gross_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_amount: number;
  paid_amount: number;
  due_amount: number;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  description?: string;
  remarks?: string;
  payments?: Payment[];
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceInput {
  student_id: number;
  fee_structure_id?: number;
  gross_amount?: number;
  discount_amount?: number;
  tax_amount?: number;
  invoice_date?: string;
  due_date: string;
  description?: string;
  remarks?: string;
}

export interface UpdateInvoiceInput {
  due_date?: string;
  discount_amount?: number;
  tax_amount?: number;
  description?: string;
  remarks?: string;
}

export interface InvoiceFilters {
  search?: string;
  student_id?: number | string;
  status?: InvoiceStatus | string;
  from_date?: string;
  to_date?: string;
  overdue?: boolean;
  per_page?: number;
}

export interface BulkGenerateInvoicesInput {
  class_id: number;
  fee_structure_id: number;
  invoice_date?: string;
  due_date: string;
}

export interface InvoiceStatistics {
  total_invoices: number;
  pending_invoices: number;
  paid_invoices: number;
  overdue_invoices: number;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  collection_rate: number;
}

// Payment types
export type PaymentMethod = "cash" | "cheque" | "bank_transfer" | "card" | "online" | "upi" | "other";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: number;
  institute_id: number;
  payment_number: string;
  invoice_id: number;
  invoice?: Invoice;
  student_id: number;
  student?: any;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id?: string;
  reference_number?: string;
  payment_date: string;
  status: PaymentStatus;
  remarks?: string;
  collected_by: number;
  collected_by_user?: any;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentInput {
  invoice_id: number;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id?: string;
  reference_number?: string;
  payment_date?: string;
  status?: PaymentStatus;
  remarks?: string;
}

export interface UpdatePaymentInput {
  payment_date?: string;
  payment_method?: PaymentMethod;
  transaction_id?: string;
  reference_number?: string;
  status?: PaymentStatus;
  remarks?: string;
}

export interface PaymentFilters {
  search?: string;
  student_id?: number | string;
  invoice_id?: number;
  payment_method?: PaymentMethod | string;
  status?: PaymentStatus | string;
  from_date?: string;
  to_date?: string;
  per_page?: number;
}

export interface RefundPaymentInput {
  refund_reason?: string;
}

export interface PaymentStatistics {
  total_amount: number;
  total_count: number;
  by_method: {
    payment_method: PaymentMethod;
    count: number;
    total: number;
  }[];
} 