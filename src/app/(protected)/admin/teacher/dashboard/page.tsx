"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ClipboardCheck, FileText, Loader2, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTeacherDashboard } from "@/hooks/use-teacher-dashboard";

export default function TeacherDashboard() {
  const { data: dashboard, isLoading, error } = useTeacherDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Error loading dashboard: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {
    totalClasses: 0,
    totalStudents: 0,
    todayAttendancePercent: 0,
    pendingMarks: 0,
  };

  const statCards = [
    { title: "My Classes", value: stats.totalClasses.toString(), icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Total Students", value: stats.totalStudents.toString(), icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Today's Attendance", value: `${stats.todayAttendancePercent}%`, icon: ClipboardCheck, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Pending Marks", value: stats.pendingMarks.toString(), icon: FileText, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your teaching overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Classes</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/teacher/classes">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {dashboard?.todayClasses && dashboard.todayClasses.length > 0 ? (
              <div className="space-y-3">
                {dashboard.todayClasses.map((cls, i) => (
                  <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 transition">
                    <p className="font-medium text-gray-900">{cls.name}</p>
                    {cls.section && <p className="text-sm text-gray-600">Section: {cls.section}</p>}
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      {cls.startTime && cls.endTime ? `${cls.startTime} - ${cls.endTime}` : "Schedule TBA"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No classes scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.pendingTasks && dashboard.pendingTasks.length > 0 ? (
              <div className="space-y-3">
                {dashboard.pendingTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Type: {task.type.replace("_", " ").toUpperCase()}
                        </p>
                        {task.dueDate && (
                          <p className="text-xs text-orange-600 mt-1">Due: {task.dueDate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No pending tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button asChild className="w-full">
          <Link href="/admin/teacher/attendance">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Mark Attendance
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/admin/teacher/marks">
            <FileText className="mr-2 h-4 w-4" />
            Enter Marks
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/teacher/classes">
            <BookOpen className="mr-2 h-4 w-4" />
            My Classes
          </Link>
        </Button>
      </div>
    </div>
  );
}
