"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
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
import { ChevronLeft, ChevronRight, Pencil, Key, UserX } from "lucide-react";
import { User } from "@/types/user";
import { useUser, useToast } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { EditUserDialog } from "./edit-user-dialog";
import { DeactivateUserAlert } from "./deactivate-user-alert";
import { isAxiosError } from "axios";

export function UserTable() {
  const { users, isLoading, error, updateUser, deactivateUser, resetPassword, invalidateUsers } = useUser();
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        if (!status) return null;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
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
        );
      },
    },
  ];

  const table = useReactTable({
    data: users?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });


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


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
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