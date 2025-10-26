"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, ClipboardCheck, AlertCircle } from "lucide-react";

export default function ParentDashboard() {
  const children = [
    { name: "John Doe", class: "Grade 10-A", attendance: "95%", gpa: "3.9" },
    { name: "Jane Doe", class: "Grade 8-B", attendance: "92%", gpa: "3.7" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor your children's academic progress</p>
      </div>
      
      {children.map((child, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>{child.name} - {child.class}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">GPA</p>
                  <p className="text-xl font-bold">{child.gpa}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Attendance</p>
                  <p className="text-xl font-bold">{child.attendance}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending Fees</p>
                  <p className="text-xl font-bold">$1,250</p>
                </div>
              </div>
              <div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Recent Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Parent-Teacher meeting on Dec 15", "Mid-term results published", "School holiday on Dec 25"].map((notice, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <p>{notice}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
