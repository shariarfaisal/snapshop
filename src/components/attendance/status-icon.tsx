import { CheckCircle, XCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import { AttendanceStatus } from "@/types/attendance";

interface StatusIconProps {
  status: AttendanceStatus;
  className?: string;
  size?: number;
}

/**
 * Reusable status icon component for attendance records
 * Displays appropriate icon based on attendance status
 */
export function StatusIcon({ status, className = "", size = 8 }: StatusIconProps) {
  const sizeClass = `h-${size} w-${size}`;

  switch (status) {
    case "present":
      return <CheckCircle className={`${sizeClass} text-green-600 ${className}`} />;
    case "absent":
      return <XCircle className={`${sizeClass} text-red-600 ${className}`} />;
    case "late":
      return <Clock className={`${sizeClass} text-yellow-600 ${className}`} />;
    case "half_day":
      return <AlertCircle className={`${sizeClass} text-blue-600 ${className}`} />;
    case "sick_leave":
    case "other_leave":
      return <Calendar className={`${sizeClass} text-purple-600 ${className}`} />;
    default:
      return <XCircle className={`${sizeClass} text-gray-600 ${className}`} />;
  }
}
