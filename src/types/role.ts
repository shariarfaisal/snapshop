// Role enum - System roles
export enum RoleEnum {
  SUPER_ADMIN = "Super Admin",
  INSTITUTE_ADMIN = "Institute Admin",
  TEACHER = "Teacher",
  STUDENT = "Student",
  ACCOUNTANT = "Accountant",
  PARENT = "Parent",
}

export interface Role {
  id: number;
  name: RoleEnum | string;
  status?: string;
  institute_id?: number;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export interface RoleResponse {
  data: Role[];
  total: number;
}

export interface PermissionResponse {
  data: Permission[];
  total: number;
}

export interface CreateRoleInput {
  name: string;
  institute_id?: number;
}

export interface UpdateRoleInput {
  name?: string;
  status?: string;
}

export interface AssignPermissionInput {
  permission_id: number;
}

export interface AssignRoleToUserInput {
  role_id: number;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

// Mapping for display
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  [RoleEnum.SUPER_ADMIN]: "Super Admin",
  [RoleEnum.INSTITUTE_ADMIN]: "Institute Admin",
  [RoleEnum.TEACHER]: "Teacher",
  [RoleEnum.STUDENT]: "Student",
  [RoleEnum.ACCOUNTANT]: "Accountant",
  [RoleEnum.PARENT]: "Parent",
};

export const ROLE_DESCRIPTIONS: Record<RoleEnum, string> = {
  [RoleEnum.SUPER_ADMIN]: "Full system access - manages institutes and billing",
  [RoleEnum.INSTITUTE_ADMIN]: "Full institute access - manages all operations",
  [RoleEnum.TEACHER]: "Teaching staff - manages classes, attendance, marks",
  [RoleEnum.STUDENT]: "Student - view-only access to academic data",
  [RoleEnum.ACCOUNTANT]: "Finance staff - manages fees, invoices, payments",
  [RoleEnum.PARENT]: "Parent/Guardian - monitor linked student data",
};