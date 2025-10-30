import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Teacher } from "@/types/teacher";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, DollarSign } from "lucide-react";

interface TeacherViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
}

export function TeacherViewDialog({ open, onOpenChange, teacher }: TeacherViewDialogProps) {
  if (!teacher) return null;

  const getStatusColor = (status: string) => {
    if (status === "active" || status === "true") {
      return "bg-green-100 text-green-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    if (status === "active" || status === "true") return "Active";
    return "Inactive";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {teacher.firstName} {teacher.lastName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Employee ID: {teacher.employeeId}</p>
            </div>
            <Badge className={getStatusColor(teacher.status)}>
              {getStatusLabel(teacher.status)}
            </Badge>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>
            <div className="space-y-2">
              {teacher.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{teacher.email}</span>
                </div>
              )}
              {teacher.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{teacher.phone}</span>
                </div>
              )}
              {teacher.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{teacher.address}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Professional Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Professional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {teacher.department && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{teacher.department.name}</span>
                  </div>
                </div>
              )}
              {teacher.designation && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Designation</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{teacher.designation.name}</span>
                  </div>
                </div>
              )}
              {teacher.qualification && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Qualification</p>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{teacher.qualification}</span>
                  </div>
                </div>
              )}
              {teacher.experience !== undefined && teacher.experience !== null && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Experience</p>
                  <span className="text-sm font-medium">{teacher.experience} years</span>
                </div>
              )}
              {teacher.joiningDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Joining Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {new Date(teacher.joiningDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
              {teacher.salary && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Salary</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">${teacher.salary.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {teacher.subjects && teacher.subjects.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Assigned Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject) => (
                    <Badge key={subject.id} variant="secondary">
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Meta Information */}
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <p className="font-medium">Created</p>
              <p>{new Date(teacher.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">Last Updated</p>
              <p>{new Date(teacher.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
