"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgram, useToast } from "@/hooks";
import { useSubject } from "@/hooks/use-subject";
import { ArrowLeft } from "lucide-react";
import { ProgramWithSubjects } from "@/types/program";
import { useProgramSubjects } from "@/hooks/use-program-subjects";
import { AddSubjectDialog } from "@/components/programs/add-subject-dialog";

export default function AddSubjectToProgramPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const programId = params.id as string;
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);

  const {
    getProgramById,
    invalidateProgramById,
  } = useProgram();

  const { data: program, isLoading } = getProgramById(programId);
  const { data: allSubjects } = useSubject({ limit: 1000, page: 1 });
  const { subjects, isLoading: isSubjectsLoading } = useProgramSubjects(Number(programId), true);

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
          onClick={() => router.push(`/admin/programs/${programId}`)}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Program
        </Button>
        <h1 className="text-3xl font-bold flex-1">Add Subjects to {programWithSubjects.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Subjects</CardTitle>
          <CardDescription>
            Add new subjects to the {programWithSubjects.title} program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={() => setIsAddSubjectDialogOpen(true)}
              className="flex-1"
            >
              Add Single Subject
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddSubjectDialog
        open={isAddSubjectDialogOpen}
        onOpenChange={setIsAddSubjectDialogOpen}
        program={programWithSubjects}
        allSubjects={allSubjects?.data || []}
      />
    </div>
  );
} 