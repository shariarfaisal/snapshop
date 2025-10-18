import { roleService } from "@/services/role";
import { 
  AssignPermissionInput, 
  CreateRoleInput, 
  UpdateRoleInput,
  Role,
  Permission
} from "@/types/role";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRole = () => {
  const queryClient = useQueryClient();

  // Roles queries
  const {
    data: roles,
    isLoading: isRolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: [roleService.getAllRoles.name],
    queryFn: () => roleService.getAllRoles(),
  });

  // Permissions query
  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    error: permissionsError,
  } = useQuery({
    queryKey: [roleService.getPermissions.name],
    queryFn: () => roleService.getPermissions(),
  });

  // Role mutations
  const createRole = useMutation({
    mutationKey: [roleService.createRole.name],
    mutationFn: roleService.createRole,
  });

  const updateRole = useMutation({
    mutationKey: [roleService.updateRole.name],
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleInput }) => {
      return roleService.updateRole(id, data);
    },
  });

  const deleteRole = useMutation({
    mutationKey: [roleService.deleteRole.name],
    mutationFn: roleService.deleteRole,
  });

  const getRoleById = useMutation({
    mutationKey: [roleService.getRoleById.name],
    mutationFn: (id: number) => roleService.getRoleById(id),
  });

  // Permission mutations
  const getRolePermissions = useMutation({
    mutationKey: ["getRolePermissions"],
    mutationFn: (roleId: number) => roleService.getRolePermissions(roleId),
  });

  const assignPermission = useMutation({
    mutationKey: ["assignPermission"],
    mutationFn: ({ roleId, data }: { roleId: number; data: AssignPermissionInput }) => {
      return roleService.assignPermission(roleId, data);
    },
  });

  const removePermission = useMutation({
    mutationKey: ["removePermission"],
    mutationFn: ({ roleId, permissionId }: { roleId: number; permissionId: number }) => {
      return roleService.removePermission(roleId, permissionId);
    },
  });

  // User role mutations
  const assignRoleToUser = useMutation({
    mutationKey: ["assignRoleToUser"],
    mutationFn: ({ userId, roleId }: { userId: string; roleId: number }) => {
      return roleService.assignRoleToUser(userId, roleId);
    },
  });

  const removeRoleFromUser = useMutation({
    mutationKey: ["removeRoleFromUser"],
    mutationFn: ({ userId, roleId }: { userId: string; roleId: number }) => {
      return roleService.removeRoleFromUser(userId, roleId);
    },
  });

  const getUserRoles = useMutation({
    mutationKey: ["getUserRoles"],
    mutationFn: (userId: string) => roleService.getUserRoles(userId),
  });

  // Cache invalidation
  const invalidateRoles = () => {
    queryClient.invalidateQueries({
      queryKey: [roleService.getAllRoles.name],
    });
  };

  const invalidateRoleById = (id: number) => {
    queryClient.invalidateQueries({
      queryKey: [roleService.getRoleById.name, id],
    });
  };

  const invalidatePermissions = () => {
    queryClient.invalidateQueries({
      queryKey: [roleService.getPermissions.name],
    });
  };

  const invalidateRolePermissions = (roleId: number) => {
    queryClient.invalidateQueries({
      queryKey: [roleService.getRolePermissions.name, roleId],
    });
  };

  const invalidateUserRoles = (userId: string) => {
    queryClient.invalidateQueries({
      queryKey: ["getUserRoles", userId],
    });
  };

  return {
    // Data
    roles,
    permissions,
    
    // Loading states
    isRolesLoading,
    isPermissionsLoading,
    
    // Errors
    rolesError,
    permissionsError,
    
    // Role operations
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    
    // Permission operations
    getRolePermissions,
    assignPermission,
    removePermission,
    
    // User role operations
    assignRoleToUser,
    removeRoleFromUser,
    getUserRoles,
    
    // Cache invalidation
    invalidateRoles,
    invalidateRoleById,
    invalidatePermissions,
    invalidateRolePermissions,
    invalidateUserRoles,
  };
}; 