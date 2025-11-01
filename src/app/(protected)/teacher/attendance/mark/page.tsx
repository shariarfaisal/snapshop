"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AttendanceStatus, BulkAttendanceRequest } from "@/types/attendance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBulkCreateAttendance } from "@/hooks/use-attendance";
import { useSchoolClasses } from "@/hooks/use-school-classes";
import { useSections } from "@/hooks/use-sections";
import { useStudents } from "@/hooks/use-student";

interface StudentAttendanceState {
  student_id: number;
  name: string;
  rollNumber?: string;
  status: AttendanceStatus;
  remarks?: string;
}

export default function MarkAttendancePage() {
  const router = useRouter();

  // Form state
  const [classId, setClassId] = useState<number | null>(null);
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [period, setPeriod] = useState(1);
  const [students, setStudents] = useState<StudentAttendanceState[]>([]);

  // Hooks
  const { data: classesData } = useSchoolClasses({ per_page: "all" });
  const { data: sectionsData } = useSections(classId ? { classId } : undefined);
  const studentFilters: any = {
    class_id: classId,
    status: "active",
    per_page: 1000,
    ...(sectionId && { section_id: sectionId }),
  };
  const { data: studentsData, isLoading: loadingStudents } = useStudents(
    classId ? studentFilters : undefined,
    1
  );
  const bulkAttendanceMutation = useBulkCreateAttendance();

  // Handle API response formats
  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || []);
  const sections = Array.isArray(sectionsData) ? sectionsData : (sectionsData?.data || []);

  // Build students state when data loads
  useEffect(() => {
    if (studentsData) {
      const studentData = studentsData.data || [];
      setStudents(
        studentData.map((student: any) => ({
          student_id: student.id,
          name: `${student.user.firstName} ${student.user.lastName}`,
          rollNumber: student.rollNumber,
          status: "present" as AttendanceStatus,
          remarks: "",
        }))
      );
    }
  }, [studentsData]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, status } : s))
    );
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, remarks } : s))
    );
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "present" as AttendanceStatus })));
    toast.success("Marked all students as present");
  };

  const handleMarkAllAbsent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "absent" as AttendanceStatus })));
    toast.success("Marked all students as absent");
  };

  const handleSubmit = () => {
    // Validation
    if (!classId) {
      toast.error("Please select a class");
      return;
    }

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (students.length === 0) {
      toast.error("No students to mark attendance for");
      return;
    }

    const data: BulkAttendanceRequest = {
      class_id: classId,
      section_id: sectionId || undefined,
      date,
      period,
      students: students.map((s) => ({
        student_id: s.student_id,
        status: s.status,
        remarks: s.remarks || undefined,
      })),
    };

    bulkAttendanceMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Attendance marked successfully!");
        router.push("/teacher/attendance");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to mark attendance");
      },
    });
  };

  const getStatusCount = (status: AttendanceStatus) => {
    return students.filter((s) => s.status === status).length;
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const variants: Record<AttendanceStatus, string> = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      late: "bg-yellow-100 text-yellow-800",
      half_day: "bg-blue-100 text-blue-800",
      sick_leave: "bg-purple-100 text-purple-800",
      other_leave: "bg-gray-100 text-gray-800",
    };
    return variants[status];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/teacher/attendance">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-gray-500 mt-1">Record student attendance for your class</p>
        </div>
        <Button onClick={handleSubmit} disabled={bulkAttendanceMutation.isPending || students.length === 0}>
          {bulkAttendanceMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Submit Attendance
            </>
          )}
        </Button>
      </div>

      {/* Class & Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class *</label>
              <Select
                value={classId?.toString() || ""}
                onValueChange={(value) => {
                  setClassId(parseInt(value));
                  setStudents([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Select
                value={sectionId?.toString() || ""}
                onValueChange={(value) => {
                  setSectionId(value ? parseInt(value) : null);
                  setStudents([]);
                }}
                disabled={!classId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sections</SelectItem>
                  {sections.map((sec) => (
                    <SelectItem key={sec.id} value={sec.id.toString()}>
                      {sec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date *</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Period</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={period}
                onChange={(e) => setPeriod(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{getStatusCount("present")}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{getStatusCount("absent")}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Late</p>
                  <p className="text-2xl font-bold text-yellow-600">{getStatusCount("late")}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Marking */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Student List</CardTitle>
            {students.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleMarkAllPresent}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark All Present
                </Button>
                <Button variant="outline" size="sm" onClick={handleMarkAllAbsent}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Mark All Absent
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!classId ? (
            <div className="text-center py-8 text-gray-500">
              Please select a class to load students
            </div>
          ) : loadingStudents ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No students found for the selected class
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student, index) => (
                <div
                  key={student.student_id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {index + 1}. {student.name}
                    </p>
                    {student.rollNumber && (
                      <p className="text-sm text-gray-500">Roll No: {student.rollNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={student.status}
                      onValueChange={(value) =>
                        handleStatusChange(student.student_id, value as AttendanceStatus)
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="half_day">Half Day</SelectItem>
                        <SelectItem value="sick_leave">Sick Leave</SelectItem>
                        <SelectItem value="other_leave">Other Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={getStatusBadge(student.status)}>
                      {student.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Input
                      placeholder="Remarks (optional)"
                      className="w-[200px]"
                      value={student.remarks}
                      onChange={(e) => handleRemarksChange(student.student_id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Actions */}
      {students.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/teacher/attendance")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={bulkAttendanceMutation.isPending}>
            {bulkAttendanceMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submit Attendance
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
