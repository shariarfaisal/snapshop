export interface Role {
  id: number;
  code: string;
  label: string;
  tenant_id: number;
}

export interface Permission {
  id: number;
  code: string;
  description: string;
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
  code: string;
  label: string;
}

export interface UpdateRoleInput {
  code?: string;
  label?: string;
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