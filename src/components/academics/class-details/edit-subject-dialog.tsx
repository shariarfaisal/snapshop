"use client";

import { useState, useEffect } from "react";
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
import { useUpdateClassSubject } from "@/hooks/use-class-subjects";
import { useTeachers } from "@/hooks/use-teachers";

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
}

interface EditSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  subject: ClassSubject;
  onSuccess: () => void;
}

export function EditSubjectDialog({
  open,
  onOpenChange,
  classId,
  subject,
  onSuccess,
}: EditSubjectDialogProps) {
  const [teacherId, setTeacherId] = useState<string>("");
  const [creditHours, setCreditHours] = useState<string>("");

  const { data: teachersData, isLoading: teachersLoading } = useTeachers({ per_page: 100 });
  const updateSubjectMutation = useUpdateClassSubject();

  const teachers = teachersData?.data || [];

  useEffect(() => {
    if (open) {
      setTeacherId(subject.teacher_id?.toString() || "");
      setCreditHours(subject.credit_hours.toString());
    }
  }, [open, subject]);

  const handleUpdateSubject = () => {
    if (!creditHours) return;

    updateSubjectMutation.mutate(
      {
        classId,
        classSubjectId: subject.id,
        data: {
          teacher_id: teacherId ? parseInt(teacherId) : undefined,
          credit_hours: parseInt(creditHours),
        },
      },
      {
        onSuccess: () => {
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
          <DialogTitle>Edit Subject Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Subject Name</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm font-medium">
              {subject.subject_name}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Subject Code</Label>
            <div className="p-3 bg-gray-50 rounded-md text-sm">{subject.subject_code || "N/A"}</div>
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
            disabled={updateSubjectMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateSubject}
            disabled={!creditHours || updateSubjectMutation.isPending}
          >
            {updateSubjectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
