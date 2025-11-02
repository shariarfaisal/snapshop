"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthStore } from "@/store/auth-store";

export interface PermissionGuardProps {
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
   * Optional fallback content to show while checking permissions
   */
  loadingFallback?: ReactNode;

  /**
   * Optional content to show when user doesn't have permission
   * If not provided, user will be redirected to fallbackPath
   */
  noPermissionFallback?: ReactNode;

  /**
   * Path to redirect to if user doesn't have permission
   * Default: "/admin/dashboard"
   */
  fallbackPath?: string;
}

/**
 * Component that guards entire pages based on user permissions
 *
 * Use this component to wrap page content that requires specific permissions.
 * Users without the required permissions will be redirected or shown a fallback.
 *
 * @example
 * ```tsx
 * // Protect a page with single permission
 * export default function StudentsPage() {
 *   return (
 *     <PermissionGuard permission="readAll-student">
 *       <StudentsContent />
 *     </PermissionGuard>
 *   );
 * }
 *
 * // Protect with multiple permissions (ANY)
 * export default function ManageStudentsPage() {
 *   return (
 *     <PermissionGuard permission={["create-student", "update-student"]}>
 *       <ManageStudentsContent />
 *     </PermissionGuard>
 *   );
 * }
 *
 * // Protect with multiple permissions (ALL)
 * export default function AdminPanel() {
 *   return (
 *     <PermissionGuard
 *       permission={["readAll-dashboard", "readAll-report"]}
 *       requireAll
 *     >
 *       <AdminPanelContent />
 *     </PermissionGuard>
 *   );
 * }
 *
 * // With custom fallback
 * export default function ReportsPage() {
 *   return (
 *     <PermissionGuard
 *       permission="readAll-report"
 *       noPermissionFallback={
 *         <div className="p-6">
 *           <h1>Access Denied</h1>
 *           <p>You don't have permission to view reports.</p>
 *         </div>
 *       }
 *     >
 *       <ReportsContent />
 *     </PermissionGuard>
 *   );
 * }
 * ```
 */
export function PermissionGuard({
  permission,
  requireAll = false,
  children,
  loadingFallback = <div className="flex items-center justify-center h-screen">Loading...</div>,
  noPermissionFallback,
  fallbackPath = "/admin/dashboard",
}: PermissionGuardProps) {
  const router = useRouter();
  const { isLoading } = useAuthStore();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // If no permission specified, always render children
  if (!permission) {
    return <>{children}</>;
  }

  // Show loading state while auth is initializing
  if (isLoading) {
    return <>{loadingFallback}</>;
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

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If no custom fallback provided, redirect to fallback path
  if (!noPermissionFallback) {
    useEffect(() => {
      router.push(fallbackPath);
    }, [router, fallbackPath]);

    return <>{loadingFallback}</>;
  }

  // Show custom no permission fallback
  return <>{noPermissionFallback}</>;
}
