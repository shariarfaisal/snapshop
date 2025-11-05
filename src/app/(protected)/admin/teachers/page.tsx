"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useTeachers, useDeleteTeacher } from "@/hooks/use-teacher";
import { teacherService } from "@/services/teacher";
import { useQuery } from "@tanstack/react-query";

export default function TeachersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [deleteTeacherId, setDeleteTeacherId] = useState<number | null>(null);

  const { data: teachersData, isLoading } = useTeachers(
    {
      search,
      department_id: departmentFilter ? parseInt(departmentFilter) : undefined,
      per_page: 15,
    },
    page
  );

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => teacherService.getDepartments(),
  });

  const deleteMutation = useDeleteTeacher();

  const handleDeleteConfirm = async () => {
    if (!deleteTeacherId) return;

    try {
      await deleteMutation.mutateAsync(deleteTeacherId);
      toast.success("Teacher deleted successfully");
      setDeleteTeacherId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete teacher");
    }
  };

  const teachers = teachersData?.data || [];
  const pagination = {
    total: teachersData?.total || 0,
    per_page: teachersData?.per_page || 15,
    current_page: teachersData?.current_page || 1,
    last_page: teachersData?.last_page || 1,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-gray-600">Manage all teachers in the system</p>
        </div>
        <Button onClick={() => router.push("/admin/teachers/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or employee ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>

            <Select
              value={departmentFilter}
              onValueChange={(value) => {
                setDepartmentFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No teachers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: "40px" }} className="whitespace-nowrap">
                      #
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Name</TableHead>
                    <TableHead className="whitespace-nowrap">Email</TableHead>
                    <TableHead className="whitespace-nowrap">Employee ID</TableHead>
                    <TableHead className="whitespace-nowrap">Department</TableHead>
                    <TableHead className="whitespace-nowrap">Designation</TableHead>
                    <TableHead className="whitespace-nowrap">Joining Date</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher: any, index: number) => (
                    <TableRow key={teacher.id}>
                      <TableCell
                        style={{ width: "40px" }}
                        className="whitespace-nowrap text-gray-500"
                      >
                        {(page - 1) * 15 + index + 1}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        {teacher.user
                          ? `${teacher.user.firstName} ${teacher.user.lastName}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {teacher.user?.email || "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-sm">
                        {teacher.employeeId || "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {teacher.department?.name || "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {teacher.designation?.name || "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {teacher.joiningDate ? formatDate(teacher.joiningDate) : "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge className={getStatusBadge(teacher.user?.status || "active")}>
                          {teacher.user?.status || "active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/teachers/${teacher.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/teachers/${teacher.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTeacherId(teacher.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * 15 + 1} to {Math.min(page * 15, pagination.total)} of{" "}
            {pagination.total}
            teachers
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={page === pagination.last_page}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteTeacherId !== null}
        onOpenChange={(open) => !open && setDeleteTeacherId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this teacher? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
