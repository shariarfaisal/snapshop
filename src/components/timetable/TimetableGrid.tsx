import React from 'react';
import { ClassTimetable, DayOfWeek, Period } from '@/types/timetable';

interface TimetableGridProps {
  timetable: ClassTimetable | null;
}

const TimetableGrid = ({ timetable }: TimetableGridProps) => {
  if (!timetable) {
    return <p className="p-4 text-center text-gray-500">Timetable data is not available.</p>;
  }

  // Determine all unique periods from the timetable slots
  const periods = Array.from(new Set(timetable.slots.map(slot => `${slot.period.startTime}-${slot.period.endTime}`)))
    .map(p => {
      const [startTime, endTime] = p.split('-');
      return { startTime, endTime };
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Weekly Timetable</h2>
      <div className="border rounded-lg overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-semibold">Time</th>
              {days.map(day => (
                <th key={day} className="p-3 text-left font-semibold">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => (
              <tr key={period.startTime}>
                <td className="p-3 border font-medium text-gray-700">{`${period.startTime} - ${period.endTime}`}</td>
                {days.map(day => {
                  const slot = timetable.slots.find(
                    s => s.day === day && s.period.startTime === period.startTime
                  );
                  return (
                    <td key={day} className="p-3 border">
                      {slot ? (
                        <div>
                          <p className="font-semibold">{slot.subjectId}</p>
                          <p className="text-sm text-gray-600">{slot.teacherId}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableGrid;
