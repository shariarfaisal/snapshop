"use client";

import React from 'react';
import { AttendanceStatus } from '@/types/attendance';

interface AttendanceHistoryItem {
  date: string;
  status: AttendanceStatus;
  remark?: string;
}

const AttendanceHistory = ({ history }: { history: AttendanceHistoryItem[] }) => {
  if (!history || history.length === 0) {
    return <p className="p-4 text-center text-gray-500">No attendance records found.</p>;
  }

  const getStatusClasses = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 space-y-3">
      {history.map((item, index) => (
        <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border">
          <div>
            <p className="font-semibold">{new Date(item.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
            {item.remark && <p className="text-sm text-gray-600">Remark: {item.remark}</p>}
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusClasses(item.status)}`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AttendanceHistory;
