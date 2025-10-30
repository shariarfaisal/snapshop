"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types/student";
import { Mail, Phone, Calendar, MapPin, User, GraduationCap, Hash } from "lucide-react";

interface StudentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function StudentDetailsDialog({
  open,
  onOpenChange,
  student,
}: StudentDetailsDialogProps) {
  if (!student) return null;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
      graduated: "bg-blue-100 text-blue-800",
      withdrawn: "bg-orange-100 text-orange-800",
    };
    return variants[status] || variants.inactive;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Student Details</span>
            <Badge className={getStatusBadge(student.status)}>
              {student.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete information about {student.user?.firstName} {student.user?.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-sm">{student.user?.firstName} {student.user?.lastName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{student.user?.email || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm">{student.user?.phone || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-sm capitalize">{student.user?.gender || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-sm">
                    {student.dateOfBirth
                      ? new Date(student.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Blood Group</p>
                  <p className="text-sm">{student.bloodGroup || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Nationality</p>
                  <p className="text-sm">{student.nationality || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Admission Number</p>
                  <p className="text-sm font-mono">{student.admissionNumber || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Roll Number</p>
                  <p className="text-sm">{student.rollNumber || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Class</p>
                  <p className="text-sm">{student.schoolClass?.name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Section</p>
                  <p className="text-sm">{student.section?.name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Academic Year</p>
                  <p className="text-sm">{student.academicYear?.name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Enrollment Date</p>
                  <p className="text-sm">
                    {student.enrollmentDate
                      ? new Date(student.enrollmentDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          {(student.parentPhone || student.parentEmail) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parent/Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {student.parentPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Parent Phone</p>
                      <p className="text-sm">{student.parentPhone}</p>
                    </div>
                  </div>
                )}

                {student.parentEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Parent Email</p>
                      <p className="text-sm">{student.parentEmail}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="text-sm">
                  {new Date(student.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-sm">
                  {new Date(student.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
