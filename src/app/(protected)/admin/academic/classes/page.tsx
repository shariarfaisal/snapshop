"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, Loader2, BarChart3 } from "lucide-react";
import {
  SchoolClass,
  CreateSchoolClassInput,
  UpdateSchoolClassInput,
  SchoolClassStats,
} from "@/types/schoolClass";
import { useToast } from "@/hooks/use-toast";
import {
  useSchoolClasses,
  useCreateSchoolClass,
  useUpdateSchoolClass,
  useDeleteSchoolClass,
  useSchoolClassStats,
} from "@/hooks/use-school-classes";

export default function ClassesPage() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [deletingClass, setDeletingClass] = useState<SchoolClass | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateSchoolClassInput>({
    name: "",
    description: "",
    status: true,
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Build filters
  const classFilters = {
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? (statusFilter === "true") : undefined,
    page: currentPage,
    perPage: 10,
  };

  // Hooks
  const { data: classesData, isLoading: loading } = useSchoolClasses(classFilters);
  const { data: selectedClassStats } = useSchoolClassStats(selectedClassId);
  const createClassMutation = useCreateSchoolClass();
  const updateClassMutation = useUpdateSchoolClass();
  const deleteClassMutation = useDeleteSchoolClass();

  // Derived data
  const classes = classesData?.data || [];
  const pagination = classesData?.pagination || {
    total: 0,
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
  };

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a class name",
        variant: "destructive",
      });
      return;
    }

    if (editingClass) {
      updateClassMutation.mutate(
        { id: editingClass.id, data: formData as UpdateSchoolClassInput },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Class updated successfully",
            });
            setOpenDialog(false);
            resetForm();
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description: error.response?.data?.message || "Failed to update class",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createClassMutation.mutate(formData, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Class created successfully",
          });
          setOpenDialog(false);
          resetForm();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to create class",
            variant: "destructive",
          });
        },
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingClass) return;

    deleteClassMutation.mutate(deletingClass.id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Class deleted successfully",
        });
        setOpenDeleteDialog(false);
        setDeletingClass(null);
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete class",
          variant: "destructive",
        });
      },
    });
  };

  // Handle view stats
  const handleViewStats = (classItem: SchoolClass) => {
    setSelectedClassId(classItem.id);
    setOpenStatsDialog(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: true,
    });
    setEditingClass(null);
  };

  // Open edit dialog
  const handleEdit = (classItem: SchoolClass) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description || "",
      status: classItem.status,
    });
    setOpenDialog(true);
  };

  // Open delete dialog
  const handleDeleteClick = (classItem: SchoolClass) => {
    setDeletingClass(classItem);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-500 mt-1">Manage class levels and grades</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Classes ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No classes found. Create your first class to get started.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">{classItem.name}</TableCell>
                        <TableCell>
                          {classItem.description || <span className="text-gray-400">No description</span>}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={classItem.status ? "default" : "secondary"}
                            className={
                              classItem.status
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {classItem.status ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewStats(classItem)}
                              title="View Statistics"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(classItem)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(classItem)}
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
                <div className="text-sm text-gray-500">
                  Showing {(pagination.currentPage - 1) * pagination.perPage + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of{" "}
                  {pagination.total} classes
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === pagination.lastPage}
                    onClick={() => setCurrentPage((p) => Math.min(pagination.lastPage, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClass ? "Edit Class" : "Add Class"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Class Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Grade 10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter class description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status?.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpenDialog(false);
                  resetForm();
                }}
                disabled={createClassMutation.isPending || updateClassMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createClassMutation.isPending || updateClassMutation.isPending}>
                {(createClassMutation.isPending || updateClassMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingClass ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class &quot;{deletingClass?.name}&quot;. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingClass(null)} disabled={deleteClassMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteClassMutation.isPending}
            >
              {deleteClassMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Statistics Dialog */}
      <Dialog open={openStatsDialog} onOpenChange={setOpenStatsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Class Statistics</DialogTitle>
          </DialogHeader>
          {selectedClassStats && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Sections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedClassStats.totalSections}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Active Sections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedClassStats.activeSections}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedClassStats.totalStudents}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Active Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedClassStats.activeStudents}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setOpenStatsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
