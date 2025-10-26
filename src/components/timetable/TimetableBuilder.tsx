"use client";

import React, { useState, useEffect } from 'react';
import { DayOfWeek, Period, TimetableSlot } from '@/types/timetable';
import { getSubjects, getTeachers, saveTimetable } from '@/services/api/timetable';

// Mock data for classes
const classes = [
  { id: 'c_9', name: 'Class 9', section: 'A' },
  { id: 'c_10', name: 'Class 10', section: 'B' },
];

const TimetableBuilder = () => {
  const [selectedClassId, setSelectedClassId] = useState<string>('c_9');
  const [periods, setPeriods] = useState<Period[]>([
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
  ]);
  const [timetable, setTimetable] = useState<Record<string, Partial<TimetableSlot>>>({});
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Fetch subjects and teachers on component mount
    const fetchData = async () => {
      setSubjects(await getSubjects());
      setTeachers(await getTeachers());
    };
    fetchData();
  }, []);

  const handleSlotChange = (day: DayOfWeek, period: Period, field: 'subjectId' | 'teacherId', value: string) => {
    const key = `${day}-${period.startTime}`;
    setTimetable(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSave = async () => {
    const slots: TimetableSlot[] = Object.entries(timetable)
      .map(([key, slot]) => {
        const [day, startTime] = key.split('-');
        const period = periods.find(p => p.startTime === startTime);
        if (!period || !slot.subjectId || !slot.teacherId) return null;
        return { day: day as DayOfWeek, period, subjectId: slot.subjectId, teacherId: slot.teacherId };
      })
      .filter((slot): slot is TimetableSlot => slot !== null);

    const result = await saveTimetable({ classId: selectedClassId, sectionId: 'A', slots });
    alert(result.message);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {/* Class selector would go here */}
      </div>
      <div className="border rounded-lg overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Time</th>
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[]).map(day => (
                <th key={day} className="p-3 text-left">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => (
              <tr key={period.startTime}>
                <td className="p-2 border">{`${period.startTime} - ${period.endTime}`}</td>
                {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[]).map(day => (
                  <td key={day} className="p-2 border">
                    <div>
                      <select
                        value={timetable[`${day}-${period.startTime}`]?.subjectId || ''}
                        onChange={(e) => handleSlotChange(day, period, 'subjectId', e.target.value)}
                        className="w-full mb-2 p-1 border rounded"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <select
                        value={timetable[`${day}-${period.startTime}`]?.teacherId || ''}
                        onChange={(e) => handleSlotChange(day, period, 'teacherId', e.target.value)}
                        className="w-full p-1 border rounded"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleSave} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Save Timetable
      </button>
    </div>
  );
};

export default TimetableBuilder;
