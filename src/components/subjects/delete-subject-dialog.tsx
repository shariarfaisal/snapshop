"use client";

import { Button } from "@/components/ui/button";
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
import { useSubjects } from "@/hooks/use-subjects";
import { Subject } from "@/types/subject";

interface DeleteSubjectDialogProps {
  subject: Subject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeleteSubjectDialog = ({
  subject,
  open,
  onOpenChange,
  onSuccess,
}: DeleteSubjectDialogProps) => {
  const { deleteSubject, isDeleting } = useSubjects();

  const handleDelete = async () => {
    if (!subject) return;

    try {
      await deleteSubject(subject.id);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  if (!subject) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{subject.name}</strong>
            {subject.code && ` (${subject.code})`}? This action cannot be undone.
            <br /><br />
            Note: You cannot delete a subject that is assigned to classes or exams.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
