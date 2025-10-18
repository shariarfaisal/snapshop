"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { Role } from "@/types/role";
import { useRole, useToast } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { EditRoleDialog } from "./edit-role-dialog";
import { DeleteRoleDialog } from "./delete-role-dialog";
import { RolePermissionsDialog } from "./role-permissions-dialog";
import { isAxiosError } from "axios";

export function RoleTable() {
  const { roles, isRolesLoading, rolesError, updateRole, deleteRole, invalidateRoles } = useRole();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  if (isRolesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (rolesError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading roles</p>
      </div>
    );
  }

  if (!roles?.data?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No roles found</p>
      </div>
    );
  }

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionsDialogOpen(true);
  };

  const handleUpdateRole = (id: number, data: any) => {
    updateRole.mutate({ id, data }, {
      onSuccess: () => {
        invalidateRoles();
        setIsEditDialogOpen(false);
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      },
      onError: (err) => {
        const msg = isAxiosError(err) 
          ? err.response?.data?.error || "Failed to update role" 
          : "Failed to update role";
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      }
    });
  };

  const handleDeleteRole = (id: number) => {
    deleteRole.mutate(id, {
      onSuccess: () => {
        invalidateRoles();
        setIsDeleteDialogOpen(false);
        toast({
          title: "Success",
          description: "Role deleted successfully",
        });
      },
      onError: (err) => {
        const msg = isAxiosError(err) 
          ? err.response?.data?.error || "Failed to delete role" 
          : "Failed to delete role";
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      }
    });
  };

  // Filter roles based on search query
  const filteredRoles = roles?.data.filter(role => 
    role.label?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Paginate roles
  const totalPages = Math.ceil(filteredRoles.length / pageSize);
  const paginatedRoles = filteredRoles.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by name..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoles.length > 0 ? (
              paginatedRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.label}</TableCell>
                  <TableCell>{role.code}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(role)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleManagePermissions(role)}>
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(role)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {Math.max(1, totalPages)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {selectedRole && (
        <>
          <EditRoleDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            role={selectedRole}
            onSubmit={(data) => handleUpdateRole(selectedRole.id, data)}
          />

          <DeleteRoleDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            role={selectedRole}
            onConfirm={() => handleDeleteRole(selectedRole.id)}
          />

          <RolePermissionsDialog
            open={isPermissionsDialogOpen}
            onOpenChange={setIsPermissionsDialogOpen}
            role={selectedRole}
          />
        </>
      )}
    </div>
  );
} 