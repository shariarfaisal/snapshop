import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Exam, Grade } from "@/types/exam";
import { examService } from "@/services/exam";
import { useToast } from "@/hooks";

interface ManageGradesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam;
}

export function ManageGradesDrawer({
  open,
  onOpenChange,
  exam,
}: ManageGradesDrawerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingGrades, setEditingGrades] = useState<Record<string, number>>({});

  const { data: grades, isLoading } = useQuery({
    queryKey: ["grades", exam.id],
    queryFn: () => examService.getGrades(exam.id),
  });

  const updateGradesMutation = useMutation({
    mutationFn: (data: Record<string, { marks: number }>) =>
      examService.updateGrades(exam.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades", exam.id] });
      toast({
        title: "Success",
        description: "Grades updated successfully",
      });
      setEditingGrades({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update grades",
        variant: "destructive",
      });
    },
  });

  const moderateGradeMutation = useMutation({
    mutationFn: ({ gradeId, adjustment }: { gradeId: string; adjustment: number }) =>
      examService.moderateGrade(gradeId, { adjustment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades", exam.id] });
      toast({
        title: "Success",
        description: "Grade moderated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to moderate grade",
        variant: "destructive",
      });
    },
  });

  const finalizeGradeMutation = useMutation({
    mutationFn: (gradeId: string) => examService.finalizeGrade(gradeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades", exam.id] });
      toast({
        title: "Success",
        description: "Grade finalized successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to finalize grade",
        variant: "destructive",
      });
    },
  });

  const handleGradeChange = (gradeId: string, value: string) => {
    const marks = parseFloat(value);
    if (!isNaN(marks) && marks >= 0 && marks <= exam.maxMarks) {
      setEditingGrades((prev) => ({ ...prev, [gradeId]: marks }));
    }
  };

  const handleSaveGrades = () => {
    const gradesToUpdate = Object.entries(editingGrades).reduce(
      (acc, [gradeId, marks]) => {
        acc[gradeId] = { marks };
        return acc;
      },
      {} as Record<string, { marks: number }>
    );
    updateGradesMutation.mutate(gradesToUpdate);
  };

  const handleModerateGrade = (gradeId: string, adjustment: number) => {
    moderateGradeMutation.mutate({ gradeId, adjustment });
  };

  const handleFinalizeGrade = (gradeId: string) => {
    finalizeGradeMutation.mutate(gradeId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-4xl mx-auto">
        <DrawerHeader>
          <DrawerTitle>Manage Grades - {exam.name}</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[calc(100vh-200px)] p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Subject: {exam.subjectName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Max Marks: {exam.maxMarks}
                </p>
              </div>
              <Button onClick={handleSaveGrades}>Save All Changes</Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades?.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">
                        {grade.studentName}
                      </TableCell>
                      <TableCell>{grade.rollNumber}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={exam.maxMarks}
                          value={
                            editingGrades[grade.id] !== undefined
                              ? editingGrades[grade.id]
                              : grade.marks || ""
                          }
                          onChange={(e) =>
                            handleGradeChange(grade.id, e.target.value)
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            grade.status === "Graded" ? "default" : "secondary"
                          }
                        >
                          {grade.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!grade.isFinalized && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleModerateGrade(grade.id, 5)}
                                title="Add 5 marks"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleModerateGrade(grade.id, -2)}
                                title="Subtract 2 marks"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleFinalizeGrade(grade.id)}
                                title="Finalize grade"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
} 