"use client";

import { useState } from "react";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { DateInput } from "@/components/ui/date-input";
import { Plus, Trash2, X, Zap } from "lucide-react";
import { useSchoolClasses } from "@/hooks/use-school-classes";
import { useClassSubjects } from "@/hooks/use-class-subjects";
import { useScheduleClassesForExam } from "@/hooks/use-exams";
import { toast } from "sonner";
import { ScheduleClassesInput, ScheduleClassForExam } from "@/types/exam";

interface ScheduledSubject {
  subject_id: number;
  subject_name: string;
  max_marks?: number;
  pass_marks?: number;
  exam_date?: string;
  exam_time?: string;
  duration?: number;
}

interface ScheduledClass {
  class_id: number;
  class_name: string;
  subjects: ScheduledSubject[];
}

interface ExamScheduleAutomationDialogProps {
  examId: number;
  onSuccess?: () => void;
  defaultMaxMarks?: number;
  defaultPassMarks?: number;
  defaultDuration?: number;
}

export function ExamScheduleAutomationDialog({
  examId,
  onSuccess,
  defaultMaxMarks = 100,
  defaultPassMarks = 40,
  defaultDuration = 180,
}: ExamScheduleAutomationDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([]);

  // Common properties
  const [commonMaxMarks, setCommonMaxMarks] = useState(defaultMaxMarks);
  const [commonPassMarks, setCommonPassMarks] = useState(defaultPassMarks);
  const [commonDuration, setCommonDuration] = useState(defaultDuration);
  const [commonExamDate, setCommonExamDate] = useState<Date | undefined>();
  const [commonExamTime, setCommonExamTime] = useState("");

  // Hooks
  const { data: classesData } = useSchoolClasses({ per_page: "all" });
  const { subjects: classSubjectsData } = useClassSubjects(selectedClass);
  const scheduleClassesMutation = useScheduleClassesForExam();

  // Handle data formats
  const classes = Array.isArray(classesData) ? classesData : classesData?.data || [];
  const classSubjects = Array.isArray(classSubjectsData) ? classSubjectsData : [];

  const addClass = () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    const classExists = scheduledClasses.some((c) => c.class_id === selectedClass);
    if (classExists) {
      toast.error("This class is already added");
      return;
    }

    if (classSubjects.length === 0) {
      toast.error("No subjects available for this class");
      return;
    }

    const selectedClassName = classes.find((c) => c.id === selectedClass)?.name || "";

    const newClass: ScheduledClass = {
      class_id: selectedClass,
      class_name: selectedClassName,
      subjects: classSubjects.map((subject) => ({
        subject_id: subject.subject_id,
        subject_name: subject.subject_name,
        max_marks: commonMaxMarks,
        pass_marks: commonPassMarks,
        exam_date: commonExamDate ? format(commonExamDate, "yyyy-MM-dd") : undefined,
        exam_time: commonExamTime,
        duration: commonDuration,
      })),
    };

    setScheduledClasses([...scheduledClasses, newClass]);
    setSelectedClass(null);
    toast.success(`${selectedClassName} added with ${classSubjects.length} subjects`);
  };

  const removeClass = (classId: number) => {
    setScheduledClasses(scheduledClasses.filter((c) => c.class_id !== classId));
  };

  const removeSubject = (classId: number, subjectId: number) => {
    setScheduledClasses(
      scheduledClasses.map((c) =>
        c.class_id === classId
          ? { ...c, subjects: c.subjects.filter((s) => s.subject_id !== subjectId) }
          : c
      )
    );
  };

  const updateSubjectField = (
    classId: number,
    subjectId: number,
    field: keyof ScheduledSubject,
    value: any
  ) => {
    setScheduledClasses(
      scheduledClasses.map((c) =>
        c.class_id === classId
          ? {
              ...c,
              subjects: c.subjects.map((s) =>
                s.subject_id === subjectId ? { ...s, [field]: value } : s
              ),
            }
          : c
      )
    );
  };

  const handleSubmit = async () => {
    if (scheduledClasses.length === 0) {
      toast.error("Please add at least one class");
      return;
    }

    const data: ScheduleClassesInput = {
      max_marks: commonMaxMarks,
      pass_marks: commonPassMarks,
      duration: commonDuration,
      exam_date: commonExamDate ? format(commonExamDate, "yyyy-MM-dd") : undefined,
      exam_time: commonExamTime || undefined,
      classes: scheduledClasses.map((c) => ({
        class_id: c.class_id,
        subjects: c.subjects.map((s) => ({
          subject_id: s.subject_id,
          max_marks: s.max_marks,
          pass_marks: s.pass_marks,
          exam_date: s.exam_date,
          exam_time: s.exam_time,
          duration: s.duration,
        })),
      })),
    };

    scheduleClassesMutation.mutate(
      { examId, data },
      {
        onSuccess: () => {
          toast.success("Exam schedule created successfully");
          setOpen(false);
          setScheduledClasses([]);
          setSelectedClass(null);
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to create exam schedule");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Zap className="h-4 w-4" />
          Automation Setup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exam Schedule Automation</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Common Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Common Properties</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_marks">Max Marks *</Label>
                <Input
                  id="max_marks"
                  type="number"
                  value={commonMaxMarks}
                  onChange={(e) => setCommonMaxMarks(parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pass_marks">Pass Marks *</Label>
                <Input
                  id="pass_marks"
                  type="number"
                  value={commonPassMarks}
                  onChange={(e) => setCommonPassMarks(parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (min) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={commonDuration}
                  onChange={(e) => setCommonDuration(parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Exam Date</Label>
                <DatePicker
                  date={commonExamDate}
                  onSelect={setCommonExamDate}
                  placeholder="Pick exam date"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="exam_time">Exam Time</Label>
                <Input
                  id="exam_time"
                  type="time"
                  value={commonExamTime}
                  onChange={(e) => setCommonExamTime(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Class Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select
                  value={selectedClass?.toString() || ""}
                  onValueChange={(v) => setSelectedClass(v ? parseInt(v) : null)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addClass} size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Classes & Subjects */}
          {scheduledClasses.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Scheduled Classes & Subjects</h3>
              {scheduledClasses.map((scheduledClass) => (
                <Card key={scheduledClass.class_id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{scheduledClass.class_name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeClass(scheduledClass.class_id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scheduledClass.subjects.map((subject) => (
                        <div
                          key={subject.subject_id}
                          className="flex items-end gap-3 p-3 bg-slate-50 rounded-lg border"
                        >
                          <div className="flex-1 min-w-[150px]">
                            <Label className="text-xs font-semibold mb-1 block">Subject</Label>
                            <div className="text-sm font-medium">{subject.subject_name}</div>
                          </div>

                          <div className="w-24">
                            <Label className="text-xs font-semibold mb-1 block">Max Marks</Label>
                            <Input
                              type="number"
                              value={subject.max_marks || ""}
                              onChange={(e) =>
                                updateSubjectField(
                                  scheduledClass.class_id,
                                  subject.subject_id,
                                  "max_marks",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min="0"
                              className="h-8"
                            />
                          </div>

                          <div className="w-24">
                            <Label className="text-xs font-semibold mb-1 block">Pass Marks</Label>
                            <Input
                              type="number"
                              value={subject.pass_marks || ""}
                              onChange={(e) =>
                                updateSubjectField(
                                  scheduledClass.class_id,
                                  subject.subject_id,
                                  "pass_marks",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min="0"
                              className="h-8"
                            />
                          </div>

                          <div className="w-32">
                            <Label className="text-xs font-semibold mb-1 block">Date</Label>
                            <DateInput
                              value={subject.exam_date}
                              onChange={(value) =>
                                updateSubjectField(
                                  scheduledClass.class_id,
                                  subject.subject_id,
                                  "exam_date",
                                  value
                                )
                              }
                              placeholder="Pick date"
                            />
                          </div>

                          <div className="w-32">
                            <Label className="text-xs font-semibold mb-1 block">Time</Label>
                            <Input
                              type="time"
                              value={subject.exam_time || ""}
                              onChange={(e) =>
                                updateSubjectField(
                                  scheduledClass.class_id,
                                  subject.subject_id,
                                  "exam_time",
                                  e.target.value
                                )
                              }
                              className="h-8"
                            />
                          </div>

                          <div className="w-24">
                            <Label className="text-xs font-semibold mb-1 block">Duration</Label>
                            <Input
                              type="number"
                              value={subject.duration || ""}
                              onChange={(e) =>
                                updateSubjectField(
                                  scheduledClass.class_id,
                                  subject.subject_id,
                                  "duration",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              min="0"
                              className="h-8"
                            />
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeSubject(scheduledClass.class_id, subject.subject_id)
                            }
                            className="mb-0"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary */}
          {scheduledClasses.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Summary:</strong> {scheduledClasses.length} class(es) with{" "}
                {scheduledClasses.reduce((sum, c) => sum + c.subjects.length, 0)} subject(s) total
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setScheduledClasses([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={scheduledClasses.length === 0 || scheduleClassesMutation.isPending}
            >
              {scheduleClassesMutation.isPending ? "Creating..." : "Create Schedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
