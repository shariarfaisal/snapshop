"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, User } from "lucide-react";

export default function StudentCoursesPage() {
  const courses = [
    { id: "1", name: "Mathematics", code: "MATH101", teacher: "Dr. Sarah Johnson", credits: 4, progress: 75 },
    { id: "2", name: "English Literature", code: "ENG101", teacher: "Prof. Michael Brown", credits: 3, progress: 60 },
    { id: "3", name: "Science", code: "SCI101", teacher: "Dr. Emily Davis", credits: 5, progress: 85 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-gray-500 mt-1">View your enrolled courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <p className="text-sm text-gray-500">{course.code}</p>
                  </div>
                </div>
                <Badge>{course.credits} Credits</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-600" />
                  <span>{course.teacher}</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
