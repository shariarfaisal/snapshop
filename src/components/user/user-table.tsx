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
import { ChevronLeft, ChevronRight, Pencil, Key, UserX, Shield } from "lucide-react";
import { User } from "@/types/user";
import { useUser, useToast } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { EditUserDialog } from "./edit-user-dialog";
import { DeactivateUserAlert } from "./deactivate-user-alert";
import { ResetPasswordDialog } from "./reset-password-dialog";
import { isAxiosError } from "axios";

export function UserTable() {
  const { users, isLoading, error, updateUser, deactivateUser, invalidateUsers } = useUser();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading users</p>
      </div>
    );
  }

  if (!users?.data?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
  };

  const handleDeactivate = (user: User) => {
    setSelectedUser(user);
    setIsDeactivateDialogOpen(true);
  };


  const handleUpdateUser = (id: string, data: any) => {
    updateUser.mutate({ id, data }, {
      onSuccess: () => {
        invalidateUsers();
        setIsEditDialogOpen(false);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      },
      onError: (err) => {
        const msg = isAxiosError(err) 
          ? err.response?.data?.error || "Failed to update user" 
          : "Failed to update user";
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      }
    });
  };

  const handleDeactivateUser = (id: string) => {
    deactivateUser.mutate(id, {
      onSuccess: () => {
        invalidateUsers();
        setIsDeactivateDialogOpen(false);
        toast({
          title: "Success",
          description: "User deactivated successfully",
        });
      },
      onError: (err) => {
        const msg = isAxiosError(err) 
          ? err.response?.data?.error || "Failed to deactivate user" 
          : "Failed to deactivate user";
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      }
    });
  };

  // Filter users based on search query
  const filteredUsers = users?.data.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Paginate users
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role_label}</TableCell>
                  <TableCell>
                    {user.status && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleResetPassword(user)}>
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeactivate(user)}>
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
      
      {selectedUser && (
        <>
          <EditUserDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            user={selectedUser}
            onSubmit={(data) => handleUpdateUser(selectedUser.id, data)}
          />

          <ResetPasswordDialog 
            open={isResetPasswordDialogOpen}
            onOpenChange={setIsResetPasswordDialogOpen}
            user={selectedUser}
          />

          <DeactivateUserAlert
            open={isDeactivateDialogOpen}
            onOpenChange={setIsDeactivateDialogOpen}
            user={selectedUser}
            onConfirm={() => handleDeactivateUser(selectedUser.id)}
          />
        </>
      )}
    </div>
  );
} 