import { AttendanceRecord } from '@/types/attendance';

// This is a placeholder for the API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';


/**
 * Fetches the attendance records for the currently logged-in student.
 */
export const getStudentAttendance = async () => {
  // In a real application, you would fetch data for the logged-in student
  console.log('Fetching student attendance...');
  return [
    { date: '2025-10-18', status: 'present' },
    { date: '2025-10-17', status: 'present' },
    { date: '2025-10-16', status: 'absent', remark: 'Sick leave' },
    { date: '2025-10-15', status: 'late' },
  ];
};


/**
 * Fetches the list of classes for the currently logged-in teacher.
 */
export const getTeacherClasses = async () => {
  // In a real application, you would make a fetch call like this:
  // const response = await fetch(`${API_BASE_URL}/teacher/classes`);
  // const data = await response.json();
  // return data;

  // Returning hardcoded data for now
  console.log('Fetching teacher classes...');
  return [
    { id: 'c_1', name: 'Class 9', section: 'A' },
    { id: 'c_2', name: 'Class 9', section: 'B' },
    { id: 'c_3', name: 'Class 10', section: 'A' },
  ];
};

/**
 * Fetches the list of students for a given class and section.
 * @param classId - The ID of the class.
 * @param sectionId - The ID of the section.
 */
export const getStudentsForClass = async (classId: string) => {
  // In a real application, you would make a fetch call like this:
  // const response = await fetch(`${API_BASE_URL}/students?classId=${classId}`);
  // const data = await response.json();
  // return data;

  // Returning hardcoded data based on classId for now
  console.log(`Fetching students for class ${classId}...`);
  if (classId === 'c_1' || classId === 'c_2') {
    return [
      { id: 'std_101', name: 'Alice Smith', rollNo: 1 },
      { id: 'std_102', name: 'Bob Johnson', rollNo: 2 },
      { id: 'std_103', name: 'Charlie Brown', rollNo: 3 },
    ];
  }
  return [];
};

/**
 * Submits the attendance record to the server.
 * @param attendanceRecord - The attendance data to submit.
 */
export const submitAttendance = async (attendanceRecord: AttendanceRecord) => {
  // In a real application, you would make a fetch call like this:
  // const response = await fetch(`${API_BASE_URL}/attendance`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(attendanceRecord),
  // });
  // if (!response.ok) {
  //   throw new Error('Failed to submit attendance');
  // }
  // return response.json();

  console.log('Submitting attendance record:', attendanceRecord);
  return { success: true, message: 'Attendance submitted successfully!' };
};
