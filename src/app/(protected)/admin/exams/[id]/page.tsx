"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Edit, CheckCircle, FileText } from "lucide-react";
import { examService } from "@/services/exam";
import { Exam } from "@/types/exam";
import Link from "next/link";

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params.id as string);
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const response = await examService.getById(examId);
      setExam(response.data);
    } catch (error) {
      console.error("Failed to fetch exam:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "ongoing": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
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
          <h1 className="text-3xl font-bold">{exam.name}</h1>
          {exam.code && (
            <p className="text-muted-foreground mt-1">Code: {exam.code}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Term:</span>
              <p className="font-medium capitalize">{exam.term}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Academic Year:</span>
              <p className="font-medium">{exam.academic_year?.name || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Start Date:</span>
              <p className="font-medium">{formatDate(exam.start_date)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">End Date:</span>
              <p className="font-medium">{formatDate(exam.end_date)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <div className="mt-1">
                <Badge className={getStatusColor(exam.status)}>
                  {exam.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Results Published:</span>
              <div className="mt-1">
                {exam.results_published ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Published
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
            {exam.results_published_at && (
              <div>
                <span className="text-sm text-gray-600">Published At:</span>
                <p className="font-medium">{formatDate(exam.results_published_at)}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-600">Subjects Scheduled:</span>
              <p className="font-medium">{exam.exam_subjects?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href={`/admin/exams/schedule/${exam.id}`}>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Schedule
            </Button>
          </Link>
          <Link href={`/admin/exams/results/${exam.id}`}>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Enter Marks
            </Button>
          </Link>
          {!exam.results_published && (
            <Button
              variant="outline"
              onClick={async () => {
                if (confirm("Publish results for this exam?")) {
                  try {
                    await examService.publishResults(exam.id);
                    fetchExam();
                    alert("Results published successfully!");
                  } catch (error) {
                    alert("Failed to publish results");
                  }
                }
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Publish Results
            </Button>
          )}
        </CardContent>
      </Card>

      {exam.exam_subjects && exam.exam_subjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exam.exam_subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{subject.subject?.name || "N/A"}</p>
                    <p className="text-sm text-gray-600">
                      Class: {subject.school_class?.name || "N/A"} | 
                      Max Marks: {subject.max_marks} | 
                      Pass Marks: {subject.pass_marks}
                    </p>
                    {subject.exam_date && (
                      <p className="text-sm text-gray-500">
                        Date: {formatDate(subject.exam_date)}
                        {subject.exam_time && ` at ${subject.exam_time}`}
                      </p>
                    )}
                  </div>
                  <Link href={`/admin/exams/results/${exam.id}?subject=${subject.subject_id}`}>
                    <Button size="sm" variant="outline">
                      Enter Marks
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
