"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, BookOpen, Loader2, Users } from "lucide-react";
import { useSchoolClass } from "@/hooks/use-school-classes";
import {
  useClassSubjects,
  useRemoveClassSubject,
  useBulkRemoveClassSubjects,
} from "@/hooks/use-class-subjects";
import { useSectionsBySchoolClass, useDeleteSection } from "@/hooks/use-sections";
import { SubjectsTable } from "@/components/academics/class-details/subjects-table";
import { SectionsTable } from "@/components/academics/class-details/sections-table";
import { AddSubjectDialog } from "@/components/academics/class-details/add-subject-dialog";
import { CreateSubjectDialog } from "@/components/academics/class-details/create-subject-dialog";
import { EditSubjectDialog } from "@/components/academics/class-details/edit-subject-dialog";
import { AddSectionDialog } from "@/components/academics/class-details/add-section-dialog";
import { EditSectionDialog } from "@/components/academics/class-details/edit-section-dialog";
import { ClassBasicInfoCard } from "@/components/academics/class-details/class-basic-info";
import { ClassStatsCard } from "@/components/academics/class-details/class-stats";
import { useToast } from "@/hooks/use-toast";

interface ClassSubject {
  id: number;
  subject_id: number;
  subject_name: string;
  subject_code: string | null;
  subject_type: string;
  subject_description: string | null;
  teacher_id: number | null;
  teacher_name: string | null;
  credit_hours: number;
  created_at?: string;
  updated_at?: string;
}

interface Section {
  id: number;
  name: string;
  schoolClassId: number;
  maxCapacity: number;
  status: boolean;
  createdAt?: string;
}

export default function ClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const classId = parseInt(params.id as string);
  const { toast } = useToast();

  const [createSubjectOpen, setCreateSubjectOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<ClassSubject | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);

  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);

  const { data: classData, isLoading: classLoading } = useSchoolClass(classId);
  const {
    subjects,
    isLoading: subjectsLoading,
    refetch: refetchSubjects,
  } = useClassSubjects(classId);
  const removeSubjectMutation = useRemoveClassSubject();
  const bulkRemoveSubjectsMutation = useBulkRemoveClassSubjects();

  // Sections queries using proper hooks
  const {
    data: sectionsResponse,
    isLoading: sectionsLoading,
    refetch: refetchSections,
  } = useSectionsBySchoolClass(classId);
  const sections = sectionsResponse?.data || [];
  const deleteSectionMutation = useDeleteSection();

  const schoolClass = classData?.data;

  const handleRemoveSubject = async (subjectId: number) => {
    if (confirm("Are you sure you want to remove this subject from the class?")) {
      removeSubjectMutation.mutate({
        classId,
        classSubjectId: subjectId,
      });
    }
  };

  const handleBulkRemoveSubjects = async () => {
    if (selectedSubjects.length === 0) return;
    if (
      confirm(
        `Are you sure you want to remove ${selectedSubjects.length} subject(s) from the class?`
      )
    ) {
      bulkRemoveSubjectsMutation.mutate(
        {
          classId,
          ids: selectedSubjects,
        },
        {
          onSuccess: () => {
            setSelectedSubjects([]);
            refetchSubjects();
          },
        }
      );
    }
  };

  const handleRemoveSection = (sectionId: number) => {
    if (confirm("Are you sure you want to remove this section?")) {
      deleteSectionMutation.mutate(sectionId, {
        onSuccess: () => {
          toast({ title: "Success", description: "Section deleted successfully" });
          refetchSections();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to delete section",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleBulkRemoveSections = () => {
    if (selectedSections.length === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedSections.length} section(s)?`)) {
      // Since bulk delete isn't in the hooks, we'll need to delete individually
      Promise.all(
        selectedSections.map((id) =>
          fetch(`http://127.0.0.1:8000/api/sections/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          })
        )
      )
        .then(() => {
          toast({ title: "Success", description: "Sections deleted successfully" });
          setSelectedSections([]);
          refetchSections();
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to delete sections",
            variant: "destructive",
          });
        });
    }
  };

  if (classLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!schoolClass) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-lg text-gray-500">Class not found</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{schoolClass.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Class Management & Subjects</p>
          </div>
        </div>
        <Badge variant={schoolClass.status ? "default" : "secondary"}>
          {schoolClass.status ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Basic Info and Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <ClassBasicInfoCard schoolClass={schoolClass} />
        <ClassStatsCard classId={classId} />
      </div>

      {/* Subjects Management */}
      <Tabs defaultValue="subjects" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            Information
          </TabsTrigger>
        </TabsList>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subjects Management</CardTitle>
                <CardDescription>Manage subjects for {schoolClass.name}</CardDescription>
              </div>
              <div className="flex gap-2">
                {selectedSubjects.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkRemoveSubjects}
                    disabled={bulkRemoveSubjectsMutation.isPending}
                  >
                    {bulkRemoveSubjectsMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Remove Selected ({selectedSubjects.length})
                  </Button>
                )}
                <Button size="sm" onClick={() => setCreateSubjectOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Subject
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {subjectsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No subjects assigned yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create or add subjects to this class to get started
                  </p>
                </div>
              ) : (
                <SubjectsTable
                  subjects={subjects as ClassSubject[]}
                  selectedSubjects={selectedSubjects}
                  onSelectSubjects={setSelectedSubjects}
                  onEdit={setEditingSubject}
                  onRemove={handleRemoveSubject}
                  isRemoving={removeSubjectMutation.isPending}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sections Management</CardTitle>
                <CardDescription>Manage sections for {schoolClass.name}</CardDescription>
              </div>
              <div className="flex gap-2">
                {selectedSections.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkRemoveSections}
                    disabled={false}
                  >
                    Remove Selected ({selectedSections.length})
                  </Button>
                )}
                <Button size="sm" onClick={() => setAddSectionOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {sectionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sections.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No sections created yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create sections to organize students in this class
                  </p>
                </div>
              ) : (
                <SectionsTable
                  sections={sections as Section[]}
                  selectedSections={selectedSections}
                  onSelectSections={setSelectedSections}
                  onEdit={setEditingSection}
                  onRemove={handleRemoveSection}
                  isRemoving={deleteSectionMutation.isPending}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-sm mt-1">
                  {schoolClass.description || "No description provided"}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created At</label>
                  {schoolClass.created_at && (
                    <p className="text-sm mt-1">
                      {new Date(schoolClass.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="text-sm mt-1">
                    <Badge variant={schoolClass.status ? "default" : "secondary"}>
                      {schoolClass.status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateSubjectDialog
        open={createSubjectOpen}
        onOpenChange={setCreateSubjectOpen}
        classId={classId}
        onSuccess={() => {
          setCreateSubjectOpen(false);
          refetchSubjects();
        }}
      />

      {editingSubject && (
        <EditSubjectDialog
          open={!!editingSubject}
          onOpenChange={(open) => !open && setEditingSubject(null)}
          classId={classId}
          subject={editingSubject}
          onSuccess={() => {
            setEditingSubject(null);
            refetchSubjects();
          }}
        />
      )}

      <AddSectionDialog
        open={addSectionOpen}
        onOpenChange={setAddSectionOpen}
        classId={classId}
        onSuccess={() => {
          setAddSectionOpen(false);
          refetchSections();
        }}
      />

      {editingSection && (
        <EditSectionDialog
          open={!!editingSection}
          onOpenChange={(open) => !open && setEditingSection(null)}
          classId={classId}
          section={editingSection}
          onSuccess={() => {
            setEditingSection(null);
            refetchSections();
          }}
        />
      )}
    </div>
  );
}
