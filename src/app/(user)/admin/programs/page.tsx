"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgramList } from "../../../../components/programs/program-list";
import { AddProgramDialog } from "../../../../components/programs/add-program-dialog";
import { EditProgramDialog } from "../../../../components/programs/edit-program-dialog";
import { ManageSubjectsDialog } from "../../../../components/programs/manage-subjects-dialog";
import { useToast } from "@/hooks";
import { programService } from "@/services/program";
import { Program } from "@/types/program";

export default function ProgramsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageSubjectsDialogOpen, setIsManageSubjectsDialogOpen] = useState(false);

  const { data: programs, isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: programService.getAll,
  });

  const createProgramMutation = useMutation({
    mutationFn: programService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast({
        title: "Success",
        description: "Program created successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create program",
        variant: "destructive",
      });
    },
  });

  const updateProgramMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      programService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast({
        title: "Success",
        description: "Program updated successfully",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update program",
        variant: "destructive",
      });
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: (id: string) => programService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast({
        title: "Success",
        description: "Program deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (program: Program) => {
    setSelectedProgram(program);
    setIsEditDialogOpen(true);
  };

  const handleManageSubjects = (program: Program) => {
    setSelectedProgram(program);
    setIsManageSubjectsDialogOpen(true);
  };

  const handleDelete = (program: Program) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      deleteProgramMutation.mutate(program.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Programs</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      <ProgramList
        programs={programs || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageSubjects={handleManageSubjects}
      />

      <AddProgramDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => createProgramMutation.mutate(data)}
      />

      {selectedProgram && (
        <>
          <EditProgramDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            program={selectedProgram}
            onSubmit={(data) =>
              updateProgramMutation.mutate({ id: selectedProgram.id, data })
            }
          />

          <ManageSubjectsDialog
            open={isManageSubjectsDialogOpen}
            onOpenChange={setIsManageSubjectsDialogOpen}
            program={selectedProgram}
          />
        </>
      )}
    </div>
  );
} 