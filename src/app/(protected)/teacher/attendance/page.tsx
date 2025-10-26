"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("grade-10-a");
  const students = [
    { id: "1", name: "John Doe", regNo: "STU001", status: "present", time: "08:15" },
    { id: "2", name: "Jane Smith", regNo: "STU002", status: "present", time: "08:12" },
    { id: "3", name: "Mike Johnson", regNo: "STU003", status: "absent", time: "-" },
    { id: "4", name: "Sarah Williams", regNo: "STU004", status: "late", time: "08:35" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <p className="text-gray-500 mt-1">Record daily student attendance</p>
        </div>
        <Button>Submit Attendance</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Class Attendance</CardTitle>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grade-10-a">Grade 10-A</SelectItem>
                <SelectItem value="grade-10-b">Grade 10-B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.regNo}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {student.time}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={student.status === "present" ? "default" : "outline"}
                      size="sm"
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Present
                    </Button>
                    <Button
                      variant={student.status === "absent" ? "default" : "outline"}
                      size="sm"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Absent
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
