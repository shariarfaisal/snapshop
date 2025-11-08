"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useExams, useExamSubjects } from "@/hooks/use-exams";
import { useAcademicYears, useCurrentAcademicYear } from "@/hooks/use-academic-years";
import { useSchoolClasses } from "@/hooks/use-school-classes";

export default function MarksEntryPage() {
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Hooks
  const { data: academicYearsData } = useAcademicYears();
  const { data: currentYearData } = useCurrentAcademicYear();
  const { data: examsData, isLoading: examsLoading } = useExams(selectedAcademicYearId ? { academic_year_id: selectedAcademicYearId } : undefined);
  const { data: classesData, isLoading: classesLoading } = useSchoolClasses({ status: true, perPage: 100 });
  const { data: examSubjects = [], isLoading: subjectsLoading } = useExamSubjects(selectedExamId);

  // Derived data
  const academicYears = Array.isArray(academicYearsData) ? academicYearsData : (academicYearsData?.data || []);
  const exams = Array.isArray(examsData) ? examsData : (examsData?.data || []);
  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || []);

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

  // Filter exam subjects based on class and status
  const filteredSubjects = examSubjects.filter((subject) => {
    const classMatch = !selectedClassId || subject.school_class?.id === selectedClassId;
    const statusMatch = !selectedStatus || (subject.marks_entry_status || 'pending') === selectedStatus;
    return classMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in_progress": return "text-yellow-600";
      case "pending": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "in_progress": return <Clock className="h-4 w-4" />;
      case "pending": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const isLoading = examsLoading || classesLoading || subjectsLoading;

  if (isLoading && exams.length === 0) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marks Entry</h1>
          <p className="text-muted-foreground mt-1">Enter and manage student marks for exams</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Academic Year</label>
              <Select 
                value={selectedAcademicYearId || ""} 
                onValueChange={setSelectedAcademicYearId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
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

            <div>
              <label className="text-sm font-medium mb-2 block">Exam</label>
              <Select
                value={selectedExamId?.toString() || ""}
                onValueChange={(value) => setSelectedExamId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id.toString()}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Select
                value={selectedClassId?.toString() || ""}
                onValueChange={(value) => setSelectedClassId(value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes.map((cls: any) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSelectedClassId(null);
                  setSelectedStatus("");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedExamId && (
        <Card>
          <CardHeader>
            <CardTitle>Exam Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600">No subjects found matching your filters</p>
                {examSubjects.length > 0 && (
                  <Link href={`/admin/exams/schedule/${selectedExamId}`}>
                    <Button variant="outline" className="mt-4">
                      Schedule Subjects
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Max Marks</TableHead>
                    <TableHead>Pass Marks</TableHead>
                    <TableHead>Exam Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">
                        {subject.subject?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {subject.school_class?.name || 'N/A'}
                      </TableCell>
                      <TableCell>{subject.max_marks}</TableCell>
                      <TableCell>{subject.pass_marks}</TableCell>
                      <TableCell>
                        {subject.exam_date 
                          ? new Date(subject.exam_date).toLocaleDateString()
                          : 'Not scheduled'
                        }
                        {subject.exam_time && (
                          <span className="text-xs text-gray-500 block">
                            {subject.exam_time}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${getStatusColor(subject.marks_entry_status || 'pending')}`}>
                          {getStatusIcon(subject.marks_entry_status || 'pending')}
                          <span className="text-xs capitalize">
                            {subject.marks_entry_status || 'pending'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/exams/results/${selectedExamId}?subject=${subject.id}`}>
                          <Button size="sm" variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Enter Marks
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedExamId && exams.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Exams Found</h3>
            <p className="text-gray-600 mb-4">Create an exam first to start entering marks</p>
            <Link href="/admin/exams/setup/create-exam-form">
              <Button>
                Create New Exam
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
