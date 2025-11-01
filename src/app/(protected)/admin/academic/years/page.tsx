"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { AcademicYear, CreateAcademicYearRequest } from "@/services/api/academic-year";
import { useToast } from "@/hooks/use-toast";
import {
  useAcademicYears,
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useDeleteAcademicYear,
  useSetCurrentAcademicYear,
} from "@/hooks/use-academic-years";

export default function AcademicYearsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<AcademicYear | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState<CreateAcademicYearRequest>({
    name: "",
    start_date: "",
    end_date: "",
    is_current: false,
  });

  // Hooks
  const { data: academicYears = [], isLoading, error: fetchError } = useAcademicYears();
  const createAcademicYearMutation = useCreateAcademicYear();
  const updateAcademicYearMutation = useUpdateAcademicYear();
  const deleteAcademicYearMutation = useDeleteAcademicYear();
  const setCurrentAcademicYearMutation = useSetCurrentAcademicYear();

  // Client-side filtering and pagination
  const filteredYears = useMemo(() => {
    if (!searchQuery) return academicYears;

    return academicYears.filter((year) =>
      year.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      year.start_date.includes(searchQuery) ||
      year.end_date.includes(searchQuery)
    );
  }, [searchQuery, academicYears]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const error = fetchError ? String(fetchError) : "";

  const handleOpenDialog = (year?: AcademicYear) => {
    if (year) {
      setEditMode(true);
      setSelectedYear(year);
      setFormData({
        name: year.name,
        start_date: year.start_date,
        end_date: year.end_date,
        is_current: year.is_current,
      });
    } else {
      setEditMode(false);
      setSelectedYear(null);
      setFormData({
        name: "",
        start_date: "",
        end_date: "",
        is_current: false,
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedYear(null);
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      is_current: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editMode && selectedYear) {
      updateAcademicYearMutation.mutate(
        { id: selectedYear.id, data: formData },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Academic year updated successfully",
            });
            handleCloseDialog();
          },
          onError: (err: any) => {
            const errorMsg = err?.response?.data?.message || "Failed to update academic year";
            toast({
              title: "Error",
              description: errorMsg,
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createAcademicYearMutation.mutate(formData, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Academic year created successfully",
          });
          handleCloseDialog();
        },
        onError: (err: any) => {
          const errorMsg = err?.response?.data?.message || "Failed to create academic year";
          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleOpenDeleteDialog = (year: AcademicYear) => {
    setYearToDelete(year);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!yearToDelete) return;

    deleteAcademicYearMutation.mutate(yearToDelete.id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Academic year deleted successfully",
        });
        setDeleteDialogOpen(false);
        setYearToDelete(null);
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.message || "Failed to delete academic year";
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      },
    });
  };

  const handleSetCurrent = (id: string) => {
    setCurrentAcademicYearMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Academic year set as current",
        });
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.message || "Failed to set academic year as current";
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredYears.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentYears = filteredYears.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Years</h1>
          <p className="text-gray-500 mt-1">Manage academic year periods</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Academic Year
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by year name or dates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(parseInt(val))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit' : 'Add'} Academic Year</DialogTitle>
              <DialogDescription>
                {editMode ? 'Update the' : 'Create a new'} academic year period for your institution.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Year Name *</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., 2024-2025"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input 
                    id="startDate" 
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input 
                    id="endDate" 
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_current" className="cursor-pointer">Set as current academic year</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleCloseDialog} disabled={createAcademicYearMutation.isPending || updateAcademicYearMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={createAcademicYearMutation.isPending || updateAcademicYearMutation.isPending}>
                {(createAcademicYearMutation.isPending || updateAcademicYearMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  `${editMode ? 'Update' : 'Save'} Academic Year`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredYears.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <p className="text-gray-500">
              {searchQuery ? "No academic years found matching your search." : "No academic years found. Create one to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Academic Years List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead>Year</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentYears.map((year) => (
                      <TableRow key={year.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{year.name}</TableCell>
                        <TableCell>{formatDate(year.start_date)}</TableCell>
                        <TableCell>{formatDate(year.end_date)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              year.is_current
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {year.is_current ? "Current" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!year.is_current && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSetCurrent(year.id)}
                              >
                                Set Current
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDialog(year)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleOpenDeleteDialog(year)}
                              disabled={year.is_current}
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
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, filteredYears.length)}</span> of <span className="font-medium">{filteredYears.length}</span> results
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the academic year <strong>{yearToDelete?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setYearToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
