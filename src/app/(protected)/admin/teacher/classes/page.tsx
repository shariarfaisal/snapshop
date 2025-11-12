"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Users, Clock, Zap } from "lucide-react";
import { useTeacherClasses } from "@/hooks/use-teacher-classes";

export default function TeacherClassesPage() {
  const { data: classes, isLoading, error } = useTeacherClasses();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

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
            Error loading classes: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const classList = classes || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-500 mt-1">Manage your assigned classes and students</p>
      </div>

      {classList.length === 0 ? (
        <Card>
          <CardContent className="pt-10 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium">No classes assigned</p>
            <p className="text-sm text-gray-400 mt-1">Contact your administrator to assign classes</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classList.map((classItem) => (
            <Card
              key={classItem.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedClass(classItem.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{classItem.name}</CardTitle>
                {classItem.section && (
                  <p className="text-sm text-gray-600 mt-1">Section: {classItem.section}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Students</p>
                      <p className="font-semibold text-gray-900">{classItem.studentCount || 0}</p>
                    </div>
                  </div>
                  {classItem.schedule && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Schedule</p>
                        <p className="font-semibold text-gray-900 text-sm">{classItem.schedule}</p>
                      </div>
                    </div>
                  )}
                </div>

                {classItem.room && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Room:</span> {classItem.room}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <Button
                    asChild
                    variant="default"
                    className="w-full"
                    size="sm"
                  >
                    <Link href={`/admin/teacher/attendance?class_id=${classItem.id}`}>
                      <Zap className="mr-2 h-4 w-4" />
                      Mark Attendance
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Link href={`/admin/teacher/marks?class_id=${classItem.id}`}>
                      View Marks
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
