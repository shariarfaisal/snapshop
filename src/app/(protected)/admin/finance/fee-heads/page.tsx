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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { FeeHead, CreateFeeHeadInput } from "@/types/finance";
import {
  useFeeHeads,
  useCreateFeeHead,
  useUpdateFeeHead,
  useDeleteFeeHead,
} from "@/hooks/use-finance";

export default function FeeHeadsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFeeHead, setSelectedFeeHead] = useState<FeeHead | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState<CreateFeeHeadInput>({
    name: "",
    code: "",
    description: "",
    is_active: true,
  });

  // Build filters
  const feeHeadFilters = {
    search: searchQuery || undefined,
    per_page: 15,
  };

  // Hooks
  const { data: feeHeadsData, isLoading: loading } = useFeeHeads(feeHeadFilters, currentPage);
  const createFeeHeadMutation = useCreateFeeHead();
  const updateFeeHeadMutation = useUpdateFeeHead();
  const deleteFeeHeadMutation = useDeleteFeeHead();

  // Derived data
  const feeHeads = feeHeadsData?.data || [];
  const totalPages = feeHeadsData?.last_page || 1;

  const handleCreate = () => {
    setIsEditMode(false);
    setFormData({ name: "", code: "", description: "", is_active: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (feeHead: FeeHead) => {
    setIsEditMode(true);
    setSelectedFeeHead(feeHead);
    setFormData({
      name: feeHead.name,
      code: feeHead.code || "",
      description: feeHead.description || "",
      is_active: feeHead.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter fee head name");
      return;
    }

    if (isEditMode && selectedFeeHead) {
      updateFeeHeadMutation.mutate(
        { id: selectedFeeHead.id, data: formData },
        {
          onSuccess: () => {
            toast.success("Fee head updated successfully");
            setIsDialogOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update fee head");
          },
        }
      );
    } else {
      createFeeHeadMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Fee head created successfully");
          setIsDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to create fee head");
        },
      });
    }
  };

  const handleDelete = () => {
    if (!selectedFeeHead) return;

    deleteFeeHeadMutation.mutate(selectedFeeHead.id, {
      onSuccess: () => {
        toast.success("Fee head deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedFeeHead(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete fee head");
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fee Heads</h1>
          <p className="text-muted-foreground mt-1">Manage fee categories</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Fee Head
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fee heads..."
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
          ) : feeHeads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No fee heads found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeHeads.map((feeHead) => (
                    <TableRow key={feeHead.id}>
                      <TableCell className="font-medium">{feeHead.name}</TableCell>
                      <TableCell>{feeHead.code || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {feeHead.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={feeHead.is_active ? "default" : "secondary"}>
                          {feeHead.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(feeHead)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedFeeHead(feeHead);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit" : "Create"} Fee Head</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update" : "Add"} fee head details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Tuition Fee"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., TF001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={createFeeHeadMutation.isPending || updateFeeHeadMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createFeeHeadMutation.isPending || updateFeeHeadMutation.isPending}>
              {(createFeeHeadMutation.isPending || updateFeeHeadMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Fee Head</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedFeeHead?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteFeeHeadMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteFeeHeadMutation.isPending}>
              {deleteFeeHeadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
