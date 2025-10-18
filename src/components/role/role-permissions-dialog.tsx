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
          description: `Added permission: ${permission.description}`,
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
          description: `Removed permission: ${permission.description}`,
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
        permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
                      <div className="font-medium">{permission.description}</div>
                      <div className="text-xs text-muted-foreground">{permission.code}</div>
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