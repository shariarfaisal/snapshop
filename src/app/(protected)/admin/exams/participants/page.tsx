"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Trash2,
  Edit,
  UserCheck,
  Loader2,
} from "lucide-react";
import { ExamParticipant, ParticipantStatus } from "@/types/exam";
import { useToast } from "@/hooks/use-toast";
import {
  useExams,
  useExamParticipantsByExam,
  useExamParticipantStats,
  useRegisterClass,
  useDeleteExamParticipant,
  useUpdateExamParticipant,
} from "@/hooks/use-exams";
import { useAcademicYears, useCurrentAcademicYear } from "@/hooks/use-academic-years";
import { useSchoolClasses } from "@/hooks/use-school-classes";

export default function ExamParticipantsPage() {
  const { toast } = useToast();
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [isRegisterClassDialogOpen, setIsRegisterClassDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Hooks
  const { data: academicYearsData } = useAcademicYears();
  const { data: currentYearData } = useCurrentAcademicYear();
  const { data: examsData, isLoading: loadingExams } = useExams(selectedAcademicYearId ? { academic_year_id: selectedAcademicYearId } : undefined);
  const { data: classesData, isLoading: loadingClasses } = useSchoolClasses({
    status: true,
    perPage: 100,
  });
  const { data: participants = [], isLoading: loadingParticipants } =
    useExamParticipantsByExam(selectedExamId);
  const { data: stats } = useExamParticipantStats(selectedExamId);
  const registerClassMutation = useRegisterClass();
  const deleteParticipantMutation = useDeleteExamParticipant();
  const updateParticipantMutation = useUpdateExamParticipant();

  // Derived data
  const academicYears = Array.isArray(academicYearsData) ? academicYearsData : academicYearsData?.data || [];
  const exams = Array.isArray(examsData) ? examsData : examsData?.data || [];
  const classes = Array.isArray(classesData) ? classesData : classesData?.data || [];

  // Set current academic year as default
  useEffect(() => {
    if (!selectedAcademicYearId && currentYearData) {
      const currentYear = currentYearData?.data || currentYearData;
      if (currentYear?.id) {
        setSelectedAcademicYearId(currentYear.id.toString());
      }
    }
  }, [currentYearData, selectedAcademicYearId]);

  // Set first exam as default when exams load
  useEffect(() => {
    if (exams.length > 0 && selectedExamId === null) {
      setSelectedExamId(exams[0].id);
    }
  }, [exams, selectedExamId]);

  const loading = loadingParticipants;

  const handleRegisterClass = () => {
    if (!selectedExamId || !selectedClassId) {
      toast({
        title: "Error",
        description: "Please select an exam and class",
        variant: "destructive",
      });
      return;
    }

    registerClassMutation.mutate(
      { examId: selectedExamId, classId: parseInt(selectedClassId) },
      {
        onSuccess: (result) => {
          toast({
            title: "Success",
            description: `${
              Array.isArray(result) ? result.length : 0
            } students registered successfully`,
          });
          setIsRegisterClassDialogOpen(false);
          setSelectedClassId("");
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to register class",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteParticipant = (id: number) => {
    if (!confirm("Are you sure you want to remove this participant?")) return;

    deleteParticipantMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Participant removed successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to remove participant",
          variant: "destructive",
        });
      },
    });
  };

  const handleUpdateStatus = (id: number, status: ParticipantStatus) => {
    updateParticipantMutation.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Participant status updated",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update status",
            variant: "destructive",
          });
        },
      }
    );
  };

  const getStatusColor = (status: ParticipantStatus) => {
    switch (status) {
      case "registered":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "disqualified":
        return "bg-orange-100 text-orange-800";
      case "expelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Exam Participants</h1>
          <p className="text-gray-500 mt-1">Register and manage students for examinations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsRegisterClassDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Register Class
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium mb-2 block">Academic Year</label>
              <Select 
                value={selectedAcademicYearId || ""} 
                onValueChange={setSelectedAcademicYearId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year: any) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name || `${year.start_year}-${year.end_year}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium mb-2 block">Select Exam</label>
              <Select 
                value={selectedExamId?.toString() || ""} 
                onValueChange={(v) => setSelectedExamId(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam: any) => (
                    <SelectItem key={exam.id} value={exam.id.toString()}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedExamId && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Registered</p>
                <p className="text-2xl font-bold">{stats?.registered || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <XCircle className="h-8 w-8 text-red-600 mb-2" />
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold">{stats?.absent || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">With Admit Card</p>
                <p className="text-2xl font-bold">{stats?.with_admit_card || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Participants Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Registered Participants</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : participants.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Participants Yet</h3>
                  <p className="mb-4">Register students to start managing participants</p>
                  <Button onClick={() => setIsRegisterClassDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register Students
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Admit Card</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant) => (
                      <TableRow key={participant.id}>
                        <TableCell className="font-medium">{participant.roll_number}</TableCell>
                        <TableCell>
                          {participant.student?.user?.firstName +
                            " " +
                            participant.student?.user?.lastName || "N/A"}
                        </TableCell>
                        <TableCell>{participant.school_class?.name || "N/A"}</TableCell>
                        <TableCell>
                          <Select
                            value={participant.status}
                            onValueChange={(value: ParticipantStatus) =>
                              handleUpdateStatus(participant.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="registered">Registered</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="disqualified">Disqualified</SelectItem>
                              <SelectItem value="expelled">Expelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              participant.admit_card_generated
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {participant.admit_card_generated ? (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Generated
                              </div>
                            ) : (
                              "Not Generated"
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteParticipant(participant.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Register Class Dialog */}
      <Dialog open={isRegisterClassDialogOpen} onOpenChange={setIsRegisterClassDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Class for Exam</DialogTitle>
            <DialogDescription>
              All students from the selected class will be registered for this exam
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="class">Select Class *</Label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {loadingClasses ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      <span className="ml-2 text-sm text-gray-500">Loading classes...</span>
                    </div>
                  ) : classes.length === 0 ? (
                    <div className="py-4 text-center text-sm text-gray-500">
                      No classes available
                    </div>
                  ) : (
                    classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRegisterClassDialogOpen(false)}
              disabled={registerClassMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleRegisterClass} disabled={registerClassMutation.isPending}>
              {registerClassMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {registerClassMutation.isPending ? (
                "Registering..."
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Register Class
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
