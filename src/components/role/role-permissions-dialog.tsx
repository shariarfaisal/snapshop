"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRole, useToast } from "@/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Role, Permission } from "@/types/role";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface RolePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
}

export function RolePermissionsDialog({
  open,
  onOpenChange,
  role,
}: RolePermissionsDialogProps) {
  const { toast } = useToast();
  const { 
    permissions, 
    isPermissionsLoading, 
    permissionsError,
    getRolePermissions,
    assignPermission,
    removePermission,
    invalidateRolePermissions
  } = useRole();

  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      loadRolePermissions();
    }
  }, [open, role.id]);

  const loadRolePermissions = async () => {
    setIsLoading(true);
    try {
      const permissions = await getRolePermissions.mutateAsync(role.id);
      setRolePermissions(permissions.data);
      setIsLoading(false);
    } catch (error) {
      const msg = isAxiosError(error) 
        ? error.response?.data?.error || "Failed to load permissions" 
        : "Failed to load permissions";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleTogglePermission = async (permission: Permission, checked: boolean) => {
    try {
      if (checked) {
        await assignPermission.mutateAsync({
          roleId: role.id,
          data: { permission_id: permission.id }
        });
        setRolePermissions((prev) => [...prev, permission]);
        toast({
          title: "Success",
          description: `Added permission: ${permission.name}`,
        });
      } else {
        await removePermission.mutateAsync({
          roleId: role.id,
          permissionId: permission.id
        });
        setRolePermissions((prev) =>
          prev.filter((p) => p.id !== permission.id)
        );
        toast({
          title: "Success",
          description: `Removed permission: ${permission.name}`,
        });
      }
      invalidateRolePermissions(role.id);
    } catch (error) {
      const action = checked ? "add" : "remove";
      const msg = isAxiosError(error)
        ? error.response?.data?.error || `Failed to ${action} permission`
        : `Failed to ${action} permission`;
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const isPermissionAssigned = (permissionId: number) => {
    return rolePermissions?.some((p) => p.id === permissionId);
  };

  const filteredPermissions = permissions?.data
    ? permissions.data.filter((permission) =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const allFilteredPermissionsAssigned = 
    filteredPermissions.length > 0 && 
    filteredPermissions.every((p) => isPermissionAssigned(p.id));

  const handleSelectAll = async () => {
    try {
      const permissionsToAssign = filteredPermissions.filter(
        (p) => !isPermissionAssigned(p.id)
      );

      for (const permission of permissionsToAssign) {
        await assignPermission.mutateAsync({
          roleId: role.id,
          data: { permission_id: permission.id }
        });
      }

      setRolePermissions((prev) => [
        ...prev,
        ...permissionsToAssign,
      ]);

      toast({
        title: "Success",
        description: `Added ${permissionsToAssign.length} permissions`,
      });

      invalidateRolePermissions(role.id);
    } catch (error) {
      const msg = isAxiosError(error)
        ? error.response?.data?.error || "Failed to add permissions"
        : "Failed to add permissions";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleDeselectAll = async () => {
    try {
      const permissionsToRemove = filteredPermissions.filter(
        (p) => isPermissionAssigned(p.id)
      );

      for (const permission of permissionsToRemove) {
        await removePermission.mutateAsync({
          roleId: role.id,
          permissionId: permission.id
        });
      }

      setRolePermissions((prev) =>
        prev.filter((p) => !permissionsToRemove.some((pr) => pr.id === p.id))
      );

      toast({
        title: "Success",
        description: `Removed ${permissionsToRemove.length} permissions`,
      });

      invalidateRolePermissions(role.id);
    } catch (error) {
      const msg = isAxiosError(error)
        ? error.response?.data?.error || "Failed to remove permissions"
        : "Failed to remove permissions";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Permissions for {role.label}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={assignPermission.isPending || allFilteredPermissionsAssigned || filteredPermissions.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              disabled={removePermission.isPending || !allFilteredPermissionsAssigned || filteredPermissions.length === 0}
            >
              Deselect All
            </Button>
          </div>
          
          {isLoading || isPermissionsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : permissionsError ? (
            <div className="text-center py-4 text-red-500">
              Error loading permissions
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {filteredPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={isPermissionAssigned(permission.id)}
                      onCheckedChange={(checked) => 
                        handleTogglePermission(permission, checked as boolean)
                      }
                      disabled={assignPermission.isPending || removePermission.isPending}
                    />
                    <Label
                      htmlFor={`permission-${permission.id}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      <div className="font-medium">{permission.name}</div>
                      <div className="text-xs text-muted-foreground">{permission.type}</div>
                    </Label>
                  </div>
                ))}
                
                {filteredPermissions.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No permissions found
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 