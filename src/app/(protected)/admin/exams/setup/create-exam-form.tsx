"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInput } from "@/components/ui/date-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { CreateExamInput, ExamTerm, ExamStatus } from "@/types/exam";
import { useCreateExam } from "@/hooks/use-exams";
import { useAcademicYears } from "@/hooks/use-academic-years";
import { toast } from "sonner";

export default function CreateExamForm() {
  const router = useRouter();

  // Hooks
  const { data: academicYears = [], isLoading: loadingYears } = useAcademicYears();
  const createExamMutation = useCreateExam();

  // Form state - set default academic year when data loads
  const [formData, setFormData] = useState<CreateExamInput>({
    name: "",
    code: "",
    term: "first",
    exam_type: "term",
    academic_year_id: 0,
    start_date: "",
    end_date: "",
    status: "draft"
  });

  // Set default academic year when years load
  if (academicYears.length > 0 && formData.academic_year_id === 0) {
    const currentYear = academicYears.find((y: any) => y.is_current);
    setFormData(prev => ({ ...prev, academic_year_id: currentYear?.id || academicYears[0].id }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.academic_year_id) {
      toast.error("Please select an academic year");
      return;
    }

    createExamMutation.mutate(formData, {
      onSuccess: (exam) => {
        toast.success("Exam created successfully");
        router.push(`/admin/exams/schedule/${exam.id}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to create exam");
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Exam</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Exam Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Mid-Term Examination"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Exam Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., MTE-2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam_type">
                Exam Type * 
                <span className="text-xs text-gray-500 ml-2">(What type of assessment)</span>
              </Label>
              <Select 
                value={formData.exam_type} 
                onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="term">Term Exam</SelectItem>
                  <SelectItem value="midterm">Mid-Term Exam</SelectItem>
                  <SelectItem value="final">Final Exam</SelectItem>
                  <SelectItem value="monthly">Monthly Test</SelectItem>
                  <SelectItem value="weekly">Weekly Test</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="practical">Practical Exam</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">
                Academic Term * 
                <span className="text-xs text-gray-500 ml-2">(Which term/semester)</span>
              </Label>
              <Select 
                value={formData.term} 
                onValueChange={(value) => setFormData({ ...formData, term: value as ExamTerm })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select academic term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Term</SelectItem>
                  <SelectItem value="second">Second Term</SelectItem>
                  <SelectItem value="third">Third Term</SelectItem>
                  <SelectItem value="final">Final Term</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year">Academic Year *</Label>
              <Select 
                value={formData.academic_year_id.toString()} 
                onValueChange={(value) => setFormData({ ...formData, academic_year_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name} {year.is_current ? "(Current)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as ExamStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createExamMutation.isPending}>
              {createExamMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {createExamMutation.isPending ? "Creating..." : "Create Exam"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
