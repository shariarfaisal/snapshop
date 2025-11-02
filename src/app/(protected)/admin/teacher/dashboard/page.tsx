"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, ClipboardCheck, FileText } from "lucide-react";

export default function TeacherDashboard() {
  const stats = [
    { title: "My Classes", value: "5", icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Total Students", value: "245", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Attendance Today", value: "92%", icon: ClipboardCheck, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Pending Marks", value: "12", icon: FileText, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your teaching overview.</p>
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
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Grade 10-A - Mathematics", "Grade 10-B - Mathematics", "Grade 9-A - Algebra"].map((cls, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <p className="font-medium">{cls}</p>
                  <p className="text-sm text-gray-500">9:00 AM - 10:00 AM</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Mark attendance for Grade 10-A", "Enter marks for mid-term exam", "Submit lesson plan"].map((task, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <p className="text-sm">{task}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
