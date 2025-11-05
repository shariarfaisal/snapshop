export type UserRole = 
  | "super_admin"
  | "teacher"
  | "student"
  | "accountant"
  | "parent";

export type UserStatus = "active" | "inactive" | "suspended";

export type User = {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  status: UserStatus;
  roleId: number;
  role?: {
    id: number;
    name: UserRole;
  };
  teacher?: Teacher;  // If user is teacher
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  departmentId?: number;
  designation?: {
    id: number;
    name: string;
  };
  designationId?: number;
  employeeId?: string;
  joinDate?: string;
  leaveDate?: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roleId: number;
  status?: UserStatus;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, "email" | "password">>;

export type ResetPasswordInput = {
  password: string;
  new_password?: string;
};

export type BulkUserImport = {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roleId: number;
  phone?: string;
  password?: string;
};
