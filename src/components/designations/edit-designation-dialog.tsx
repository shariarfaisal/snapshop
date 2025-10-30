"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDesignations } from "@/hooks/use-designations";
import { useDepartments } from "@/hooks/use-departments";
import { Designation } from "@/types/designation";
import { toast } from "sonner";

interface EditDesignationDialogProps {
  designation: Designation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditDesignationDialog({
  designation,
  open,
  onOpenChange,
  onSuccess,
}: EditDesignationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateDesignation } = useDesignations();
  const { departments } = useDepartments({ per_page: 'all' });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    departmentId: "",
  });

  useEffect(() => {
    if (designation) {
      setFormData({
        name: designation.name,
        description: designation.description || "",
        departmentId: designation.departmentId.toString(),
      });
    }
  }, [designation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!designation) return;
    
    if (!formData.name.trim()) {
      toast.error("Designation name is required");
      return;
    }

    if (!formData.departmentId) {
      toast.error("Department is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateDesignation(designation.id, {
        name: formData.name,
        description: formData.description || undefined,
        departmentId: parseInt(formData.departmentId),
      });
      toast.success("Designation updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update designation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Designation</DialogTitle>
            <DialogDescription>
              Update designation information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Designation Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Assistant Professor"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, departmentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Designation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
