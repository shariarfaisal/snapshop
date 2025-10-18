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
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { isAxiosError } from "axios";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface UserRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function UserRolesDialog({
  open,
  onOpenChange,
  user,
}: UserRolesDialogProps) {
  const { toast } = useToast();
  const { 
    roles, 
    isRolesLoading, 
    rolesError,
    getUserRoles,
    assignRoleToUser,
    removeRoleFromUser,
    invalidateUserRoles
  } = useRole();

  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      loadUserRoles();
    }
  }, [open, user.id]);

  const loadUserRoles = async () => {
    setIsLoading(true);
    try {
      const roles = await getUserRoles.mutateAsync(user.id);
      setUserRoles(roles);
      setIsLoading(false);
    } catch (error) {
      const msg = isAxiosError(error) 
        ? error.response?.data?.error || "Failed to load user roles" 
        : "Failed to load user roles";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleToggleRole = async (role: Role, checked: boolean) => {
    try {
      if (checked) {
        await assignRoleToUser.mutateAsync({ 
          userId: user.id, 
          roleId: role.id 
        });
        setUserRoles((prev) => [...prev, role]);
        toast({
          title: "Success",
          description: `Assigned role: ${role.label}`,
        });
      } else {
        await removeRoleFromUser.mutateAsync({ 
          userId: user.id, 
          roleId: role.id 
        });
        setUserRoles((prev) => 
          prev.filter((r) => r.id !== role.id)
        );
        toast({
          title: "Success",
          description: `Removed role: ${role.label}`,
        });
      }
      invalidateUserRoles(user.id);
    } catch (error) {
      const action = checked ? "assign" : "remove";
      const msg = isAxiosError(error) 
        ? error.response?.data?.error || `Failed to ${action} role` 
        : `Failed to ${action} role`;
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const isRoleAssigned = (roleId: number) => {
    return userRoles.some((r) => r.id === roleId);
  };

  const filteredRoles = roles?.data
    ? roles.data.filter((role) => 
        role.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.code?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Roles for {user.username}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          {isLoading || isRolesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : rolesError ? (
            <div className="text-center py-4 text-red-500">
              Error loading roles
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {filteredRoles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={isRoleAssigned(role.id)}
                      onCheckedChange={(checked) => 
                        handleToggleRole(role, checked as boolean)
                      }
                      disabled={assignRoleToUser.isPending || removeRoleFromUser.isPending}
                    />
                    <Label 
                      htmlFor={`role-${role.id}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      <div className="font-medium">{role.label}</div>
                      <div className="text-xs text-muted-foreground">{role.code}</div>
                    </Label>
                  </div>
                ))}
                
                {filteredRoles.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No roles found
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