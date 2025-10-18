"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgram, useToast } from "@/hooks";
import { useSubject } from "@/hooks/use-subject";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import { SubjectTable } from "../../../../../components/programs/subject-table";
import { AddSubjectDialog } from "../../../../../components/programs/add-subject-dialog";
import { EditProgramDialog } from "../../../../../components/programs/edit-program-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProgramWithSubjects, CurriculumMapEntry } from "@/types/program";
import { useProgramSubjects } from "@/hooks/use-program-subjects";

export default function ProgramDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const programId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    getProgramById,
    updateProgram,
    deleteProgram,
    invalidateProgramById,
  } = useProgram();

  const { data: program, isLoading } = getProgramById(programId);
  const { data: allSubjects } = useSubject({ limit: 1000, page: 1 });
  const { subjects, isLoading: isSubjectsLoading } = useProgramSubjects(Number(programId), true);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    if (!program) return;
    
    deleteProgram.mutate(program.id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Program deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        router.push("/admin/programs");
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

  if (isLoading || isSubjectsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Program not found</h2>
          <Button 
            variant="link" 
            className="mt-4"
            onClick={() => router.push("/admin/programs")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Programs
          </Button>
        </div>
      </div>
    );
  }

  const programWithSubjects = {
    ...program,
    subjects: subjects || []
  } as ProgramWithSubjects;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin/programs")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold flex-1">{programWithSubjects.title}</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleEdit}
            className="ml-2"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Program
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Program
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
              <CardDescription>
                Information about the {programWithSubjects.title} program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Program Code</h3>
                  <p className="mt-1">{programWithSubjects.code}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Level</h3>
                  <p className="mt-1">{programWithSubjects.level}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                  <p className="mt-1">{programWithSubjects.duration_year} years</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Subjects</h3>
                  <p className="mt-1">{programWithSubjects.subjects?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subjects</CardTitle>
                <CardDescription>
                  All subjects in the {programWithSubjects.title} program
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setIsAddSubjectDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <SubjectTable
                subjects={programWithSubjects.subjects as CurriculumMapEntry[]}
                program={programWithSubjects}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditProgramDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        program={programWithSubjects}
        onSubmit={(data) =>
          updateProgram.mutate(
            { id: programWithSubjects.id, data },
            {
              onSuccess: () => {
                toast({
                  title: "Success",
                  description: "Program updated successfully",
                });
                setIsEditDialogOpen(false);
                invalidateProgramById(programId);
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

      <AddSubjectDialog
        open={isAddSubjectDialogOpen}
        onOpenChange={setIsAddSubjectDialogOpen}
        program={programWithSubjects}
        allSubjects={allSubjects?.data || []}
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
            Are you sure you want to delete this program? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 