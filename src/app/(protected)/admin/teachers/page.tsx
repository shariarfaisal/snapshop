"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Eye, Pencil, Trash2, Download, Upload, Loader2, X } from "lucide-react";
import { teacherService } from "@/services/teacher";
import type { Teacher, Department, Designation, TeacherFormData } from "@/types/teacher";
import { useToast } from "@/hooks/use-toast";
import { TeacherFormDialog } from "@/components/teachers/TeacherFormDialog";
import { TeacherViewDialog } from "@/components/teachers/TeacherViewDialog";
import { TeacherDeleteDialog } from "@/components/teachers/TeacherDeleteDialog";

export default function TeachersPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [designationFilter, setDesignationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialogs
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Form data
  const [formData, setFormData] = useState<TeacherFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    department_id: undefined,
    designation_id: undefined,
    qualification: "",
    experience: undefined,
    joining_date: "",
    status: "active",
  });

  // Load initial data
  useEffect(() => {
    loadTeachers();
    loadDepartments();
    loadDesignations();
  }, [currentPage, searchQuery, departmentFilter, designationFilter, statusFilter]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: currentPage,
        per_page: perPage,
      };

      if (searchQuery) filters.search = searchQuery;
      if (departmentFilter !== "all") filters.department_id = parseInt(departmentFilter);
      if (designationFilter !== "all") filters.designation_id = parseInt(designationFilter);
      if (statusFilter !== "all") filters.status = statusFilter;

      const response = await teacherService.getTeachers(filters);
      setTeachers(response.data);
      setTotalTeachers(response.total);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load teachers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const deps = await teacherService.getDepartments({ status: "true", per_page: "all" });
      setDepartments(deps);
    } catch (error) {
      console.error("Failed to load departments:", error);
    }
  };

  const loadDesignations = async () => {
    try {
      const desigs = await teacherService.getDesignations({ status: "true", per_page: "all" });
      setDesignations(desigs);
    } catch (error) {
      console.error("Failed to load designations:", error);
    }
  };

  const handleAddTeacher = async () => {
    try {
      setLoading(true);
      await teacherService.createTeacher(formData);
      toast({
        title: "Success",
        description: "Teacher added successfully",
      });
      setShowAddDialog(false);
      resetForm();
      loadTeachers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add teacher",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeacher = async () => {
    if (!selectedTeacher) return;
    
    try {
      setLoading(true);
      await teacherService.updateTeacher(selectedTeacher.id, formData);
      toast({
        title: "Success",
        description: "Teacher updated successfully",
      });
      setShowEditDialog(false);
      resetForm();
      loadTeachers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update teacher",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;
    
    try {
      setLoading(true);
      await teacherService.deleteTeacher(selectedTeacher.id);
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
      setShowDeleteDialog(false);
      setSelectedTeacher(null);
      loadTeachers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete teacher",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewTeacher = async (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowViewDialog(true);
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      first_name: teacher.firstName,
      last_name: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone || "",
      address: teacher.address || "",
      department_id: teacher.departmentId,
      designation_id: teacher.designationId,
      qualification: teacher.qualification || "",
      experience: teacher.experience,
      joining_date: teacher.joiningDate || "",
      status: teacher.status,
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      department_id: undefined,
      designation_id: undefined,
      qualification: "",
      experience: undefined,
      joining_date: "",
      status: "active",
    });
    setSelectedTeacher(null);
  };

  const getStatusColor = (status: string) => {
    if (status === "active" || status === "true") {
      return "bg-green-100 text-green-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    if (status === "active" || status === "true") return "Active";
    return "Inactive";
  };

  const handleExport = async () => {
    try {
      const blob = await teacherService.exportTeachers({
        search: searchQuery,
        department_id: departmentFilter !== "all" ? parseInt(departmentFilter) : undefined,
        designation_id: designationFilter !== "all" ? parseInt(designationFilter) : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `teachers_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export teachers",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-500 mt-1">Manage teaching staff and assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search teachers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={designationFilter} onValueChange={setDesignationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {designations.map((desig) => (
                  <SelectItem key={desig.id} value={desig.id.toString()}>
                    {desig.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="true">Active (Legacy)</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers List ({totalTeachers})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No teachers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.employeeId}</TableCell>
                        <TableCell>{`${teacher.firstName} ${teacher.lastName}`}</TableCell>
                        <TableCell>{teacher.department?.name || "-"}</TableCell>
                        <TableCell>{teacher.designation?.name || "-"}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.phone || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(teacher.status)}>
                            {getStatusLabel(teacher.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewTeacher(teacher)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(teacher)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleDeleteClick(teacher)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalTeachers > perPage && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, totalTeachers)} of {totalTeachers} teachers
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage * perPage >= totalTeachers}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Teacher Dialog */}
      <TeacherFormDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) resetForm();
        }}
        title="Add New Teacher"
        description="Enter the details of the new teacher below."
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleAddTeacher}
        loading={loading}
        departments={departments}
        designations={designations}
      />

      {/* Edit Teacher Dialog */}
      <TeacherFormDialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) resetForm();
        }}
        title="Edit Teacher"
        description="Update the teacher's information below."
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleEditTeacher}
        loading={loading}
        departments={departments}
        designations={designations}
        isEdit
      />

      {/* View Teacher Dialog */}
      <TeacherViewDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        teacher={selectedTeacher}
      />

      {/* Delete Confirmation Dialog */}
      <TeacherDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        teacher={selectedTeacher}
        onConfirm={handleDeleteTeacher}
        loading={loading}
      />
    </div>
  );
}
