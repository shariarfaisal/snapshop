"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  Plus, 
  Search, 
  Eye,
  Pencil, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X
} from "lucide-react";
import { toast } from "sonner";
import { FeeStructure, CreateFeeStructureInput, FeeHead, FeeFrequency } from "@/types/finance";
import {
  useFeeStructures,
  useCreateFeeStructure,
  useDeleteFeeStructure,
  useFeeHeads,
} from "@/hooks/use-finance";
import { useSchoolClasses } from "@/hooks/use-school-classes";
import { useAcademicYears } from "@/hooks/use-academic-years";

export default function FeeStructurePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<FeeStructure | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState<CreateFeeStructureInput>({
    name: "",
    academic_year_id: 0,
    class_id: 0,
    frequency: "annual",
    items: [],
  });

  // Build filters
  const feeStructureFilters = {
    search: searchQuery || undefined,
    per_page: 15,
  };

  const feeHeadFilters = {
    is_active: true,
    per_page: 100,
  };

  // Hooks
  const { data: feeStructuresData, isLoading: loading } = useFeeStructures(feeStructureFilters, currentPage);
  const { data: classesData } = useSchoolClasses();
  const { data: academicYearsData } = useAcademicYears();
  const { data: feeHeadsData } = useFeeHeads(feeHeadFilters, 1);
  const createFeeStructureMutation = useCreateFeeStructure();
  const deleteFeeStructureMutation = useDeleteFeeStructure();

  // Derived data
  const feeStructures = feeStructuresData?.data || [];
  const totalPages = feeStructuresData?.last_page || 1;
  const classes = classesData?.data || classesData || [];
  const academicYears = academicYearsData || [];
  const feeHeads = feeHeadsData?.data || [];

  const handleCreate = () => {
    setFormData({
      name: "",
      academic_year_id: 0,
      class_id: 0,
      frequency: "annual",
      items: [],
    });
    setIsDialogOpen(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { fee_head_id: 0, amount: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter fee structure name");
      return;
    }
    if (!formData.class_id) {
      toast.error("Please select a class");
      return;
    }
    if (!formData.academic_year_id) {
      toast.error("Please select academic year");
      return;
    }
    if (formData.items.length === 0) {
      toast.error("Please add at least one fee item");
      return;
    }

    createFeeStructureMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Fee structure created successfully");
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Operation failed");
      },
    });
  };

  const handleViewDetails = (feeStructure: FeeStructure) => {
    setSelectedFeeStructure(feeStructure);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedFeeStructure) return;

    deleteFeeStructureMutation.mutate(selectedFeeStructure.id, {
      onSuccess: () => {
        toast.success("Fee structure deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedFeeStructure(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete");
      },
    });
  };

  const getTotalAmount = (items: any[]) => {
    return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fee Structure</h1>
          <p className="text-muted-foreground mt-1">Manage fee structures</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Fee Structure
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fee structures..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : feeStructures.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No fee structures found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeStructures.map((structure) => (
                    <TableRow key={structure.id}>
                      <TableCell className="font-medium">{structure.name}</TableCell>
                      <TableCell>{structure.school_class?.name || "-"}</TableCell>
                      <TableCell>{structure.academic_year?.name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{structure.frequency}</Badge>
                      </TableCell>
                      <TableCell>{structure.items?.length || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(structure)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedFeeStructure(structure);
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Fee Structure</DialogTitle>
            <DialogDescription>
              Add new fee structure with items
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Class 1 Annual Fee"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: FeeFrequency) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One Time</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="term">Term</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class_id">Class *</Label>
                <Select
                  value={formData.class_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, class_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic_year_id">Academic Year *</Label>
                <Select
                  value={formData.academic_year_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, academic_year_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id.toString()}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fee Items *</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Select
                      value={item.fee_head_id.toString()}
                      onValueChange={(value) => handleItemChange(index, "fee_head_id", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee head" />
                      </SelectTrigger>
                      <SelectContent>
                        {feeHeads.map((head) => (
                          <SelectItem key={head.id} value={head.id.toString()}>
                            {head.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-2">
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleItemChange(index, "amount", parseFloat(e.target.value) || 0)}
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {formData.items.length > 0 && (
                <div className="text-right font-semibold">
                  Total: ${getTotalAmount(formData.items).toFixed(2)}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={createFeeStructureMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createFeeStructureMutation.isPending}>
              {createFeeStructureMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fee Structure Details</DialogTitle>
          </DialogHeader>
          {selectedFeeStructure && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm mt-1">{selectedFeeStructure.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Class</Label>
                  <p className="text-sm mt-1">{selectedFeeStructure.school_class?.name || "-"}</p>
                </div>
                <div>
                  <Label>Frequency</Label>
                  <p className="text-sm mt-1">{selectedFeeStructure.frequency}</p>
                </div>
              </div>
              <div>
                <Label>Fee Items</Label>
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee Head</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedFeeStructure.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.fee_head?.name || "-"}</TableCell>
                        <TableCell className="text-right">${Number(item.amount).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        ${getTotalAmount(selectedFeeStructure.items || []).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Fee Structure</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedFeeStructure?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteFeeStructureMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteFeeStructureMutation.isPending}>
              {deleteFeeStructureMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
