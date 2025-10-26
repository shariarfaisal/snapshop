"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, CheckCircle, XCircle } from "lucide-react";

export default function AttendancePage() {
  const attendance = [
    { id: "1", name: "John Doe", regNo: "STU001", status: "Present", time: "08:15 AM" },
    { id: "2", name: "Jane Smith", regNo: "STU002", status: "Present", time: "08:12 AM" },
    { id: "3", name: "Mike Johnson", regNo: "STU003", status: "Absent", time: "-" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-gray-500 mt-1">Track daily student attendance</p>
        </div>
        <Button><Download className="mr-2 h-4 w-4" />Export Report</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-green-600">2,456</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-red-600">245</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold">90.9%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-blue-600">55</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mark Attendance</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="grade-10-a">
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade-10-a">Grade 10-A</SelectItem>
                  <SelectItem value="grade-10-b">Grade 10-B</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline"><Calendar className="mr-2 h-4 w-4" />Today</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendance.map(student => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.regNo}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{student.time}</span>
                  <Button variant={student.status === "Present" ? "default" : "outline"} size="sm">
                    {student.status === "Present" ? <CheckCircle className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                    {student.status}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
