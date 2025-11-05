"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  GraduationCap,
  Hash,
  Loader2,
  DollarSign,
  BookOpen,
  Users,
  FileText,
  Activity,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useTeacherById, useDeleteTeacher } from "@/hooks/use-teacher";

const getStatusBadge = (status: string) => {
  const variants: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-red-100 text-red-800",
  };
  return variants[status] || "bg-gray-100 text-gray-800";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function TeacherDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = parseInt(params.id as string);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: teacher, isLoading, error } = useTeacherById(teacherId);
  const deleteMutation = useDeleteTeacher();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(teacherId);
      toast.success("Teacher deleted successfully");
      router.push("/admin/teachers");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete teacher");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-600">Teacher not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const teacherName = teacher.user
    ? `${teacher.user.firstName} ${teacher.user.lastName}`
    : "Unknown Teacher";

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{teacherName}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusBadge(teacher.user?.status || "active")}>
                {teacher.user?.status || "active"}
              </Badge>
              {teacher.employeeId && (
                <span className="text-sm text-gray-600">
                  #{teacher.employeeId}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/teachers/${teacherId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="text-lg font-mono font-bold">
                {teacher.employeeId || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-lg font-bold">{teacher.department?.name || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Designation</p>
              <p className="text-lg font-bold">
                {teacher.designation?.name || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Experience</p>
              <p className="text-lg font-bold">
                {teacher.experience ? `${teacher.experience} years` : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Card>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none bg-gray-50 p-0">
            <TabsTrigger
              value="personal"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
            >
              Personal
            </TabsTrigger>
            <TabsTrigger
              value="professional"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
            >
              Professional
            </TabsTrigger>
            <TabsTrigger
              value="academic"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
            >
              Academic
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
            >
              System Info
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Personal Information */}
          <TabsContent value="personal" className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">User Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-600">First Name</label>
                  <p className="font-medium text-base">{teacher.user?.firstName || "-"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Name</label>
                  <p className="font-medium text-base">{teacher.user?.lastName || "-"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="font-medium text-base">{teacher.user?.email || "-"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <p className="font-medium text-base">{teacher.user?.phone || "-"}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Residential Address
                </label>
                <p className="font-medium text-base mt-1">
                  {teacher.address || "-"}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Professional Information */}
          <TabsContent value="professional" className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Employee ID
                </label>
                <p className="font-mono font-bold text-base mt-1">
                  {teacher.employeeId || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Qualification
                </label>
                <p className="font-medium text-base mt-1">
                  {teacher.qualification || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Experience (Years)
                </label>
                <p className="font-medium text-base mt-1">
                  {teacher.experience || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joining Date
                </label>
                <p className="font-medium text-base mt-1">
                  {teacher.joiningDate ? formatDate(teacher.joiningDate) : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Salary
                </label>
                <p className="font-medium text-base mt-1">
                  {teacher.salary ? formatCurrency(teacher.salary) : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Department</label>
                <p className="font-medium text-base mt-1">
                  {teacher.department?.name || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Designation</label>
                <p className="font-medium text-base mt-1">
                  {teacher.designation?.name || "-"}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Academic Information */}
          <TabsContent value="academic" className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Subjects Assigned
              </h3>
              {teacher.subjects && teacher.subjects.length > 0 ? (
                <div className="grid gap-2">
                  {teacher.subjects.map((subject: any) => (
                    <Badge key={subject.id} variant="secondary">
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No subjects assigned</p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Classes/Sections
              </h3>
              {teacher.courseSections && teacher.courseSections.length > 0 ? (
                <div className="grid gap-2">
                  {teacher.courseSections.map((cs: any) => (
                    <div key={cs.id} className="p-3 border rounded-lg">
                      <p className="font-medium">
                        {cs.course?.name || "Unknown Course"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {cs.section?.name || "Unknown Section"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No classes assigned</p>
              )}
            </div>
          </TabsContent>

          {/* Tab 4: Statistics */}
          <TabsContent value="statistics" className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-blue-600 font-medium">
                      Classes Taught
                    </p>
                    <p className="text-3xl font-bold text-blue-800">
                      {teacher.courseSections?.length || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-green-600 font-medium">
                      Subjects
                    </p>
                    <p className="text-3xl font-bold text-green-800">
                      {teacher.subjects?.length || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-purple-600 font-medium">
                      Experience
                    </p>
                    <p className="text-3xl font-bold text-purple-800">
                      {teacher.experience || 0} <span className="text-lg">yrs</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-orange-600 font-medium">
                      Monthly Salary
                    </p>
                    <p className="text-2xl font-bold text-orange-800">
                      {teacher.salary ? formatCurrency(teacher.salary) : "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 5: System Information */}
          <TabsContent value="system" className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created At
                </label>
                <p className="font-medium text-base mt-1">
                  {teacher.created_at ? formatDate(teacher.created_at) : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Last Updated
                </label>
                <p className="font-medium text-base mt-1">
                  {teacher.updated_at ? formatDate(teacher.updated_at) : "-"}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Teacher ID</label>
                <p className="font-mono font-bold text-base mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {teacher.id}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">User ID</label>
                <p className="font-mono font-bold text-base mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {teacher.userId}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Status</label>
                <div className="mt-2">
                  <Badge className={getStatusBadge(teacher.user?.status || "active")}>
                    {teacher.user?.status || "active"}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {teacherName}? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
