"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreateAndAssignClassSubject } from "@/hooks/use-class-subjects";
import { useTeachers } from "@/hooks/use-teachers";

interface CreateSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  onSuccess: () => void;
}

type SubjectType = "core" | "elective" | "optional";

export function CreateSubjectDialog({
  open,
  onOpenChange,
  classId,
  onSuccess,
}: CreateSubjectDialogProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SubjectType>("core");
  const [teacherId, setTeacherId] = useState<string>("");
  const [creditHours, setCreditHours] = useState<string>("1");

  const { data: teachersData, isLoading: teachersLoading } = useTeachers({ per_page: 100 });
  const createSubjectMutation = useCreateAndAssignClassSubject();

  const teachers = teachersData?.data || [];

  const handleCreateSubject = () => {
    if (!name || !creditHours) return;

    createSubjectMutation.mutate(
      {
        classId,
        data: {
          name,
          code: code || undefined,
          description: description || undefined,
          type,
          teacher_id: teacherId ? parseInt(teacherId) : undefined,
          credit_hours: parseInt(creditHours),
        },
      },
      {
        onSuccess: () => {
          setName("");
          setCode("");
          setDescription("");
          setType("core");
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Subject for Class</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Mathematics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Subject Code</Label>
              <Input
                id="code"
                placeholder="e.g., MATH101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Subject Type *</Label>
              <Select value={type} onValueChange={(value) => setType(value as SubjectType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter subject description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
                    teachers.map((teacher: any) => {
                      const teacherName = teacher.user
                        ? `${teacher.user.firstName} ${teacher.user.lastName}`.trim()
                        : `Teacher ${teacher.id}`;
                      return (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacherName}
                        </SelectItem>
                      );
                    })
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
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createSubjectMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateSubject}
            disabled={!name || !creditHours || createSubjectMutation.isPending}
          >
            {createSubjectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
