"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Download,
  Grid,
  List,
  Loader2
} from "lucide-react";
import { ExamSubject } from "@/types/exam";
import { useToast } from "@/hooks/use-toast";
import { useExams, useExamSchedule } from "@/hooks/use-exams";
import { useAcademicYears, useCurrentAcademicYear } from "@/hooks/use-academic-years";

export default function ExamRoutinePage() {
  const { toast } = useToast();
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Hooks
  const { data: academicYearsData } = useAcademicYears({ status: 'active' });
  const { data: currentYearData } = useCurrentAcademicYear();
  const { data: examsData, isLoading: loadingExams } = useExams(selectedAcademicYearId ? { academic_year_id: selectedAcademicYearId } : undefined);
  const { data: schedule = [], isLoading: loading } = useExamSchedule(selectedExamId);

  // Derived data
  const academicYears = Array.isArray(academicYearsData) ? academicYearsData : (academicYearsData?.data || []);
  const exams = Array.isArray(examsData) ? examsData : (examsData?.data || []);

  // Set current academic year as default
  useEffect(() => {
    if (!selectedAcademicYearId && currentYearData) {
      const currentYear = currentYearData?.data || currentYearData;
      if (currentYear?.id) {
        setSelectedAcademicYearId(currentYear.id.toString());
      }
    }
  }, [currentYearData, selectedAcademicYearId]);

  // Set first exam as default when exams load
  useEffect(() => {
    if (exams.length > 0 && selectedExamId === null) {
      setSelectedExamId(exams[0].id);
    }
  }, [exams, selectedExamId]);

  const formatDate = (date?: string) => {
    if (!date) return "TBA";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return "TBA";
    return time;
  };

  // Group schedule by date
  const scheduleByDate = schedule.reduce((acc, item) => {
    const date = item.exam_date || "TBA";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ExamSubject[]>);

  const dates = Object.keys(scheduleByDate).sort();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Exam Routine</h1>
          <p className="text-gray-500 mt-1">View examination schedule and timetable</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <Grid className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="mr-2 h-4 w-4" />
            List
          </Button>
          <Button variant="outline" size="sm" disabled={schedule.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium mb-2 block">Academic Year</label>
              <Select 
                value={selectedAcademicYearId || ""} 
                onValueChange={setSelectedAcademicYearId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year: any) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name || `${year.start_year}-${year.end_year}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium mb-2 block">Select Exam</label>
              <Select
                value={selectedExamId?.toString() || ""}
                onValueChange={(value) => setSelectedExamId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id.toString()}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedExamId && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-2xl font-bold">{schedule.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <CalendarIcon className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Exam Days</p>
                <p className="text-2xl font-bold">{dates.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold">
                  {schedule.reduce((sum, s) => sum + (s.duration || 0), 0)} mins
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Display */}
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div>Loading schedule...</div>
              </CardContent>
            </Card>
          ) : schedule.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Schedule Yet</h3>
                <p className="text-gray-600">
                  Add exam subjects and schedule details to view the routine
                </p>
              </CardContent>
            </Card>
          ) : viewMode === "calendar" ? (
            <div className="space-y-6">
              {dates.map((date) => (
                <Card key={date}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      {formatDate(date !== "TBA" ? date : undefined)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scheduleByDate[date].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg">
                              {item.subject?.name || "N/A"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.school_class?.name || "N/A"}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="h-4 w-4" />
                                {formatTime(item.exam_time)}
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="h-4 w-4" />
                                Duration: {item.duration || 0} mins
                              </div>
                              {item.room && (
                                <div className="flex items-center gap-1 text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  {item.room.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 text-right">
                            <Badge className="bg-blue-100 text-blue-800">
                              Max: {item.max_marks}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800">
                              Pass: {item.pass_marks}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Exam Schedule - List View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {schedule.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold text-gray-400 w-8">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.subject?.name || "N/A"}</h4>
                          <p className="text-sm text-gray-600">
                            {item.school_class?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className="font-medium">{formatDate(item.exam_date)}</div>
                          <div className="text-gray-600">{formatTime(item.exam_time)}</div>
                        </div>
                        <Badge variant="outline">{item.duration || 0} mins</Badge>
                        {item.room && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {item.room.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

