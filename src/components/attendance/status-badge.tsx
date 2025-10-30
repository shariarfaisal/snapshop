import { Badge } from "@/components/ui/badge";
import { AttendanceStatus } from "@/types/attendance";

interface StatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

/**
 * Reusable status badge component for attendance records
 * Displays color-coded badges based on attendance status
 */
export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const statusConfig = {
    present: {
      label: "Present",
      className: "bg-green-100 text-green-800 hover:bg-green-100"
    },
    absent: {
      label: "Absent",
      className: "bg-red-100 text-red-800 hover:bg-red-100"
    },
    late: {
      label: "Late",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    },
    half_day: {
      label: "Half Day",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100"
    },
    sick_leave: {
      label: "Sick Leave",
      className: "bg-purple-100 text-purple-800 hover:bg-purple-100"
    },
    other_leave: {
      label: "Other Leave",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100"
    },
  };

  const config = statusConfig[status] || statusConfig.absent;

  return (
    <Badge className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
}
