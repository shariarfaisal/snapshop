"use client";

import { ReactNode } from "react";
import { usePermissions } from "@/hooks/use-permissions";

export interface CanAccessProps {
  /**
   * Single permission or array of permissions to check
   */
  permission?: string | string[];

  /**
   * If true, user must have ALL specified permissions.
   * If false or undefined, user needs ANY of the specified permissions.
   */
  requireAll?: boolean;

  /**
   * Content to render if user has permission
   */
  children: ReactNode;

  /**
   * Optional content to render if user doesn't have permission
   */
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders content based on user permissions
 *
 * @example
 * ```tsx
 * // Show content only if user has specific permission
 * <CanAccess permission="create-student">
 *   <Button>Add Student</Button>
 * </CanAccess>
 *
 * // Show content if user has ANY of the permissions
 * <CanAccess permission={["create-student", "update-student"]}>
 *   <Button>Manage Student</Button>
 * </CanAccess>
 *
 * // Show content only if user has ALL permissions
 * <CanAccess permission={["create-exam", "update-exam"]} requireAll>
 *   <Button>Create Exam</Button>
 * </CanAccess>
 *
 * // Show fallback content if no permission
 * <CanAccess
 *   permission="readAll-report"
 *   fallback={<p>You don't have access to reports</p>}
 * >
 *   <ReportsDashboard />
 * </CanAccess>
 * ```
 */
export function CanAccess({
  permission,
  requireAll = false,
  children,
  fallback = null,
}: CanAccessProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // If no permission specified, always render children
  if (!permission) {
    return <>{children}</>;
  }

  let hasAccess = false;

  // Check permissions based on type
  if (typeof permission === "string") {
    hasAccess = hasPermission(permission);
  } else if (Array.isArray(permission)) {
    if (requireAll) {
      hasAccess = hasAllPermissions(permission);
    } else {
      hasAccess = hasAnyPermission(permission);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
