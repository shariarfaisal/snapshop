"use client";

import { ReactNode } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ProtectedButtonProps extends ButtonProps {
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
   * How to handle lack of permission:
   * - "disable": Button is visible but disabled (default)
   * - "hide": Button is completely hidden
   */
  protectionMode?: "disable" | "hide";

  /**
   * Tooltip message to show when button is disabled due to lack of permission
   */
  noPermissionTooltip?: string;

  /**
   * Button content
   */
  children: ReactNode;
}

/**
 * Button component that is protected by permissions
 *
 * @example
 * ```tsx
 * // Button that disables if no permission
 * <ProtectedButton permission="create-student">
 *   Add Student
 * </ProtectedButton>
 *
 * // Button that hides if no permission
 * <ProtectedButton permission="delete-student" protectionMode="hide">
 *   Delete
 * </ProtectedButton>
 *
 * // Button requiring multiple permissions (ANY)
 * <ProtectedButton permission={["create-student", "update-student"]}>
 *   Manage Student
 * </ProtectedButton>
 *
 * // Button requiring multiple permissions (ALL)
 * <ProtectedButton
 *   permission={["create-exam", "update-exam"]}
 *   requireAll
 *   noPermissionTooltip="You need both create and update exam permissions"
 * >
 *   Create Exam
 * </ProtectedButton>
 * ```
 */
export function ProtectedButton({
  permission,
  requireAll = false,
  protectionMode = "disable",
  noPermissionTooltip = "You don't have permission to perform this action",
  children,
  disabled,
  ...buttonProps
}: ProtectedButtonProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // If no permission specified, render normal button
  if (!permission) {
    return (
      <Button disabled={disabled} {...buttonProps}>
        {children}
      </Button>
    );
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

  // If user has access or button is already disabled, render normal button
  if (hasAccess) {
    return (
      <Button disabled={disabled} {...buttonProps}>
        {children}
      </Button>
    );
  }

  // If protection mode is "hide", don't render anything
  if (protectionMode === "hide") {
    return null;
  }

  // If protection mode is "disable", render disabled button with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button disabled {...buttonProps}>
              {children}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{noPermissionTooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
