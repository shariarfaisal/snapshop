"use client";

import React, { useState, useEffect } from 'react';
import { getStudentsForExam, submitMarks } from '@/services/api/marks';
import { MarkEntry } from '@/types/marks';

interface MarksEntryFormProps {
  examId: string;
}

const MarksEntryForm = ({ examId }: MarksEntryFormProps) => {
  const [students, setStudents] = useState<MarkEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;
    setIsLoading(true);
    getStudentsForExam(examId)
      .then(setStudents)
      .finally(() => setIsLoading(false));
  }, [examId]);

  const handleMarkChange = (studentId: string, score: string) => {
    const newScore = score === '' ? null : parseInt(score, 10);
    setStudents(prev =>
      prev.map(s => (s.studentId === studentId ? { ...s, score: newScore } : s))
    );
  };

  const handleSubmit = async () => {
    const marks = students.map(({ studentId, score }) => ({ studentId, score }));
    const result = await submitMarks({ examId, marks });
    alert(result.message);
  };

  if (isLoading) return <p className="p-4 text-center">Loading student list...</p>;

  return (
    <div className="p-4">
      <div className="space-y-4">
        {students.map(student => (
          <div key={student.studentId} className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">{student.studentName}</span>
            <input
              type="number"
              value={student.score ?? ''}
              onChange={(e) => handleMarkChange(student.studentId, e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter marks"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
      >
        Submit Marks
      </button>
    </div>
  );
};

export default MarksEntryForm;
