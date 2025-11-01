"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Medal,
  Award,
  Download,
  Zap,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Exam, ExamRanking, RankType } from "@/types/exam";
import { useToast } from "@/hooks/use-toast";
import {
  useExams,
  useMeritList,
  useToppers,
  useGenerateRankings,
} from "@/hooks/use-exams";

export default function MeritListPage() {
  const { toast } = useToast();
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [rankType, setRankType] = useState<RankType>("overall");
  const [resultFilter, setResultFilter] = useState<string>("all");

  // Hooks
  const { data: examsData } = useExams();
  const meritListFilters = {
    rank_type: rankType,
    ...(resultFilter !== "all" && { result: resultFilter }),
  };
  const { data: meritListData, isLoading: loading } = useMeritList(selectedExamId, meritListFilters);
  const { data: toppersData } = useToppers(selectedExamId, 3, rankType);
  const generateMutation = useGenerateRankings();

  // Handle API response formats
  const exams = Array.isArray(examsData) ? examsData : (examsData as any)?.data || [];
  const rankings = Array.isArray(meritListData) ? meritListData : [];
  const toppers = Array.isArray(toppersData) ? toppersData : [];

  // Set default exam when data loads
  useEffect(() => {
    if (exams.length > 0 && selectedExamId === null) {
      setSelectedExamId(exams[0].id);
    }
  }, [exams, selectedExamId]);

  const handleGenerateRankings = () => {
    if (!selectedExamId) return;

    generateMutation.mutate(
      {
        exam_id: selectedExamId,
        rank_type: rankType,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Rankings generated successfully",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to generate rankings",
            variant: "destructive",
          });
        },
      }
    );
  };

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return "bg-gray-100 text-gray-800";
    if (grade.includes("A")) return "bg-green-100 text-green-800";
    if (grade.includes("B")) return "bg-blue-100 text-blue-800";
    if (grade.includes("C")) return "bg-yellow-100 text-yellow-800";
    if (grade.includes("D")) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const passedCount = rankings.filter((r) => r.result === "pass").length;
  const failedCount = rankings.filter((r) => r.result === "fail").length;
  const avgPercentage =
    rankings.length > 0
      ? (rankings.reduce((sum, r) => sum + r.percentage, 0) / rankings.length).toFixed(2)
      : "0";

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Merit List</h1>
          <p className="text-gray-500 mt-1">View exam rankings and merit lists</p>
        </div>
        <Button onClick={handleGenerateRankings} disabled={generateMutation.isPending}>
          <Zap className="mr-2 h-4 w-4" />
          {generateMutation.isPending ? "Generating..." : "Generate Rankings"}
        </Button>
      </div>

      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select
                value={selectedExamId?.toString()}
                onValueChange={(value) => setSelectedExamId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id.toString()}>
                      {exam.name} - {exam.academic_year?.name || "N/A"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={rankType} onValueChange={(v: RankType) => setRankType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rank Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall</SelectItem>
                  <SelectItem value="class">Class-wise</SelectItem>
                  <SelectItem value="subject">Subject-wise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="pass">Passed Only</SelectItem>
                  <SelectItem value="fail">Failed Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedExamId && (
        <>
          {/* Top 3 Toppers */}
          {toppers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {toppers.map((topper, idx) => (
                <Card key={topper.id} className={idx === 0 ? "border-yellow-400 border-2" : ""}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        {getRankMedal(idx + 1)}
                      </div>
                      <h3 className="font-bold text-lg mb-1">
                        Rank {topper.rank}
                        {idx === 0 && " 🏆"}
                      </h3>
                      <p className="font-semibold text-gray-900">
                        {topper.student?.user?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {topper.school_class?.name || "N/A"}
                      </p>
                      <div className="flex justify-center gap-2 mt-3">
                        <Badge className="bg-blue-100 text-blue-800">
                          {topper.percentage}%
                        </Badge>
                        {topper.grade && (
                          <Badge className={getGradeColor(topper.grade)}>{topper.grade}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {topper.total_marks} / {topper.max_marks} marks
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{rankings.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Passed</p>
                <p className="text-2xl font-bold">{passedCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <XCircle className="h-8 w-8 text-red-600 mb-2" />
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold">{failedCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Average %</p>
                <p className="text-2xl font-bold">{avgPercentage}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Merit List Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Merit List - {rankType.charAt(0).toUpperCase() + rankType.slice(1)}</CardTitle>
                <Button variant="outline" size="sm" disabled={rankings.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : rankings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Award className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
                  <p className="mb-4">Click "Generate Rankings" to create the merit list</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((ranking) => (
                      <TableRow key={ranking.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRankMedal(ranking.rank)}
                            <span className="font-semibold">{ranking.rank}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {ranking.student?.user?.name || "N/A"}
                        </TableCell>
                        <TableCell>{ranking.school_class?.name || "N/A"}</TableCell>
                        <TableCell>
                          {ranking.total_marks} / {ranking.max_marks}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            {ranking.percentage.toFixed(2)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ranking.grade ? (
                            <Badge className={getGradeColor(ranking.grade)}>
                              {ranking.grade}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{ranking.grade_point?.toFixed(2) || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              ranking.result === "pass"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            <div className="flex items-center gap-1">
                              {ranking.result === "pass" ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {ranking.result.toUpperCase()}
                            </div>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
