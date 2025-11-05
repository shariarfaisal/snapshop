"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Download,
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  UserCheck,
  UserX,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { Student, StudentFilters } from "@/types/student";
import { StudentFormDialog } from "@/components/students/student-form-dialog";
import { StudentDetailsDialog } from "@/components/students/student-details-dialog";
import { useRouter } from "next/navigation";
import {
  useStudents,
  useDeleteStudent,
  useBulkUpdateStudentStatus,
  useBulkAssignClass,
  useExportStudents,
  useStudentStatistics,
} from "@/hooks/use-student";
import { useSchoolClasses } from "@/hooks/use-school-classes";
import { useSectionsBySchoolClass } from "@/hooks/use-sections";

export default function StudentsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filters, setFilters] = useState<StudentFilters>({
    search: "",
    class_id: "all",
    section_id: "all",
    status: "all",
    per_page: 15,
  });

  // Dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Bulk operations
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"status" | "class" | null>(null);

  // Hooks
  const { data: studentsData, isLoading: loading } = useStudents(filters, currentPage);
  const { data: statistics } = useStudentStatistics();
  const { data: classesData } = useSchoolClasses();
  const { data: sectionsData } = useSectionsBySchoolClass(
    filters.class_id !== "all" ? parseInt(filters.class_id as string) : null
  );
  const deleteStudentMutation = useDeleteStudent();
  const bulkUpdateStatusMutation = useBulkUpdateStudentStatus();
  const bulkAssignClassMutation = useBulkAssignClass();
  const exportStudentsMutation = useExportStudents();

  // Derived data
  const students = studentsData?.data || [];
  const totalPages = studentsData?.last_page || 1;
  const total = studentsData?.total || 0;
  const classes = classesData?.data || classesData || [];
  const sections = sectionsData?.data || sectionsData || [];

  const handleDelete = async () => {
    if (!selectedStudent) return;

    deleteStudentMutation.mutate(selectedStudent.id, {
      onSuccess: () => {
        toast.success("Student deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedStudent(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete student");
      },
    });
  };

  const handleExport = async () => {
    exportStudentsMutation.mutate(filters, {
      onSuccess: (data) => {
        // Convert to CSV
        const headers = Object.keys(data[0] || {});
        const csv = [
          headers.join(","),
          ...data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
        ].join("\n");

        // Download
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `students_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();

        toast.success("Students exported successfully");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to export students");
      },
    });
  };

  const handleBulkAction = async (action: "status" | "class", value: any) => {
    if (selectedStudents.length === 0) {
      toast.error("Please select students first");
      return;
    }

    if (action === "status") {
      bulkUpdateStatusMutation.mutate(
        { studentIds: selectedStudents, status: value },
        {
          onSuccess: () => {
            toast.success(`${selectedStudents.length} students updated`);
            setSelectedStudents([]);
            setBulkActionDialogOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to perform bulk action");
          },
        }
      );
    } else if (action === "class") {
      bulkAssignClassMutation.mutate(
        { studentIds: selectedStudents, classId: value.classId, sectionId: value.sectionId },
        {
          onSuccess: () => {
            toast.success(`${selectedStudents.length} students assigned`);
            setSelectedStudents([]);
            setBulkActionDialogOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to perform bulk action");
          },
        }
      );
    }
  };

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const toggleAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
      graduated: "bg-blue-100 text-blue-800",
      withdrawn: "bg-orange-100 text-orange-800",
    };
    return variants[status] || variants.inactive;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">Manage student registrations and profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-2xl font-bold">{statistics.active}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Inactive</p>
                  <p className="text-2xl font-bold">{statistics.inactive}</p>
                </div>
                <UserX className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Graduated</p>
                  <p className="text-2xl font-bold">{statistics.graduated}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, search: e.target.value }));
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={filters.class_id?.toString() || "all"}
              onValueChange={(value) => {
                setFilters((prev) => ({ ...prev, class_id: value, section_id: "all" }));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes
                  .filter((cls) => cls.id && cls.id.toString().trim() !== "")
                  .map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.section_id?.toString() || "all"}
              onValueChange={(value) => {
                setFilters((prev) => ({ ...prev, section_id: value }));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections
                  .filter((sec) => sec.id && sec.id.toString().trim() !== "")
                  .map((sec) => (
                    <SelectItem key={sec.id} value={sec.id.toString()}>
                      {sec.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status?.toString() || "all"}
              onValueChange={(value) => {
                setFilters((prev) => ({ ...prev, status: value as any }));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{selectedStudents.length} student(s) selected</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBulkAction("status");
                    setBulkActionDialogOpen(true);
                  }}
                >
                  Change Status
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBulkAction("class");
                    setBulkActionDialogOpen(true);
                  }}
                >
                  Assign Class
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedStudents([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No students found</div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: "40px" }} className="whitespace-nowrap">
                        <Checkbox
                          checked={
                            selectedStudents.length === students.length && students.length > 0
                          }
                          onCheckedChange={toggleAllStudents}
                        />
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Name</TableHead>
                      <TableHead className="whitespace-nowrap">Admission No.</TableHead>
                      <TableHead className="whitespace-nowrap">Class</TableHead>
                      <TableHead className="whitespace-nowrap">Phone</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell style={{ width: "40px" }} className="whitespace-nowrap">
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudentSelection(student.id)}
                          />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div>
                            <p className="font-medium">
                              {student.user
                                ? `${student.user.firstName} ${student.user.lastName}`
                                : "N/A"}
                            </p>
                            {student.section && (
                              <p className="text-xs text-gray-500">{student.section.name}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">
                          {student.admissionNumber || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {student.school_class?.name || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {student.user?.phone || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge className={getStatusBadge(student.status)}>{student.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedStudent(student);
                                router.push(`/admin/students/${student.id}`);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                router.push(`/admin/students/${student.id}/edit`);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedStudent(student);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * (filters.per_page || 15) + 1} to{" "}
                  {Math.min(currentPage * (filters.per_page || 15), total)} of {total} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <StudentFormDialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setSelectedStudent(null);
          }
        }}
        student={undefined}
        onSuccess={() => {
          // Data will auto-refetch via React Query
        }}
      />

      {/* Details Dialog */}
      {/* Removed - using dedicated page instead */}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Dialog - simplified for now */}
      <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{bulkAction === "status" ? "Change Status" : "Assign Class"}</DialogTitle>
            <DialogDescription>
              This will affect {selectedStudents.length} selected student(s).
            </DialogDescription>
          </DialogHeader>
          {/* Add bulk action form here */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
