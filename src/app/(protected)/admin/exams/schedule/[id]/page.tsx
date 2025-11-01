"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Edit, Trash2, Save } from "lucide-react";
import { CreateExamSubjectInput } from "@/types/exam";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExam, useExamSchedule, useAddExamSubject, useRemoveExamSubject } from "@/hooks/use-exams";
import { useSchoolClasses } from "@/hooks/use-school-classes";
import { useSubjects } from "@/hooks/use-subjects";
import { toast } from "sonner";

export default function ExamSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params.id as string);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CreateExamSubjectInput>({
    class_id: 0,
    subject_id: 0,
    max_marks: 100,
    pass_marks: 40,
    exam_date: "",
    exam_time: "",
    duration: 180,
  });

  // Hooks
  const { data: examData, isLoading: examLoading } = useExam(examId);
  const { data: scheduleData, isLoading: scheduleLoading } = useExamSchedule(examId);
  const { data: classesData } = useSchoolClasses({ per_page: "all" });
  const { subjects: subjectsData } = useSubjects({ per_page: "all" });
  const addSubjectMutation = useAddExamSubject();
  const removeSubjectMutation = useRemoveExamSubject();

  // Handle API response formats
  const exam = examData?.data || examData;
  const schedule = Array.isArray(scheduleData) ? scheduleData : [];
  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || []);
  const subjects = Array.isArray(subjectsData) ? subjectsData : [];
  const loading = examLoading || scheduleLoading;

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    addSubjectMutation.mutate(
      { examId, data: formData },
      {
        onSuccess: () => {
          setShowAddForm(false);
          setFormData({
            class_id: 0,
            subject_id: 0,
            max_marks: 100,
            pass_marks: 40,
            exam_date: "",
            exam_time: "",
            duration: 180,
          });
          toast.success("Subject added successfully");
        },
        onError: () => {
          toast.error("Failed to add subject");
        },
      }
    );
  };

  const handleRemoveSubject = (subjectId: number) => {
    if (!confirm("Are you sure you want to remove this subject?")) return;

    removeSubjectMutation.mutate(
      { examId, subjectId },
      {
        onSuccess: () => {
          toast.success("Subject removed successfully");
        },
        onError: () => {
          toast.error("Failed to remove subject");
        },
      }
    );
  };

  const formatDate = (date: string) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!exam) {
    return <div className="p-6">Exam not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/exams">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{exam.name}</h1>
          <p className="text-muted-foreground mt-1">
            {formatDate(exam.start_date)} - {formatDate(exam.end_date)}
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Subject to Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select
                    value={formData.class_id.toString()}
                    onValueChange={(v) => setFormData({ ...formData, class_id: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={formData.subject_id.toString()}
                    onValueChange={(v) => setFormData({ ...formData, subject_id: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_marks">Max Marks *</Label>
                  <Input
                    id="max_marks"
                    type="number"
                    value={formData.max_marks}
                    onChange={(e) =>
                      setFormData({ ...formData, max_marks: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pass_marks">Pass Marks *</Label>
                  <Input
                    id="pass_marks"
                    type="number"
                    value={formData.pass_marks}
                    onChange={(e) =>
                      setFormData({ ...formData, pass_marks: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam_date">Exam Date</Label>
                  <Input
                    id="exam_date"
                    type="date"
                    value={formData.exam_date}
                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam_time">Exam Time</Label>
                  <Input
                    id="exam_time"
                    type="time"
                    value={formData.exam_time}
                    onChange={(e) => setFormData({ ...formData, exam_time: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Exam Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {schedule.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No subjects added yet. Click "Add Subject" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Max Marks</TableHead>
                  <TableHead>Pass Marks</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.school_class?.name || "N/A"}</TableCell>
                    <TableCell className="font-medium">{item.subject?.name || "N/A"}</TableCell>
                    <TableCell>{item.max_marks}</TableCell>
                    <TableCell>{item.pass_marks}</TableCell>
                    <TableCell>
                      {item.exam_date ? (
                        <div>
                          <div>{formatDate(item.exam_date)}</div>
                          {item.exam_time && (
                            <div className="text-xs text-gray-500">{item.exam_time}</div>
                          )}
                        </div>
                      ) : (
                        "Not scheduled"
                      )}
                    </TableCell>
                    <TableCell>{item.duration ? `${item.duration} min` : "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/exams/results/${examId}?subject=${item.subject_id}`}>
                          <Button variant="ghost" size="sm">
                            Enter Marks
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSubject(item.id)}
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
    </div>
  );
}
