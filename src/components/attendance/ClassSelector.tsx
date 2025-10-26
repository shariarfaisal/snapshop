"use client";

import React, { useState, useEffect } from 'react';
import { getTeacherClasses } from '@/services/api/attendance';

interface TeacherClass {
  id: string;
  name: string;
  section: string;
}

const ClassSelector = ({ onClassSelect }: { onClassSelect: (classId: string) => void }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const teacherClasses = await getTeacherClasses();
        setClasses(teacherClasses);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        // Handle error state in the UI if necessary
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    onClassSelect(classId);
  };

  if (isLoading) {
    return <div className="p-4">Loading classes...</div>;
  }

  return (
    <div className="p-4">
      <label htmlFor="class-selector" className="block text-sm font-medium text-gray-700 mb-2">
        Select Class & Section
      </label>
      <select
        id="class-selector"
        value={selectedClass}
        onChange={handleSelection}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="" disabled>-- Select a class --</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} - Section {c.section}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClassSelector;
