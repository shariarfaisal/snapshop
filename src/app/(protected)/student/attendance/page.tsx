"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { AttendanceRecord, AttendanceStatus } from "@/types/attendance";
import { toast } from "sonner";
import { format } from "date-fns";
import { useStudentAttendance } from "@/hooks/use-attendance";

// Helper function to get status badge
const getStatusBadge = (status: AttendanceStatus) => {
  const statusConfig = {
    present: { label: "Present", className: "bg-green-100 text-green-800 hover:bg-green-100" },
    absent: { label: "Absent", className: "bg-red-100 text-red-800 hover:bg-red-100" },
    late: { label: "Late", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    half_day: { label: "Half Day", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
    sick_leave: {
      label: "Sick Leave",
      className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    },
    other_leave: { label: "Other Leave", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
  };

  const config = statusConfig[status] || statusConfig.absent;
  return <Badge className={config.className}>{config.label}</Badge>;
};

// Helper function to get status icon
const getStatusIcon = (status: AttendanceStatus) => {
  switch (status) {
    case "present":
      return <CheckCircle className="h-8 w-8 text-green-600" />;
    case "absent":
      return <XCircle className="h-8 w-8 text-red-600" />;
    case "late":
      return <Clock className="h-8 w-8 text-yellow-600" />;
    case "half_day":
      return <AlertCircle className="h-8 w-8 text-blue-600" />;
    case "sick_leave":
    case "other_leave":
      return <Calendar className="h-8 w-8 text-purple-600" />;
    default:
      return <XCircle className="h-8 w-8 text-gray-600" />;
  }
};

export default function StudentAttendancePage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [studentId, setStudentId] = useState<number | null>(null);

  // Set default date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setToDate(format(today, "yyyy-MM-dd"));
    setFromDate(format(thirtyDaysAgo, "yyyy-MM-dd"));
  }, []);

  // Fetch student ID from auth context/localStorage
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.id) {
            setStudentId(user.id);
          }
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Failed to load student information");
      }
    };

    fetchStudentData();
  }, []);

  // Build filters
  const filters: any = {};
  if (fromDate) filters.from_date = fromDate;
  if (toDate) filters.to_date = toDate;

  // Hooks
  const { data: attendanceData, isLoading: loading } = useStudentAttendance(studentId, filters);

  // Handle API response format
  const attendance = Array.isArray(attendanceData) ? attendanceData : [];

  // Calculate statistics
  const statistics = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
    half_day: attendance.filter((a) => a.status === "half_day").length,
    sick_leave: attendance.filter((a) => a.status === "sick_leave").length,
    other_leave: attendance.filter((a) => a.status === "other_leave").length,
  };

  // Calculate attendance percentage
  const attended = statistics.present + statistics.late + statistics.half_day * 0.5;
  const attendancePercentage =
    statistics.total > 0 ? ((attended / statistics.total) * 100).toFixed(1) : "0.0";

  // Handle clear filters
  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground mt-1">View your attendance history and statistics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Attendance Percentage */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-blue-700 font-medium">Attendance %</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-900">{attendancePercentage}%</div>
                <p className="text-xs text-blue-700 mt-1">of {statistics.total} days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Present */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Present</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{statistics.present}</div>
                <p className="text-xs text-gray-600 mt-1">days</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Absent */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Absent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{statistics.absent}</div>
                <p className="text-xs text-gray-600 mt-1">days</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        {/* Late */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Late</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{statistics.late}</div>
                <p className="text-xs text-gray-600 mt-1">days</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Half Day */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Half Day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">{statistics.half_day}</div>
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Sick Leave */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sick Leave</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-600">{statistics.sick_leave}</div>
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        {/* Other Leave */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Other Leave</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-600">{statistics.other_leave}</div>
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Attendance</CardTitle>
          <CardDescription>Filter attendance records by date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="from_date">From Date</Label>
              <Input
                id="from_date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="to_date">To Date</Label>
              <Input
                id="to_date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Your attendance records{" "}
            {fromDate &&
              toDate &&
              `from ${format(new Date(fromDate), "MMM dd, yyyy")} to ${format(
                new Date(toDate),
                "MMM dd, yyyy"
              )}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Loading attendance...</p>
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No attendance records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Marked At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{format(new Date(record.date), "EEEE")}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.period || "-"}</TableCell>
                      <TableCell>{record.school_class?.name || "-"}</TableCell>
                      <TableCell>{record.section?.name || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">{record.remarks || "-"}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(record.marked_at), "MMM dd, hh:mm a")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
