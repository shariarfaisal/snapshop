"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";
import { examService, markService } from "@/services/exam";
import { Exam, Mark, Student } from "@/types/exam";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentMark {
  student_id: number;
  student: Student;
  marks_obtained?: number;
  is_absent: boolean;
  remarks?: string;
  existing_mark_id?: number;
}

export default function ExamResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const examId = parseInt(params.id as string);
  const subjectId = searchParams.get("subject") ? parseInt(searchParams.get("subject")!) : null;
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(subjectId);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentMarks, setStudentMarks] = useState<Map<number, StudentMark>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maxMarks, setMaxMarks] = useState(100);

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudentsAndMarks();
    }
  }, [selectedSubject]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const [exam, subjects] = await Promise.all([
        examService.getById(examId),
        examService.getSubjects(examId)
      ]);
      setExam(exam);
      setSubjects(subjects);

      if (subjects.length > 0 && !selectedSubject) {
        setSelectedSubject(subjects[0].subject_id);
      }
    } catch (error) {
      console.error("Failed to fetch exam data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndMarks = async () => {
    if (!selectedSubject) return;

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("auth_token");

      const subjectInfo = subjects.find(s => s.subject_id === selectedSubject);
      if (subjectInfo) {
        setMaxMarks(subjectInfo.max_marks);
      }

      const [studentsRes, marksRes] = await Promise.all([
        fetch(`${API_BASE}/students`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        markService.byExamSubject(examId, selectedSubject)
      ]);

      const studentsData = await studentsRes.json();
      const students = studentsData.data || [];
      setStudents(students);

      const existingMarks = marksRes;
      const marksMap = new Map<number, StudentMark>();

      students.forEach((student: Student) => {
        const existingMark = existingMarks.find((m: Mark) => m.student_id === student.id);
        marksMap.set(student.id, {
          student_id: student.id,
          student: student,
          marks_obtained: existingMark?.marks_obtained,
          is_absent: existingMark?.is_absent || false,
          remarks: existingMark?.remarks,
          existing_mark_id: existingMark?.id,
        });
      });

      setStudentMarks(marksMap);
    } catch (error) {
      console.error("Failed to fetch students/marks:", error);
    }
  };

  const handleMarkChange = (studentId: number, marks: string) => {
    const marksValue = marks === "" ? undefined : parseFloat(marks);
    setStudentMarks(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(studentId)!;
      newMap.set(studentId, { ...existing, marks_obtained: marksValue });
      return newMap;
    });
  };

  const handleAbsentChange = (studentId: number, absent: boolean) => {
    setStudentMarks(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(studentId)!;
      newMap.set(studentId, { 
        ...existing, 
        is_absent: absent,
        marks_obtained: absent ? undefined : existing.marks_obtained
      });
      return newMap;
    });
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setStudentMarks(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(studentId)!;
      newMap.set(studentId, { ...existing, remarks: remarks || undefined });
      return newMap;
    });
  };

  const handleSaveMarks = async () => {
    if (!selectedSubject) return;

    try {
      setSaving(true);

      const marksToSave = Array.from(studentMarks.values()).map(sm => ({
        student_id: sm.student_id,
        marks_obtained: sm.is_absent ? undefined : sm.marks_obtained,
        is_absent: sm.is_absent,
        remarks: sm.remarks,
      }));

      await markService.bulkCreate({
        exam_id: examId,
        subject_id: selectedSubject,
        max_marks: maxMarks,
        marks: marksToSave,
      });

      alert("Marks saved successfully!");
      fetchStudentsAndMarks();
    } catch (error) {
      console.error("Failed to save marks:", error);
      alert("Failed to save marks. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublishResults = async () => {
    if (!confirm("Are you sure you want to publish the results? Students will be able to view them.")) return;

    try {
      await examService.publishResults(examId);
      alert("Results published successfully!");
      fetchExamData();
    } catch (error) {
      console.error("Failed to publish results:", error);
      alert("Failed to publish results.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!exam) {
    return <div className="p-6">Exam not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/exams">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{exam.name} - Results</h1>
          <p className="text-muted-foreground mt-1">Enter marks for students</p>
        </div>
        <div className="flex gap-2">
          {!exam.results_published && (
            <Button variant="outline" onClick={handlePublishResults}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Publish Results
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Select Subject</CardTitle>
            {exam.results_published && (
              <span className="text-sm text-green-600 font-medium">
                ✓ Results Published
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedSubject?.toString() || ""}
            onValueChange={(v) => setSelectedSubject(parseInt(v))}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.subject_id.toString()}>
                  {subject.subject?.name} - {subject.school_class?.name} (Max: {subject.max_marks})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSubject && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Enter Marks</CardTitle>
              <Button onClick={handleSaveMarks} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save All Marks"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No students found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead className="w-[120px]">Marks (/{maxMarks})</TableHead>
                    <TableHead className="w-[100px]">Absent</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => {
                    const studentMark = studentMarks.get(student.id);
                    if (!studentMark) return null;

                    return (
                      <TableRow key={student.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {student.user?.first_name} {student.user?.last_name}
                        </TableCell>
                        <TableCell>{student.roll_number || "N/A"}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max={maxMarks}
                            value={studentMark.marks_obtained ?? ""}
                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            disabled={studentMark.is_absent}
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Checkbox
                              checked={studentMark.is_absent}
                              onCheckedChange={(checked) => 
                                handleAbsentChange(student.id, checked as boolean)
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={studentMark.remarks || ""}
                            onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                            placeholder="Optional remarks"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
