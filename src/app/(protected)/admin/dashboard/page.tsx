"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  GraduationCap,
  UserCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/use-dashboard";

export default function AdminDashboard() {
  const { getDisplayName, getInstituteName } = useAuthStore();

  // Hooks
  const { data: dashboardData, isLoading: loading, error: queryError } = useAdminDashboard();

  // Handle error
  const error = queryError
    ? (queryError as any)?.response?.data?.message || "Failed to load dashboard data"
    : null;

  // Build stats from API data or use defaults
  const stats = dashboardData?.statistics
    ? [
        {
          title: "Total Students",
          value: dashboardData.statistics.total_students,
          change: "+12.5%",
          trend: "up",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Total Teachers",
          value: dashboardData.statistics.total_teachers,
          change: "+3.2%",
          trend: "up",
          icon: UserCheck,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Active Classes",
          value: dashboardData.statistics.total_classes,
          change: "+5.1%",
          trend: "up",
          icon: GraduationCap,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          title: "Active Students",
          value: dashboardData.statistics.active_students,
          change: "+8.3%",
          trend: "up",
          icon: DollarSign,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
      ]
    : [
        {
          title: "Total Students",
          value: "2,845",
          change: "+12.5%",
          trend: "up",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          title: "Total Teachers",
          value: "142",
          change: "+3.2%",
          trend: "up",
          icon: UserCheck,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          title: "Active Classes",
          value: "68",
          change: "+5.1%",
          trend: "up",
          icon: GraduationCap,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          title: "Revenue (Monthly)",
          value: "$125,450",
          change: "+8.3%",
          trend: "up",
          icon: DollarSign,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
      ];

  const recentActivities = [
    { type: "admission", message: "New admission application from John Doe", time: "2 hours ago" },
    { type: "payment", message: "Payment received from Jane Smith - $1,250", time: "3 hours ago" },
    { type: "exam", message: "Mid-term exam results published for Grade 10", time: "5 hours ago" },
    { type: "attendance", message: "Daily attendance marked for all classes", time: "1 day ago" },
  ];

  // Attendance data from API or defaults
  const attendanceStats = dashboardData?.attendance || {
    today_total: 2845,
    today_present: 2456,
    today_absent: 245,
    today_percentage: 86.3,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <p className="text-sm text-gray-600 mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Welcome back, {getDisplayName()}! Here's what's happening in {getInstituteName()}.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-3">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-100">
                  <stat.icon className="h-6 w-6 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-gray-700 mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Student</p>
                <p className="text-xs text-gray-500 mt-1">Register new student</p>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <UserCheck className="h-5 w-5 text-gray-700 mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Teacher</p>
                <p className="text-xs text-gray-500 mt-1">Register new teacher</p>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <GraduationCap className="h-5 w-5 text-gray-700 mb-2" />
                <p className="text-sm font-medium text-gray-900">Create Class</p>
                <p className="text-xs text-gray-500 mt-1">Setup new class</p>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <DollarSign className="h-5 w-5 text-gray-700 mb-2" />
                <p className="text-sm font-medium text-gray-900">Generate Invoice</p>
                <p className="text-xs text-gray-500 mt-1">Create fee invoice</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Today's Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Present</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {attendanceStats.today_present}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {attendanceStats.today_percentage}% of students
              </p>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Absent</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">{attendanceStats.today_absent}</p>
              <p className="text-xs text-gray-500 mt-2">Total marked</p>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Total Records</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {attendanceStats.today_total}
              </p>
              <p className="text-xs text-gray-500 mt-2">Today</p>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Institute</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {getInstituteName().split(" ")[0]}
              </p>
              <p className="text-xs text-gray-500 mt-2">Current institute</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
