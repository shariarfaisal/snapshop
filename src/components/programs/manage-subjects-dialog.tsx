import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Program, Subject } from "@/types/program";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { programService } from "@/services/program";
import { useToast } from "@/hooks";
import { SubjectTable } from "./subject-table";
import { AddSubjectDialog } from "./add-subject-dialog";

interface ManageSubjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program;
}

export function ManageSubjectsDialog({
  open,
  onOpenChange,
  program,
}: ManageSubjectsDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);

  const { data: subjects, isLoading } = useQuery({
    queryKey: ["subjects", program.id],
    queryFn: () => programService.getSubjects(program.id),
  });

  const removeSubjectMutation = useMutation({
    mutationFn: (subjectId: string) =>
      programService.removeSubject(program.id, subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects", program.id] });
      toast({
        title: "Success",
        description: "Subject removed from program",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove subject",
        variant: "destructive",
      });
    },
  });

  const handleRemoveSubject = (subject: Subject) => {
    if (window.confirm("Are you sure you want to remove this subject?")) {
      removeSubjectMutation.mutate(subject.id);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Subjects - {program.title}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Subjects - {program.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsAddSubjectDialogOpen(true)}>
                Add Subject
              </Button>
            </div>
            <SubjectTable
              subjects={subjects || []}
              onRemove={handleRemoveSubject}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AddSubjectDialog
        open={isAddSubjectDialogOpen}
        onOpenChange={setIsAddSubjectDialogOpen}
        program={program}
      />
    </>
  );
} 