"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FileText, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { title: "Attendance Report", description: "Monthly attendance summary", icon: BarChart3 },
    { title: "Academic Performance", description: "Class-wise performance analysis", icon: TrendingUp },
    { title: "Fee Collection", description: "Financial collection report", icon: FileText },
    { title: "Student Enrollment", description: "Enrollment trends and statistics", icon: BarChart3 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">Generate and view institutional reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((report, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <report.icon className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">{report.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Report Name {i}</p>
                  <p className="text-sm text-gray-500">Generated on Nov {i}, 2024</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
