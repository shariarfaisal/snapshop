"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Upload } from "lucide-react";

export default function TeacherMarksPage() {
  const students = [
    { id: "1", name: "John Doe", regNo: "STU001", marks: "85" },
    { id: "2", name: "Jane Smith", regNo: "STU002", marks: "92" },
    { id: "3", name: "Mike Johnson", regNo: "STU003", marks: "78" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marks Entry</h1>
          <p className="text-gray-500 mt-1">Enter and manage student marks</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Marks
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Select defaultValue="mid-term">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mid-term">Mid-Term Exam</SelectItem>
                <SelectItem value="final">Final Exam</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="mathematics">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.regNo}</p>
                </div>
                <Input
                  type="number"
                  defaultValue={student.marks}
                  className="w-24"
                  placeholder="Marks"
                  max="100"
                />
                <span className="text-sm text-gray-600">/ 100</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
