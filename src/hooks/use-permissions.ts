import { useAuthStore } from "@/store/auth-store";
import { Permission } from "@/types/role";

export interface UsePermissionsReturn {
  /**
   * Check if user has a specific permission
   */
  hasPermission: (permission: string) => boolean;

  /**
   * Check if user has ANY of the given permissions
   */
  hasAnyPermission: (permissions: string[]) => boolean;

  /**
   * Check if user has ALL of the given permissions
   */
  hasAllPermissions: (permissions: string[]) => boolean;

  /**
   * Get all permissions for the current user
   */
  permissions: Permission[];

  /**
   * Check if permissions are being loaded
   */
  isLoading: boolean;
}

/**
 * Hook for checking user permissions
 *
 * @example
 * ```tsx
 * const { hasPermission, hasAnyPermission } = usePermissions();
 *
 * if (hasPermission('readAll-student')) {
 *   // Show student list
 * }
 *
 * if (hasAnyPermission(['create-student', 'update-student'])) {
 *   // Show add/edit button
 * }
 * ```
 */
export function usePermissions(): UsePermissionsReturn {
  const { user, isLoading } = useAuthStore();

  const permissions = user?.role?.permissions || [];

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }

    return user.role.permissions.some(
      (p) => p.name.toLowerCase() === permission.toLowerCase()
    );
  };

  const hasAnyPermission = (permissionsToCheck: string[]): boolean => {
    if (!permissionsToCheck || permissionsToCheck.length === 0) {
      return false;
    }

    return permissionsToCheck.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissionsToCheck: string[]): boolean => {
    if (!permissionsToCheck || permissionsToCheck.length === 0) {
      return false;
    }

    return permissionsToCheck.every((permission) => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    isLoading,
  };
}
