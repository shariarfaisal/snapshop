export type UserRole = "admin" | "teacher" | "student" | "librarian" | "accountant" | "staff";

export type UserStatus = "Active" | "Inactive";


export type User = {
  id: string;
  username: string;
  email: string;
  locale: string;
  status: UserStatus;
  tenant_id: string;
  campus_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateUserInput = {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  campus_id?: string;
  status?: UserStatus;
  locale: string;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, "email" | "password">>;

export type ResetPasswordInput = {
  password: string;
  confirmPassword: string;
};
