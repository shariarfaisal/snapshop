"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Eye, Edit, Trash2, ClipboardCheck } from "lucide-react";
import { examService } from "@/services/exam";
import { Exam } from "@/types/exam";
import Link from "next/link";

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, scheduled: 0, completed: 0 });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const exams = await examService.getAll();
      setExams(exams);

      setStats({
        total: exams.length,
        scheduled: exams.filter(e => e.status === "scheduled" || e.status === "ongoing").length,
        completed: exams.filter(e => e.status === "completed").length,
      });
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    
    try {
      await examService.delete(id);
      fetchExams();
    } catch (error) {
      console.error("Failed to delete exam:", error);
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
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Examinations</h1>
          <p className="text-gray-500 mt-1">Manage exams and assessments</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/exams/grades">
            <Button variant="outline">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Grade Scales
            </Button>
          </Link>
          <Link href="/admin/exams/setup">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Total Exams</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Scheduled/Ongoing</p>
            <p className="text-2xl font-bold">{stats.scheduled}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : exams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No exams found. Create your first exam to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map(exam => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{exam.name}</div>
                        {exam.code && (
                          <div className="text-xs text-gray-500">{exam.code}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{exam.term}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(exam.start_date)} - {formatDate(exam.end_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {exam.results_published ? (
                        <Badge className="bg-green-100 text-green-800">Published</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/exams/${exam.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/exams/schedule/${exam.id}`}>
                          <Button variant="ghost" size="sm">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/exams/results/${exam.id}`}>
                          <Button variant="ghost" size="sm">
                            <ClipboardCheck className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(exam.id)}
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
