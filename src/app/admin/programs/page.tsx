"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgramList } from "../../../../components/programs/program-list";
import { AddProgramDialog } from "../../../../components/programs/add-program-dialog";
import { EditProgramDialog } from "../../../../components/programs/edit-program-dialog";
import { ManageSubjectsDialog } from "../../../../components/programs/manage-subjects-dialog";
import { useToast, useProgram } from "@/hooks";
import { Program } from "@/types/program";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";

export default function ProgramsPage() {
  const { toast } = useToast();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageSubjectsDialogOpen, setIsManageSubjectsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const {
    programs,
    isProgramsLoading,
    createProgram,
    updateProgram,
    deleteProgram,
    invalidatePrograms
  } = useProgram();

  const handleEdit = (program: Program) => {
    setSelectedProgram(program);
    setIsEditDialogOpen(true);
  };

  const handleManageSubjects = (program: Program) => {
    setSelectedProgram(program);
    setIsManageSubjectsDialogOpen(true);
  };

  const handleDelete = (program: Program) => {
    deleteProgram.mutate(program.id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Program deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        invalidatePrograms();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete program",
          variant: "destructive",
        });
      },
    });
  };

  if (isProgramsLoading) {
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
        onDelete={(program) => {
          setSelectedProgram(program);
          setIsDeleteDialogOpen(true);
        }}
        onManageSubjects={handleManageSubjects}
      />

      <AddProgramDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => 
          createProgram.mutate(data, {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Program created successfully",
              });
              setIsAddDialogOpen(false);
            },
            onError: () => {
              toast({
                title: "Error",
                description: "Failed to create program",
                variant: "destructive",
              });
            },
          })
        }
      />

      {selectedProgram && (
        <>
          <EditProgramDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            program={selectedProgram}
            onSubmit={(data) =>
              updateProgram.mutate(
                { id: selectedProgram.id, data },
                {
                  onSuccess: () => {
                    toast({
                      title: "Success",
                      description: "Program updated successfully",
                    });
                    setIsEditDialogOpen(false);
                  },
                  onError: () => {
                    toast({
                      title: "Error",
                      description: "Failed to update program",
                      variant: "destructive",
                    });
                  },
                }
              )
            }
          />

          <ManageSubjectsDialog
            open={isManageSubjectsDialogOpen}
            onOpenChange={setIsManageSubjectsDialogOpen}
            program={selectedProgram}
          />


          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Program</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to delete this program?
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleDelete(selectedProgram)}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
} 