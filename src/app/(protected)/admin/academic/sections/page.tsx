"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Section, CreateSectionInput, UpdateSectionInput } from "@/types/section";
import { useToast } from "@/hooks/use-toast";
import {
  useSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
} from "@/hooks/use-sections";
import { useSchoolClasses } from "@/hooks/use-school-classes";

export default function SectionsPage() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateSectionInput>({
    schoolClassId: 0,
    name: "",
    maxCapacity: 30,
    status: true,
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all-classes");
  const [statusFilter, setStatusFilter] = useState<string>("all-status");
  const [currentPage, setCurrentPage] = useState(1);

  // Build filters
  const sectionFilters = {
    search: searchQuery || undefined,
    schoolClassId: classFilter !== "all-classes" ? parseInt(classFilter) : undefined,
    status: statusFilter === "all-status" ? undefined : statusFilter === "true",
    page: currentPage,
    perPage: 10,
  };

  const classFilters = {
    status: true,
    perPage: 100,
  };

  // Hooks
  const { data: sectionsData, isLoading: loading } = useSections(sectionFilters);
  const { data: classesData, isLoading: loadingClasses } = useSchoolClasses(classFilters);
  const createSectionMutation = useCreateSection();
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();

  // Derived data
  const sections = sectionsData?.data || [];
  const classes = classesData?.data || [];
  const pagination = sectionsData?.pagination || {
    total: 0,
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
  };

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.schoolClassId || !formData.name || !formData.maxCapacity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingSection) {
      updateSectionMutation.mutate(
        { id: editingSection.id, data: formData as UpdateSectionInput },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Section updated successfully",
            });
            setOpenDialog(false);
            resetForm();
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description: error.response?.data?.message || "Failed to update section",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createSectionMutation.mutate(formData, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Section created successfully",
          });
          setOpenDialog(false);
          resetForm();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to create section",
            variant: "destructive",
          });
        },
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingSection) return;

    deleteSectionMutation.mutate(deletingSection.id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Section deleted successfully",
        });
        setOpenDeleteDialog(false);
        setDeletingSection(null);
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to delete section",
          variant: "destructive",
        });
      },
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      schoolClassId: 0,
      name: "",
      maxCapacity: 30,
      status: true,
    });
    setEditingSection(null);
  };

  // Open edit dialog
  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setFormData({
      schoolClassId: section.schoolClassId,
      name: section.name,
      maxCapacity: section.maxCapacity,
      status: section.status,
    });
    setOpenDialog(true);
  };

  // Open delete dialog
  const handleDeleteClick = (section: Section) => {
    setDeletingSection(section);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sections</h1>
          <p className="text-gray-500 mt-1">Manage class sections and divisions</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={classFilter}
              onValueChange={(value) => {
                setClassFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classes">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sections Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Sections ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sections found. Create your first section to get started.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">{section.name}</TableCell>
                        <TableCell>
                          {section.schoolClass?.name || `Class ${section.schoolClassId}`}
                        </TableCell>
                        <TableCell>{section.maxCapacity}</TableCell>
                        <TableCell>
                          <Badge
                            variant={section.status ? "default" : "secondary"}
                            className={
                              section.status
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {section.status ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(section)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(section)}
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
                  {pagination.total} sections
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
            <DialogTitle>{editingSection ? "Edit Section" : "Add Section"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="schoolClassId">
                  Class <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.schoolClassId?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, schoolClassId: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {(() => {
                      console.log("Rendering select - loadingClasses:", loadingClasses);
                      console.log("Rendering select - classes:", classes);
                      console.log("Rendering select - classes.length:", classes.length);
                      return null;
                    })()}
                    {loadingClasses ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="ml-2 text-sm text-gray-500">Loading classes...</span>
                      </div>
                    ) : classes.length === 0 ? (
                      <div className="py-4 text-center text-sm text-gray-500">
                        No classes available (Count: {classes.length})
                      </div>
                    ) : (
                      [...classes]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((schoolClass) => (
                          <SelectItem key={schoolClass.id} value={schoolClass.id.toString()}>
                            {schoolClass.name}
                            {schoolClass.description && (
                              <span className="ml-2 text-xs text-gray-500">
                                - {schoolClass.description}
                              </span>
                            )}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Section Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Section A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxCapacity">
                  Max Capacity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  min="1"
                  placeholder="30"
                  value={formData.maxCapacity}
                  onChange={(e) =>
                    setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })
                  }
                  required
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
                disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSectionMutation.isPending || updateSectionMutation.isPending}>
                {(createSectionMutation.isPending || updateSectionMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSection ? "Update" : "Create"}
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
              This will permanently delete the section &quot;{deletingSection?.name}&quot;. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSection(null)} disabled={deleteSectionMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteSectionMutation.isPending}
            >
              {deleteSectionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
