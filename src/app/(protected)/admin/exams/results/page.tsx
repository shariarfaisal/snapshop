"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { examService } from "@/services/exam";
import { Exam } from "@/types/exam";

export default function MarksEntryPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [examSubjects, setExamSubjects] = useState<any[]>([]);

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchExamSubjects(parseInt(selectedExam));
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examService.getAll();
      const examsData = Array.isArray(response) ? response : (response as any)?.data || [];
      setExams(examsData);
      
      // Auto-select first exam if available
      if (examsData.length > 0) {
        setSelectedExam(examsData[0].id.toString());
      }
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExamSubjects = async (examId: number) => {
    try {
      const subjects = await examService.getSubjects(examId);
      setExamSubjects(Array.isArray(subjects) ? subjects : []);
    } catch (error) {
      console.error("Failed to fetch exam subjects:", error);
      setExamSubjects([]);
    }
  };

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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marks Entry</h1>
          <p className="text-muted-foreground mt-1">Enter and manage student marks for exams</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Exam</label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id.toString()}>
                      {exam.name} - {exam.academic_year?.name || 'N/A'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedExam && (
        <Card>
          <CardHeader>
            <CardTitle>Exam Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {examSubjects.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600">No subjects scheduled for this exam</p>
                <Link href={`/admin/exams/schedule/${selectedExam}`}>
                  <Button variant="outline" className="mt-4">
                    Schedule Subjects
                  </Button>
                </Link>
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
                  {examSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">
                        {subject.subject?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {subject.school_class?.name || 'N/A'}
                        {subject.school_class?.section && ` - ${subject.school_class.section}`}
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
                        <Link href={`/admin/exams/results/${selectedExam}?subject=${subject.id}`}>
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

      {!selectedExam && exams.length === 0 && (
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
