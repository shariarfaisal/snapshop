"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgram, useToast } from "@/hooks";
import { Program, ProgramWithSubjects, Subject, CurriculumMapEntry } from "@/types/program";
import { SubjectTable } from "../../../../components/programs/subject-table";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useProgramSubjects } from "@/hooks/use-program-subjects";

export default function CurriculumPage() {
  const { toast } = useToast();
  const [selectedProgramId, setSelectedProgramId] = useState<number | undefined>();
  const [curriculumSubjects, setCurriculumSubjects] = useState<CurriculumMapEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    programs,
    isProgramsLoading,
  } = useProgram();
  const { removeSubject, subjects } = useProgramSubjects(selectedProgramId ?? 0, false);

  const selectedProgram = programs?.find(p => p.id === selectedProgramId);


  const handleSubjectRemove = (subject: Subject) => {
    if (!selectedProgramId) return;
    
    toast({
      title: "Removing subject...",
      description: "Please wait while we process your request",
    });

    removeSubject.mutate({ program_id: selectedProgramId, subject_id: subject.id }, {
      onSuccess: () => {
        setCurriculumSubjects(prev => prev.filter(s => s.id !== subject.id));
        toast({
          title: "Success",
          description: `${subject.name} has been removed from the curriculum`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to remove subject",
          variant: "destructive",
        });
      }
    })
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Curriculum Management</h1>
          <p className="text-gray-500 mt-1">
            View and manage program curricula across the institution
          </p>
        </div>
        <div className="w-full md:w-64">
          <Select
            value={selectedProgramId?.toString() || ""}
            onValueChange={(value) => setSelectedProgramId(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              {programs?.map((program) => (
                <SelectItem key={program.id} value={program.id.toString()}>
                  {program.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedProgramId && (
        <Card>
          <CardHeader>
            <CardTitle>Programs</CardTitle>
            <CardDescription>
              Select a program to view its curriculum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs?.map((program) => (
                <Card key={program.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{program.title}</CardTitle>
                    <CardDescription>{program.level}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">Code: {program.code}</p>
                        <p className="text-sm">Duration: {program.duration_year} years</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedProgramId(program.id)}>
                        View <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedProgramId && isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}

      {selectedProgramId && selectedProgram && !isLoading && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{selectedProgram.title}</h2>
              <p className="text-gray-500">
                {selectedProgram.level} • {selectedProgram.duration_year} years • {selectedProgram.code}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/admin/programs/${selectedProgram.id}/subjects/add`}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Subject
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/admin/programs/${selectedProgram.id}`}>
                  Manage Program <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="by-year" className="space-y-6">
            <TabsList>
              <TabsTrigger value="by-year">View by Year</TabsTrigger>
              <TabsTrigger value="all-subjects">All Subjects</TabsTrigger>
            </TabsList>

            <TabsContent value="all-subjects">
              <Card>
                <CardHeader>
                  <CardTitle>All Subjects</CardTitle>
                  <CardDescription>
                    {curriculumSubjects.length} subjects in total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {curriculumSubjects.length === 0 ? (
                    <div className="text-center p-6">
                      <p className="text-gray-500">No subjects have been added to this program yet</p>
                      <Button asChild className="mt-4">
                        <Link href={`/admin/programs/${selectedProgram.id}/subjects/add`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Subjects
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <SubjectTable
                      subjects={curriculumSubjects}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
} 