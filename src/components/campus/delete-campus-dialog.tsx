"use client"

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Campus } from "@/types/campus";
import { useToast, useCampus } from "@/hooks";
import { isAxiosError } from "axios";

interface DeleteCampusDialogProps {
  children: React.ReactNode;
  campus: Campus;
}

export function DeleteCampusDialog({ children, campus }: DeleteCampusDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { deleteCampus, invalidateCampuses } = useCampus()

  const onDelete = () => {
    deleteCampus.mutate(campus.id, {
      onSuccess: () => {
        invalidateCampuses()
        setOpen(false)
        toast({
          title: "Success",
          description: "Campus deleted successfully",
        })
      },
      onError: (err) => {
        const msg = isAxiosError(err) ? err.response?.data?.error || "Failed to delete campus" : "Failed to delete campus"
        toast({
          title: "Error",
          description: msg,
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Campus</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the campus "{campus.name}"? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={deleteCampus.isPending}
          >
            {deleteCampus.isPending ? "Deleting..." : "Delete Campus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 