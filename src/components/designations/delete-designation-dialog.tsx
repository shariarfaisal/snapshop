"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDesignations } from "@/hooks/use-designations";
import { Designation } from "@/types/designation";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface DeleteDesignationDialogProps {
  designation: Designation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteDesignationDialog({
  designation,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDesignationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteDesignation } = useDesignations();

  const handleDelete = async () => {
    if (!designation) return;

    try {
      setIsDeleting(true);
      await deleteDesignation(designation.id);
      toast.success("Designation deleted successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete designation");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Delete Designation
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{designation?.name}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
