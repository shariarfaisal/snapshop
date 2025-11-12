"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTeacherMarks, useExams, useSubjects, useSaveMark, useBulkImportMarks } from "@/hooks/use-teacher-marks";

export default function TeacherMarksPage() {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [marks, setMarks] = useState<Record<number, { studentId: number; marks: number; grade?: string }>>({});
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: marksData, isLoading: marksLoading } = useTeacherMarks({
    examId: selectedExam ? parseInt(selectedExam) : undefined,
    classId: selectedClass ? parseInt(selectedClass) : undefined,
    subjectId: selectedSubject ? parseInt(selectedSubject) : undefined,
  });

  const { data: exams } = useExams();
  const { data: subjects } = useSubjects();
  const { mutate: saveMark, isPending: isSaving } = useSaveMark();
  const { mutate: bulkImport, isPending: isImporting } = useBulkImportMarks();

  const examsList = Array.isArray(exams) ? exams : (exams?.data || []).filter(e => e?.id);
  const subjectsList = Array.isArray(subjects) ? subjects : (subjects?.data || []).filter(s => s?.id);
  const marksList = marksData?.data || [];

  // Initialize marks from data
  useMemo(() => {
    const initialMarks: Record<number, any> = {};
    marksList.forEach((mark) => {
      initialMarks[mark.id] = {
        studentId: mark.studentId,
        marks: mark.marks,
        grade: mark.grade,
      };
    });
    setMarks(initialMarks);
  }, [marksList.length]);

  const handleMarkChange = (studentId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: numValue,
        grade: calculateGrade(numValue),
      },
    }));
  };

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    return "F";
  };

  const handleSaveMarks = () => {
    if (!selectedExam || !selectedClass) {
      setSaveMessage({ type: "error", text: "Please select exam and class" });
      return;
    }

    Object.entries(marks).forEach(([_, markData]) => {
      saveMark({
        exam_id: parseInt(selectedExam),
        student_id: markData.studentId,
        class_id: parseInt(selectedClass),
        subject_id: selectedSubject ? parseInt(selectedSubject) : undefined,
        marks: markData.marks,
        grade: markData.grade,
      });
    });

    setSaveMessage({ type: "success", text: "Marks saved successfully!" });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedExam) {
      setSaveMessage({ type: "error", text: "Please select an exam first" });
      return;
    }

    bulkImport(
      { file, examId: parseInt(selectedExam) },
      {
        onSuccess: () => {
          setSaveMessage({ type: "success", text: "Marks imported successfully!" });
          setTimeout(() => setSaveMessage(null), 3000);
        },
        onError: (error) => {
          setSaveMessage({
            type: "error",
            text: "Error importing marks: " + (error instanceof Error ? error.message : "Unknown error"),
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marks Entry</h1>
          <p className="text-gray-500 mt-1">Enter and manage student marks</p>
        </div>
        <div className="flex gap-2">
          <label>
            <Button variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </span>
            </Button>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isImporting}
              className="hidden"
            />
          </label>
          <Button onClick={handleSaveMarks} disabled={isSaving || marksLoading}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Marks
          </Button>
        </div>
      </div>

      {saveMessage && (
        <Card className={saveMessage.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardContent className="pt-4 flex items-center gap-2">
            {saveMessage.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={saveMessage.type === "success" ? "text-green-800" : "text-red-800"}>
              {saveMessage.text}
            </span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Select Exam</label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam" />
                </SelectTrigger>
                <SelectContent>
                  {examsList?.map((exam) => exam?.id && (
                    <SelectItem key={exam.id} value={String(exam.id)}>
                      {exam.name || 'Unnamed'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Select Class</label>
              <Input
                type="text"
                placeholder="Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Select Subject (Optional)</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectsList?.map((subject) => subject?.id && (
                    <SelectItem key={subject.id} value={String(subject.id)}>
                      {subject.name || 'Unnamed'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {marksLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : marksList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No students found for selected exam/class</p>
              <p className="text-sm">Please select exam and class to view students</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Registration No</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marksList?.map((mark) => mark?.id && (
                    <TableRow key={mark.id}>
                      <TableCell className="font-medium">
                        {mark.student
                          ? `${mark.student.user.firstName} ${mark.student.user.lastName}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {mark.studentId ? `STU${mark.studentId.toString().padStart(3, "0")}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={marks[mark.id]?.marks || ""}
                          onChange={(e) => handleMarkChange(mark.id, e.target.value)}
                          className="w-20 ml-auto"
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell className="text-center font-semibold text-blue-600">
                        {marks[mark.id]?.grade || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
