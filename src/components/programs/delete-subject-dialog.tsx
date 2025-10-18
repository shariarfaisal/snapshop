"use client";

import { CurriculumMapEntry, Program } from "@/types/program";
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
import { useToast } from "@/hooks";
import { useProgramSubjects } from "@/hooks/use-program-subjects";

interface DeleteSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program;
  subject: CurriculumMapEntry;
}

export function DeleteSubjectDialog({
  open,
  onOpenChange,
  program,
  subject,
}: DeleteSubjectDialogProps) {
  const { toast } = useToast();
  const { removeSubject } = useProgramSubjects(program.id, false);

  const handleDelete = () => {
    removeSubject.mutate(
      { program_id: program.id, subject_id: subject.subjectId },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Subject removed successfully",
          });
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to remove subject",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove this subject?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to remove <strong>{subject.name} ({subject.code})</strong> from{" "}
            <strong>{program.title}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 