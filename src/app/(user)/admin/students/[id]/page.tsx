"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudent, useToast } from "@/hooks";
import { StudentStatus } from "@/types/student";
import { ArrowLeft, Pencil, UserCircle, Phone, Mail, Calendar, MapPin, School, Bookmark, FileText, Activity, Users, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const studentStatusColors: Record<StudentStatus, string> = {
  "Active": "bg-green-100 text-green-800",
  "Inactive": "bg-gray-100 text-gray-800",
  "Graduated": "bg-blue-100 text-blue-800",
  "Suspended": "bg-red-100 text-red-800",
  "Withdrawn": "bg-yellow-100 text-yellow-800",
};

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const studentId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<StudentStatus | null>(null);

  const { getStudentById, getStudentMedical, getStudentGuardians, changeStudentStatus, deleteStudentProfile } = useStudent();
  const { data: student, isLoading: isStudentLoading } = getStudentById(studentId);
  const { data: medicalRecord, isLoading: isMedicalLoading } = getStudentMedical(studentId);
  const { data: guardians, isLoading: isGuardiansLoading } = getStudentGuardians(studentId);

  const handleStatusChange = (status: StudentStatus) => {
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (newStatus) {
      changeStudentStatus.mutate(
        { id: studentId, status: newStatus },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: `Student status changed to ${newStatus}`,
            });
            setStatusDialogOpen(false);
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to change student status",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteStudentProfile.mutate(studentId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Student profile deleted successfully",
        });
        router.push("/admin/students");
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete student profile",
          variant: "destructive",
        });
      },
    });
  };

  if (isStudentLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Student not found</h2>
          <Button 
            variant="link" 
            className="mt-4"
            onClick={() => router.push("/admin/students")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin/students")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-gray-500">
            {student.registrationNumber} • {student.programName || "Unknown Program"}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={studentStatusColors[student.status]}>
            {student.status}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link href={`/admin/students/${student.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Full Name
                    </div>
                    <p className="font-medium">{student.firstName} {student.lastName}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date of Birth
                    </div>
                    <p className="font-medium">
                      {student.dateOfBirth && format(new Date(student.dateOfBirth), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Gender
                    </div>
                    <p className="font-medium">{student.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </div>
                    <p className="font-medium">{student.email}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="mr-2 h-4 w-4" />
                      Phone
                    </div>
                    <p className="font-medium">{student.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Nationality
                    </div>
                    <p className="font-medium">{student.nationality}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      Address
                    </div>
                    <p className="font-medium">{student.address}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      City
                    </div>
                    <p className="font-medium">{student.city}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      Country
                    </div>
                    <p className="font-medium">{student.country}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      Postal Code
                    </div>
                    <p className="font-medium">{student.postalCode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Contact Person
                    </div>
                    <p className="font-medium">{student.emergencyContact}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="mr-2 h-4 w-4" />
                      Phone
                    </div>
                    <p className="font-medium">{student.emergencyPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Status</CardTitle>
                <CardDescription>
                  Manage the student's current status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge className={studentStatusColors[student.status]}>
                    {student.status}
                  </Badge>
                  <div className="flex-1"></div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("Active")}
                      disabled={student.status === "Active"}
                    >
                      Set Active
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("Graduated")}
                      disabled={student.status === "Graduated"}
                    >
                      Set Graduated
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("Inactive")}
                      disabled={student.status === "Inactive"}
                    >
                      Set Inactive
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    Delete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <School className="mr-2 h-4 w-4" />
                    Program
                  </div>
                  <p className="font-medium">{student.programName || student.programId}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Registration Number
                  </div>
                  <p className="font-medium">{student.registrationNumber}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <School className="mr-2 h-4 w-4" />
                    Campus
                  </div>
                  <p className="font-medium">{student.campusName || student.campusId}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="mr-2 h-4 w-4" />
                    Current Level
                  </div>
                  <p className="font-medium">{student.currentLevel}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    Admission Date
                  </div>
                  <p className="font-medium">
                    {student.admissionDate && format(new Date(student.admissionDate), "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    Status
                  </div>
                  <Badge className={studentStatusColors[student.status]}>
                    {student.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          {isMedicalLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : !medicalRecord ? (
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>
                  No medical information available for this student
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/admin/students/${studentId}/medical/create`}>
                    Add Medical Information
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <div className="flex items-center justify-between">
                  <CardDescription>
                    Health details and medical records
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link href={`/admin/students/${studentId}/medical/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Activity className="mr-2 h-4 w-4" />
                      Blood Group
                    </div>
                    <p className="font-medium">{medicalRecord.bloodGroup}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Activity className="mr-2 h-4 w-4" />
                      Allergies
                    </div>
                    <p className="font-medium">{medicalRecord.allergies || "None"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Activity className="mr-2 h-4 w-4" />
                      Chronic Diseases
                    </div>
                    <p className="font-medium">{medicalRecord.chronicDisease || "None"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Activity className="mr-2 h-4 w-4" />
                      Medications
                    </div>
                    <p className="font-medium">{medicalRecord.medications || "None"}</p>
                  </div>
                </div>
                {medicalRecord.notes && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Additional Notes</h3>
                    <p>{medicalRecord.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="guardians" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Guardians</h2>
            <Button asChild>
              <Link href={`/admin/students/${studentId}/guardians/add`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Guardian
              </Link>
            </Button>
          </div>

          {isGuardiansLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : !guardians || guardians.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No guardians found</h3>
                  <p className="mt-1 text-sm text-gray-500">Add guardians to this student's profile.</p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link href={`/admin/students/${studentId}/guardians/add`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Guardian
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guardians.map((guardian) => (
                <Card key={guardian.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{guardian.fullName}</CardTitle>
                      {guardian.isPrimary && (
                        <Badge>Primary Guardian</Badge>
                      )}
                    </div>
                    <CardDescription>{guardian.relationship}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{guardian.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{guardian.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Bookmark className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{guardian.occupation}</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/students/${studentId}/guardians/${guardian.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollments</CardTitle>
              <CardDescription>
                View all courses this student is enrolled in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-gray-500">Student enrollment feature coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Change Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Student Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this student's status to {newStatus}?
              This will update their record in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student Profile</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student
              profile and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 