import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { AttendanceRecord } from "@/types/attendance";
import { StatusBadge } from "./status-badge";
import { format } from "date-fns";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  loading?: boolean;
  onRecordClick?: (record: AttendanceRecord) => void;
  showStudent?: boolean;
  showClass?: boolean;
  showSection?: boolean;
  showMarkedBy?: boolean;
  className?: string;
}

/**
 * Reusable attendance table component
 * Displays attendance records in a formatted table
 */
export function AttendanceTable({
  records,
  loading = false,
  onRecordClick,
  showStudent = true,
  showClass = true,
  showSection = true,
  showMarkedBy = true,
  className = ""
}: AttendanceTableProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-2 text-sm text-gray-600">Loading attendance records...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No attendance records found</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Day</TableHead>
            {showStudent && <TableHead>Student</TableHead>}
            {showStudent && <TableHead>Admission No</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Period</TableHead>
            {showClass && <TableHead>Class</TableHead>}
            {showSection && <TableHead>Section</TableHead>}
            <TableHead>Remarks</TableHead>
            {showMarkedBy && <TableHead>Marked By</TableHead>}
            <TableHead>Marked At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow
              key={record.id}
              onClick={() => onRecordClick?.(record)}
              className={onRecordClick ? "cursor-pointer hover:bg-gray-50" : ""}
            >
              <TableCell className="font-medium">
                {format(new Date(record.date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(record.date), "EEEE")}
              </TableCell>
              {showStudent && (
                <TableCell>
                  {record.student
                    ? `${record.student.user.firstName} ${record.student.user.lastName}`
                    : "-"}
                </TableCell>
              )}
              {showStudent && (
                <TableCell>{record.student?.admissionNumber || "-"}</TableCell>
              )}
              <TableCell>
                <StatusBadge status={record.status} />
              </TableCell>
              <TableCell>{record.period || "-"}</TableCell>
              {showClass && (
                <TableCell>{record.schoolClass?.name || "-"}</TableCell>
              )}
              {showSection && (
                <TableCell>{record.section?.name || "-"}</TableCell>
              )}
              <TableCell className="max-w-xs truncate">
                {record.remarks || "-"}
              </TableCell>
              {showMarkedBy && (
                <TableCell className="text-sm text-gray-600">
                  {record.markedBy
                    ? `${record.markedBy.firstName} ${record.markedBy.lastName}`
                    : "-"}
                </TableCell>
              )}
              <TableCell className="text-sm text-gray-600">
                {format(new Date(record.marked_at), "MMM dd, hh:mm a")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
