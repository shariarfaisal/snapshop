import { 
  RoleResponse, 
  PermissionResponse, 
  Role, 
  CreateRoleInput, 
  UpdateRoleInput, 
  AssignPermissionInput,
  Permission 
} from "@/types/role";
import { $clientPrivate } from "@/lib/api-client";

const BASE_URL = "/v1/roles";

export const roleService = {
  // Role Operations
  getAllRoles: async () => {
    const response = await $clientPrivate.get<RoleResponse>(BASE_URL);
    console.log(response)
    return response.data;
  },

  getRoleById: async (id: number) => {
    const response = await $clientPrivate.get<Role>(`${BASE_URL}/${id}`);
    return response.data;
  },

  createRole: async (data: CreateRoleInput) => {
    const response = await $clientPrivate.post<Role>(BASE_URL, data);
    return response.data;
  },

  updateRole: async (id: number, data: UpdateRoleInput) => {
    const response = await $clientPrivate.put<Role>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: number) => {
    await $clientPrivate.delete(`${BASE_URL}/${id}`);
  },

  // Permission Operations
  getPermissions: async () => {
    const response = await $clientPrivate.get<PermissionResponse>("/v1/permissions");
    return response.data;
  },

  getRolePermissions: async (roleId: number) => {
    const response = await $clientPrivate.get<{
      data: Permission[];
      total: number;
    }>(`${BASE_URL}/${roleId}/permissions`);
    return response.data;
  },

  assignPermission: async (roleId: number, data: AssignPermissionInput) => {
    const response = await $clientPrivate.post<void>(
      `${BASE_URL}/${roleId}/permissions`, 
      data
    );
    return response.data;
  },

  removePermission: async (roleId: number, permissionId: number) => {
    await $clientPrivate.delete(`${BASE_URL}/${roleId}/permissions/${permissionId}`);
  },

  // User Role Operations
  assignRoleToUser: async (userId: string, roleId: number) => {
    const response = await $clientPrivate.post<void>(
      `/v1/users/${userId}/roles`,
      { role_id: roleId }
    );
    return response.data;
  },

  removeRoleFromUser: async (userId: string, roleId: number) => {
    await $clientPrivate.delete(`/v1/users/${userId}/roles/${roleId}`);
  },

  getUserRoles: async (userId: string) => {
    const response = await $clientPrivate.get<Role[]>(`/v1/users/${userId}/roles`);
    return response.data;
  },
}; 