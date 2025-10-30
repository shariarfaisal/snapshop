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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { attendanceService } from "@/services/api/attendance";
import {
  AttendanceRecord,
  AttendanceFilters,
  AttendanceStatistics,
  AttendanceStatus,
} from "@/types/attendance";
import { schoolClassService } from "@/services/schoolClass";
import { sectionService } from "@/services/section";
import { format } from "date-fns";

export default function AdminAttendancePage() {
  // State
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [filters, setFilters] = useState<AttendanceFilters>({
    class_id: "all",
    section_id: "all",
    status: "all",
    search: "",
    date: "",
    from_date: "",
    to_date: "",
    per_page: 15,
  });

  // Data
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>("present");
  const [editRemarks, setEditRemarks] = useState("");
  const [updating, setUpdating] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
    loadStatistics();
    loadClasses();
  }, [currentPage, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAll(filters, currentPage);
      setAttendance(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
      setTotal(data.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await attendanceService.getStatistics(filters);
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to load statistics", error);
    }
  };

  const loadClasses = async () => {
    try {
      const classesData = await schoolClassService.getAll();
      setClasses(classesData.data || classesData);
    } catch (error) {
      console.error("Failed to load classes", error);
    }
  };

  const loadSections = async (classId: number) => {
    try {
      const sectionsData = await sectionService.getAll({ classId });
      setSections(sectionsData.data || sectionsData);
    } catch (error) {
      console.error("Failed to load sections", error);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const data = await attendanceService.export(filters);

      if (data.length === 0) {
        toast.info("No attendance records to export");
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0] || {});
      const csv = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((header) => `"${row[header as keyof typeof row] || ""}"`).join(",")
        ),
      ].join("\n");

      // Download
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();

      toast.success("Attendance exported successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to export attendance");
    } finally {
      setExporting(false);
    }
  };

  const handleEdit = (record: AttendanceRecord) => {
    setSelectedAttendance(record);
    setEditStatus(record.status);
    setEditRemarks(record.remarks || "");
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedAttendance) return;

    try {
      setUpdating(true);
      await attendanceService.update(selectedAttendance.id, {
        status: editStatus,
        remarks: editRemarks,
      });
      toast.success("Attendance updated successfully");
      setEditDialogOpen(false);
      loadData();
      loadStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update attendance");
    } finally {
      setUpdating(false);
    }
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

  const getStatusIcon = (status: AttendanceStatus) => {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-500 mt-1">Track and manage daily student attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.present}</p>
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
                  <p className="text-2xl font-bold text-red-600">{statistics.absent}</p>
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
                  <p className="text-2xl font-bold text-yellow-600">{statistics.late}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold">{statistics.present_percentage.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, search: e.target.value }));
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={filters.class_id?.toString() || "all"}
              onValueChange={(value) => {
                setFilters((prev) => ({ ...prev, class_id: value, section_id: "all" }));
                setCurrentPage(1);
                setSections([]);
                if (value !== "all") {
                  loadSections(parseInt(value));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.section_id?.toString() || "all"}
              onValueChange={(value) => {
                setFilters((prev) => ({ ...prev, section_id: value }));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map((sec) => (
                  <SelectItem key={sec.id} value={sec.id.toString()}>
                    {sec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status?.toString() || "all"}
              onValueChange={(value) => {
                setFilters((prev) => ({ ...prev, status: value as any }));
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
                <SelectItem value="half_day">Half Day</SelectItem>
                <SelectItem value="sick_leave">Sick Leave</SelectItem>
                <SelectItem value="other_leave">Other Leave</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="From Date"
              value={filters.from_date}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, from_date: e.target.value }));
                setCurrentPage(1);
              }}
            />
            <Input
              type="date"
              placeholder="To Date"
              value={filters.to_date}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, to_date: e.target.value }));
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No attendance records found</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Admission No</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Marked By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
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
                        <TableCell>{record.student?.admissionNumber || "-"}</TableCell>
                        <TableCell>{record.schoolClass?.name || "-"}</TableCell>
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
                        <TableCell>
                          {record.markedBy
                            ? `${record.markedBy.firstName} ${record.markedBy.lastName}`
                            : "System"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
            <DialogDescription>
              Update attendance status and remarks for{" "}
              {selectedAttendance?.student
                ? `${selectedAttendance.student.user.firstName} ${selectedAttendance.student.user.lastName}`
                : "student"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={editStatus} onValueChange={(value) => setEditStatus(value as AttendanceStatus)}>
                <SelectTrigger>
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
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Remarks (Optional)</label>
              <Input
                placeholder="Add any remarks..."
                value={editRemarks}
                onChange={(e) => setEditRemarks(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
