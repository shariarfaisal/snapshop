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
  Book,
  Calendar,
  FileText,
  BarChart3,
  Bell,
  Settings,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/use-dashboard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { getDisplayName } = useAuthStore();
  const router = useRouter();

  // Hooks
  const { data: dashboardData, isLoading: loading, error: queryError } = useAdminDashboard();

  // Quick actions with URLs
  const quickActions = [
    { icon: Users, title: "Add Student", subtitle: "Register new", url: "/admin/users/create" },
    { icon: UserCheck, title: "Add Teacher", subtitle: "Register new", url: "/admin/users/create" },
    { icon: GraduationCap, title: "Create Class", subtitle: "Setup new", url: "/admin/academic" },
    { icon: DollarSign, title: "Create Invoice", subtitle: "Fee invoice", url: "/admin/finance" },
    { icon: ClipboardList, title: "Mark Attendance", subtitle: "Daily records", url: "/admin/attendance" },
    { icon: Book, title: "Grades Entry", subtitle: "Enter marks", url: "/admin/exams" },
    { icon: Calendar, title: "Timetable", subtitle: "View/manage", url: "/admin/academic" },
    { icon: BarChart3, title: "Reports", subtitle: "Analytics", url: "/admin/reports" },
    { icon: FileText, title: "ID Cards", subtitle: "Generate", url: "/admin/students" },
    { icon: Bell, title: "Announcements", subtitle: "Send notice", url: "/admin/forms" },
    { icon: CreditCard, title: "Payments", subtitle: "Manage fees", url: "/admin/finance" },
    { icon: Settings, title: "Settings", subtitle: "Configure", url: "/settings" },
  ];

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



  // Attendance data from API or defaults (removed - no longer needed)
  // const attendanceStats = dashboardData?.attendance || {
  //   today_total: 2845,
  //   today_present: 2456,
  //   today_absent: 245,
  //   today_percentage: 86.3,
  // };

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
          Welcome back, {getDisplayName()}! Here's what's happening today.
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

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Quick Actions - Expanded */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.url}
                  className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <action.icon className="h-5 w-5 text-gray-700 mb-2 mx-auto" />
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.subtitle}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
