import { z } from "zod";
import { UserRole, UserStatus } from "@/types/user";

export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["admin", "teacher", "student", "librarian", "accountant", "staff"] as const, {
    required_error: "Role is required",
  }),
  campusId: z.string().optional(),
  status: z.enum(["active", "inactive"] as const).default("active"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userFormSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>; 