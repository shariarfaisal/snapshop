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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertCircle,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Student } from "@/types/student";
import { useStudentById, useDeleteStudent } from "@/hooks/use-student";
import { useStudentInvoices, useStudentOutstandingDues } from "@/hooks/use-finance";
import { InvoiceStatus } from "@/types/finance";

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

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = parseInt(params.id as string);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: student, isLoading, error } = useStudentById(studentId);
  const deleteStudentMutation = useDeleteStudent();

  // Fetch finance data
  const { data: invoices } = useStudentInvoices(studentId);
  const { data: outstandingDues } = useStudentOutstandingDues(studentId);

  // Calculate finance totals
  const totalFees = invoices?.reduce((sum, inv) => sum + Number(inv.net_amount), 0) || 0;
  const totalPaid = invoices?.reduce((sum, inv) => sum + Number(inv.paid_amount), 0) || 0;
  const totalDue = outstandingDues?.total_due || 0;

  // Get recent invoices (last 5)
  const recentInvoices = invoices?.slice(0, 5) || [];

  const handleDelete = async () => {
    deleteStudentMutation.mutate(studentId, {
      onSuccess: () => {
        toast.success("Student deleted successfully");
        setDeleteDialogOpen(false);
        router.push("/admin/students");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete student");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <Button onClick={() => router.push("/admin/students")} variant="outline" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-800">Failed to load student details. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.push("/admin/students")} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {student.user?.firstName} {student.user?.lastName}
            </h1>
            <p className="text-gray-600">Admission #: {student.admissionNumber}</p>
          </div>
          <Badge className={`ml-4 ${getStatusBadge(student.status)}`}>
            {student.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/students/${studentId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Class</p>
                <p className="font-semibold">{student.schoolClass?.name || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Section</p>
                <p className="font-semibold">{student.section?.name || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Hash className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Roll Number</p>
                <p className="font-semibold">{student.rollNumber || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Academic Year</p>
                <p className="font-semibold">{student.academicYear?.name || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">First Name</label>
                  <p className="mt-1 text-base font-medium">{student.user?.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Name</label>
                  <p className="mt-1 text-base font-medium">{student.user?.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{student.user?.email || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{student.user?.phone || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="mt-1 text-base font-medium capitalize">{student.user?.gender || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-base">
                      {student.dateOfBirth
                        ? new Date(student.dateOfBirth).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Blood Group</label>
                  <p className="mt-1 text-base font-medium">{student.bloodGroup || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nationality</label>
                  <div className="mt-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{student.nationality || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parent/Guardian Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Parent/Guardian Phone</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{student.parentPhone || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Parent/Guardian Email</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-base">{student.parentEmail || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information Tab */}
        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Admission Number</label>
                  <p className="mt-1 text-base font-mono font-semibold">{student.admissionNumber || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Roll Number</label>
                  <p className="mt-1 text-base font-medium">{student.rollNumber || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Class</label>
                  <p className="mt-1 text-base font-medium">{student.schoolClass?.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Section</label>
                  <p className="mt-1 text-base font-medium">{student.section?.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Academic Year</label>
                  <p className="mt-1 text-base font-medium">{student.academicYear?.name || "N/A"}</p>
                  {student.academicYear && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(student.academicYear.startDate).getFullYear()} - {new Date(student.academicYear.endDate).getFullYear()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-base">
                      {student.enrollmentDate
                        ? new Date(student.enrollmentDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Subjects</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg. GPA</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Classes</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finance Tab */}
        <TabsContent value="finance" className="space-y-4">
          {/* Overdue Alert */}
          {outstandingDues && outstandingDues.overdue_count > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900">Overdue Payment Alert</h3>
                    <p className="text-sm text-red-700 mt-1">
                      This student has {outstandingDues.overdue_count} overdue invoice(s) with total amount of ${outstandingDues.total_overdue.toFixed(2)}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Fees</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">${totalFees.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Total Paid</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">${totalPaid.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Pending Payment</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">${totalDue.toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Recent Invoices</h4>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/admin/finance/invoices?student=${studentId}`)}>
                    View All
                  </Button>
                </div>

                {!recentInvoices || recentInvoices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No invoices found</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Due</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentInvoices.map((invoice) => {
                          const getStatusBadge = (status: InvoiceStatus) => {
                            const config = {
                              paid: { className: "bg-green-100 text-green-800", icon: CheckCircle },
                              pending: { className: "bg-yellow-100 text-yellow-800", icon: Clock },
                              partially_paid: { className: "bg-blue-100 text-blue-800", icon: Clock },
                              overdue: { className: "bg-red-100 text-red-800", icon: AlertCircle },
                              cancelled: { className: "bg-gray-100 text-gray-800", icon: AlertCircle },
                            };

                            const { icon: Icon, className } = config[status] || config.pending;

                            return (
                              <Badge className={className}>
                                <Icon className="h-3 w-3 mr-1" />
                                {status.replace("_", " ").toUpperCase()}
                              </Badge>
                            );
                          };

                          return (
                            <TableRow key={invoice.id}>
                              <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                              <TableCell>{format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</TableCell>
                              <TableCell className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                                {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                              </TableCell>
                              <TableCell className="text-right">${Number(invoice.net_amount).toFixed(2)}</TableCell>
                              <TableCell className="text-right font-semibold">
                                <span className={Number(invoice.due_amount) > 0 ? 'text-red-600' : 'text-green-600'}>
                                  ${Number(invoice.due_amount).toFixed(2)}
                                </span>
                              </TableCell>
                              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Attendance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Present</p>
                      <p className="text-3xl font-bold text-green-900 mt-2">0</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600 opacity-20" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Absent</p>
                      <p className="text-3xl font-bold text-red-900 mt-2">0</p>
                    </div>
                    <Activity className="h-8 w-8 text-red-600 opacity-20" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Late</p>
                      <p className="text-3xl font-bold text-yellow-900 mt-2">0</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600 opacity-20" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Attendance %</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">0%</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600 opacity-20" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Monthly Attendance</h4>
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No attendance records found</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents & Records
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition">
                  <BookOpen className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-medium text-gray-700">Transcripts</p>
                  <p className="text-sm text-gray-500">No documents</p>
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition">
                  <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-medium text-gray-700">Certificates</p>
                  <p className="text-sm text-gray-500">No documents</p>
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition">
                  <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-medium text-gray-700">Medical Records</p>
                  <p className="text-sm text-gray-500">No documents</p>
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition">
                  <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-medium text-gray-700">Other Files</p>
                  <p className="text-sm text-gray-500">No documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Information Footer */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-sm">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Created At</p>
              <p className="font-medium">
                {new Date(student.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="font-medium">
                {new Date(student.updatedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Student ID</p>
              <p className="font-medium font-mono">{student.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <Badge className={getStatusBadge(student.status)}>
                {student.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {student.user?.firstName} {student.user?.lastName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {deleteStudentMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
