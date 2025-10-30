/**
 * Attendance Components
 *
 * Reusable components for the attendance module
 * These components can be used across Admin, Teacher, and Student portals
 */

export { StatusBadge } from "./status-badge";
export { StatusIcon } from "./status-icon";
export { StatisticsCards } from "./statistics-cards";
export { DateRangeFilter } from "./date-range-filter";
export { AttendanceTable } from "./attendance-table";

// Legacy components (kept for backward compatibility)
export { default as AttendanceGrid } from "./AttendanceGrid";
export { default as AttendanceHistory } from "./AttendanceHistory";
export { default as ClassSelector } from "./ClassSelector";
export { default as StudentAttendanceList } from "./StudentAttendanceList";
