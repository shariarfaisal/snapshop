"use client"

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
import { useProgram } from "@/hooks/use-program";
import { useProgramSubjects } from "@/hooks/use-program-subjects";
import { useSubject } from "@/hooks/use-subject";
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
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const { subjects, isLoading } = useProgramSubjects(program.id, true)
  const { data: allSubjects } = useSubject({ limit: 1000, page: 1 })

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
              program={program}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AddSubjectDialog
        open={isAddSubjectDialogOpen}
        onOpenChange={setIsAddSubjectDialogOpen}
        program={program}
        allSubjects={allSubjects?.data || []}
      />
    </>
  );
} 