import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Exam, ExamStatus } from "@/types/exam";
import { examService } from "@/services/exam";
import { useToast } from "@/hooks";
import { AddExamDialog } from "./add-exam-dialog";
import { ManageGradesDrawer } from "./manage-grades-drawer";

const statusColors: Record<ExamStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
  ongoing: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function ExamList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isManageGradesOpen, setIsManageGradesOpen] = useState(false);
  const [filters, setFilters] = useState({
    programId: "",
    subjectId: "",
    termId: "",
  });

  const { data: exams, isLoading } = useQuery({
    queryKey: ["exams", filters],
    queryFn: examService.getAll,
  });

  const deleteExamMutation = useMutation({
    mutationFn: examService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast({
        title: "Success",
        description: "Exam deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete exam",
        variant: "destructive",
      });
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDelete = (exam: Exam) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      deleteExamMutation.mutate(exam.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!exams?.length) {
    return (
      <div className="text-center py-10">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No exams</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new exam.</p>
        <div className="mt-6">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Exam
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select
            value={filters.programId}
            onValueChange={(value) => handleFilterChange("programId", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {/* Add program options here */}
            </SelectContent>
          </Select>

          <Select
            value={filters.subjectId}
            onValueChange={(value) => handleFilterChange("subjectId", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {/* Add subject options here */}
            </SelectContent>
          </Select>

          <Select
            value={filters.termId}
            onValueChange={(value) => handleFilterChange("termId", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              {/* Add term options here */}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Exam
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Exam Date</TableHead>
              <TableHead>Max Marks</TableHead>
              <TableHead>Weight (%)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam: Exam) => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.name}</TableCell>
                <TableCell>{exam.subjectName}</TableCell>
                <TableCell>{exam.programName}</TableCell>
                <TableCell>{exam.termName}</TableCell>
                <TableCell>{format(new Date(exam.examDate), "PPP")}</TableCell>
                <TableCell>{exam.maxMarks}</TableCell>
                <TableCell>{exam.weight}%</TableCell>
                <TableCell>
                  <Badge className={statusColors[exam.status]}>{exam.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedExam(exam);
                        setIsManageGradesOpen(true);
                      }}
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedExam(exam);
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(exam)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddExamDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        exam={selectedExam}
        onSuccess={() => {
          setSelectedExam(null);
          setIsAddDialogOpen(false);
        }}
      />

      {selectedExam && (
        <ManageGradesDrawer
          open={isManageGradesOpen}
          onOpenChange={setIsManageGradesOpen}
          exam={selectedExam}
        />
      )}
    </div>
  );
}
