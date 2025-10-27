"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, GraduationCap, UserCheck, DollarSign, TrendingUp, TrendingDown, AlertCircle, Loader2 } from "lucide-react";
import { dashboardService, AdminDashboardData } from "@/services/api/dashboard";

export default function AdminDashboard() {
  const { getDisplayName, getInstituteName } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getAdminDashboard();
        setDashboardData(data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Build stats from API data or use defaults
  const stats = dashboardData?.statistics ? [
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
  ] : [
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
      <div className="p-6 space-y-6 flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome {getDisplayName()}! Here's what's happening in {getInstituteName()}.</p>
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
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
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
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
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
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Student</p>
                <p className="text-xs text-gray-500 mt-1">Register new student</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <UserCheck className="h-5 w-5 text-green-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Teacher</p>
                <p className="text-xs text-gray-500 mt-1">Register new teacher</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <GraduationCap className="h-5 w-5 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Create Class</p>
                <p className="text-xs text-gray-500 mt-1">Setup new class</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                <DollarSign className="h-5 w-5 text-orange-600 mb-2" />
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
          <CardTitle>Today's Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 font-medium">Present</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{attendanceStats.today_present}</p>
              <p className="text-xs text-green-600 mt-1">{attendanceStats.today_percentage}% of students</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700 font-medium">Absent</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{attendanceStats.today_absent}</p>
              <p className="text-xs text-red-600 mt-1">Total marked</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700 font-medium">Total Records</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{attendanceStats.today_total}</p>
              <p className="text-xs text-yellow-600 mt-1">Today</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">Institute</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{getInstituteName().split(" ")[0]}</p>
              <p className="text-xs text-blue-600 mt-1">Current institute</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
