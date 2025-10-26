import { z } from "zod";

/**
 * Auth Validators
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember_me: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

/**
 * User Validators
 */
export const userCreateSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  role_id: z.string().uuid("Invalid role"),
  department_id: z.string().uuid("Invalid department").optional(),
  is_active: z.boolean().default(true),
});

export const userUpdateSchema = userCreateSchema.partial();

/**
 * Academic Structure Validators
 */
export const classCreateSchema = z.object({
  name: z.string().min(1, "Class name required"),
  code: z.string().min(1, "Class code required"),
  description: z.string().optional(),
  academic_year_id: z.string().uuid("Invalid academic year"),
});

export const sectionCreateSchema = z.object({
  name: z.string().min(1, "Section name required"),
  class_id: z.string().uuid("Invalid class"),
  teacher_id: z.string().uuid("Invalid teacher").optional(),
  capacity: z.number().int().positive("Capacity must be positive").optional(),
});

export const subjectCreateSchema = z.object({
  name: z.string().min(1, "Subject name required"),
  code: z.string().min(1, "Subject code required"),
  description: z.string().optional(),
  credit_hours: z.number().positive().optional(),
});

export const courseCreateSchema = z.object({
  name: z.string().min(1, "Course name required"),
  code: z.string().min(1, "Course code required"),
  description: z.string().optional(),
});

/**
 * Admission Validators
 */
export const admissionApplicationSchema = z.object({
  first_name: z.string().min(1, "First name required"),
  last_name: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone required"),
  date_of_birth: z.string().pipe(z.coerce.date()),
  gender: z.enum(["male", "female", "other"]),
  program_id: z.string().uuid("Invalid program"),
  class_id: z.string().uuid("Invalid class").optional(),
  admission_type: z.enum(["regular", "lateral"]).optional(),
});

/**
 * Attendance Validators
 */
export const attendanceRecordSchema = z.object({
  student_id: z.string().uuid("Invalid student"),
  section_id: z.string().uuid("Invalid section"),
  date: z.string().pipe(z.coerce.date()),
  status: z.enum(["present", "absent", "late", "excused"]),
  remarks: z.string().optional(),
});

/**
 * Exam Validators
 */
export const examSchema = z.object({
  name: z.string().min(1, "Exam name required"),
  code: z.string().min(1, "Exam code required"),
  description: z.string().optional(),
  start_date: z.string().pipe(z.coerce.date()),
  end_date: z.string().pipe(z.coerce.date()),
  academic_year_id: z.string().uuid("Invalid academic year"),
});

export const marksEntrySchema = z.object({
  exam_id: z.string().uuid("Invalid exam"),
  student_id: z.string().uuid("Invalid student"),
  subject_id: z.string().uuid("Invalid subject"),
  marks_obtained: z.number().min(0, "Marks cannot be negative"),
  total_marks: z.number().positive("Total marks must be positive"),
  remarks: z.string().optional(),
});

/**
 * Finance Validators
 */
export const feeStructureSchema = z.object({
  name: z.string().min(1, "Fee structure name required"),
  class_id: z.string().uuid("Invalid class"),
  academic_year_id: z.string().uuid("Invalid academic year"),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
});

export const invoiceSchema = z.object({
  student_id: z.string().uuid("Invalid student"),
  fee_structure_id: z.string().uuid("Invalid fee structure"),
  due_date: z.string().pipe(z.coerce.date()),
  notes: z.string().optional(),
});

export const paymentSchema = z.object({
  invoice_id: z.string().uuid("Invalid invoice"),
  amount: z.number().positive("Amount must be positive"),
  payment_method: z.enum(["cash", "cheque", "bank_transfer", "online"]),
  payment_date: z.string().pipe(z.coerce.date()),
  reference_number: z.string().optional(),
  remarks: z.string().optional(),
});

/**
 * Communication Validators
 */
export const noticeSchema = z.object({
  title: z.string().min(1, "Title required"),
  content: z.string().min(1, "Content required"),
  priority: z.enum(["low", "medium", "high"]).optional(),
  publish_date: z.string().pipe(z.coerce.date()).optional(),
  expiry_date: z.string().pipe(z.coerce.date()).optional(),
});

export const messageSchema = z.object({
  recipient_id: z.string().uuid("Invalid recipient"),
  subject: z.string().min(1, "Subject required"),
  body: z.string().min(1, "Body required"),
});

/**
 * Timetable Validators
 */
export const timetableSlotSchema = z.object({
  section_id: z.string().uuid("Invalid section"),
  subject_id: z.string().uuid("Invalid subject"),
  teacher_id: z.string().uuid("Invalid teacher"),
  day_of_week: z.number().int().min(0).max(6),
  start_time: z.string().time(),
  end_time: z.string().time(),
  room_id: z.string().uuid("Invalid room").optional(),
});

/**
 * Type exports for form usage
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type ClassCreateInput = z.infer<typeof classCreateSchema>;
export type AdmissionApplicationInput = z.infer<typeof admissionApplicationSchema>;
export type AttendanceRecordInput = z.infer<typeof attendanceRecordSchema>;
export type ExamInput = z.infer<typeof examSchema>;
export type MarksEntryInput = z.infer<typeof marksEntrySchema>;
export type FeeStructureInput = z.infer<typeof feeStructureSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
