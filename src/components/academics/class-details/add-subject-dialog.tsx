"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { subjectService } from "@/services/subject";
import { useAddClassSubject } from "@/hooks/use-class-subjects";
import { useTeachers } from "@/hooks/use-teachers";

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  onSuccess: () => void;
}

export function AddSubjectDialog({
  open,
  onOpenChange,
  classId,
  onSuccess,
}: AddSubjectDialogProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [teacherId, setTeacherId] = useState<string>("");
  const [creditHours, setCreditHours] = useState<string>("1");

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects-all"],
    queryFn: () => subjectService.getAll({ per_page: "all" }),
  });

  const { data: teachersData, isLoading: teachersLoading } = useTeachers({ per_page: 100 });
  const addSubjectMutation = useAddClassSubject();

  const subjects = subjectsData?.data || [];
  const teachers = teachersData?.data || [];

  const handleAddSubject = () => {
    if (!selectedSubjectId || !creditHours) return;

    addSubjectMutation.mutate(
      {
        classId,
        data: {
          subject_id: parseInt(selectedSubjectId),
          teacher_id: teacherId ? parseInt(teacherId) : undefined,
          credit_hours: parseInt(creditHours),
        },
      },
      {
        onSuccess: () => {
          setSelectedSubjectId("");
          setTeacherId("");
          setCreditHours("1");
          onOpenChange(false);
          onSuccess();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Existing Subject to Class</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading subjects...
                  </SelectItem>
                ) : (
                  subjects.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name} {subject.code ? `(${subject.code})` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher (Optional)</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Unassigned</SelectItem>
                {teachersLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading teachers...
                  </SelectItem>
                ) : (
                  teachers.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditHours">Credit Hours *</Label>
            <Input
              id="creditHours"
              type="number"
              min="1"
              value={creditHours}
              onChange={(e) => setCreditHours(e.target.value)}
              placeholder="1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={addSubjectMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSubject}
            disabled={
              !selectedSubjectId || !creditHours || addSubjectMutation.isPending || subjectsLoading
            }
          >
            {addSubjectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
