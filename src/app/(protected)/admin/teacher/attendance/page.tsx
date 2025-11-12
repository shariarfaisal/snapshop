"use client";

import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useTeacherAttendance } from "@/hooks/use-teacher-attendance";

export default function TeacherAttendancePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    classId: undefined as number | undefined,
    status: "all",
    from_date: "",
    to_date: "",
    per_page: 15,
    page: currentPage,
  });

  const { data: attendanceData, isLoading } = useTeacherAttendance(filters);

  const attendance = attendanceData?.data || [];
  const totalPages = attendanceData?.pagination?.last_page || attendanceData?.last_page || 1;
  const total = attendanceData?.pagination?.total || attendanceData?.total || 0;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      present: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
      late: "bg-yellow-100 text-yellow-800",
      half_day: "bg-blue-100 text-blue-800",
      sick_leave: "bg-purple-100 text-purple-800",
      other_leave: "bg-gray-100 text-gray-800",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4" />;
      case "absent":
        return <XCircle className="h-4 w-4" />;
      case "late":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance History</h1>
          <p className="text-gray-500 mt-1">View attendance records for your classes</p>
        </div>
        <Button asChild>
          <Link href="/admin/teacher/attendance/mark">
            <Plus className="mr-2 h-4 w-4" />
            Mark Attendance
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={filters.status}
              onValueChange={(val) => {
                setFilters((prev) => ({ ...prev, status: val, page: 1 }));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="sick_leave">Sick Leave</SelectItem>
                <SelectItem value="other_leave">Other Leave</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="From Date"
              value={filters.from_date}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, from_date: e.target.value, page: 1 }));
                setCurrentPage(1);
              }}
            />
            <Input
              type="date"
              placeholder="To Date"
              value={filters.to_date}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, to_date: e.target.value, page: 1 }));
                setCurrentPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No attendance records found</p>
              <Button className="mt-4" asChild>
                <Link href="/admin/teacher/attendance/mark">
                  <Plus className="mr-2 h-4 w-4" />
                  Mark Attendance
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {format(new Date(record.date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {record.student
                            ? `${record.student.user.firstName} ${record.student.user.lastName}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>{record.school_class?.name || "-"}</TableCell>
                        <TableCell>{record.section?.name || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(record.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(record.status)}
                              {record.status.replace("_", " ").toUpperCase()}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>{record.period || 1}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {record.remarks || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * (filters.per_page || 15) + 1} to{" "}
                  {Math.min(currentPage * (filters.per_page || 15), total)} of {total} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
