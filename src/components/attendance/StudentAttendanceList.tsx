"use client";

import React, { useState, useEffect } from 'react';
import { getStudentsForClass, submitAttendance } from '@/services/api/attendance';
import { Student, AttendanceStatus, AttendanceRecord, AttendanceEntry } from '@/types/attendance';

const StudentAttendanceList = ({ classId }: { classId: string }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    if (!classId) return;

    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const studentList = await getStudentsForClass(classId);
        setStudents(studentList);
        // Reset attendance when the class changes
        setAttendance({});
      } catch (error) {
        console.error(`Failed to fetch students for class ${classId}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    const attendanceEntries: AttendanceEntry[] = Object.entries(attendance).map(
      ([studentId, status]) => ({
        studentId,
        status,
      })
    );

    if (attendanceEntries.length === 0) {
      alert('Please mark attendance for at least one student.');
      return;
    }

    const attendanceRecord: AttendanceRecord = {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      classId,
      sectionId: 'A', // NOTE: This is hardcoded for now
      entries: attendanceEntries,
    };

    try {
      const response = await submitAttendance(attendanceRecord);
      alert(response.message || 'Attendance submitted successfully!');
      // Reset the form after successful submission
      setAttendance({});
    } catch (error) {
      console.error('Failed to submit attendance:', error);
      alert('An error occurred while submitting attendance.');
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading students...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Student List</h3>
      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
            </div>
            <div className="flex space-x-2">
              {(['present', 'absent', 'late'] as AttendanceStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(student.id, status)}
                  className={`px-3 py-1 text-sm rounded-full capitalize ${
                    attendance[student.id] === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
};

export default StudentAttendanceList;
