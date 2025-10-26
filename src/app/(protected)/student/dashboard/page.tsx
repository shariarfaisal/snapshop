"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, ClipboardCheck, AlertCircle } from "lucide-react";

export default function StudentDashboard() {
  const stats = [
    { title: "Enrolled Courses", value: "8", icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Overall GPA", value: "3.8", icon: Trophy, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { title: "Attendance", value: "92%", icon: ClipboardCheck, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Pending Fees", value: "$1,250", icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-50" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your academic overview.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Mathematics - 9:00 AM", "English - 10:00 AM", "Science - 11:00 AM"].map((cls, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <p className="font-medium">{cls}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Mathematics: A+", "English: A", "Science: A-"].map((grade, i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                  <span>{grade.split(":")[0]}</span>
                  <span className="font-bold text-green-600">{grade.split(":")[1]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
