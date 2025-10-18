"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseOffering, useEnrollment, useToast } from "@/hooks";
import { ArrowLeft, Calendar, Users, BookOpen, Building, User, Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Enrollment, EnrollmentStatus } from "@/types/course-offering";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const enrollmentStatusColors: Record<EnrollmentStatus, string> = {
  "Pending": "bg-yellow-100 text-yellow-800",
  "Approved": "bg-green-100 text-green-800",
  "Rejected": "bg-red-100 text-red-800",
  "Withdrawn": "bg-gray-100 text-gray-800",
  "Completed": "bg-blue-100 text-blue-800",
};

export default function CourseOfferingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const courseOfferingId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnrollments, setSelectedEnrollments] = useState<Enrollment[]>([]);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const { getCourseOfferingById } = useCourseOffering();
  const { data: courseOffering, isLoading: isCourseOfferingLoading } = getCourseOfferingById(courseOfferingId);

  const { getEnrollmentsByCourseOffering, updateEnrollmentStatus, batchApproveEnrollments, batchRejectEnrollments } = useEnrollment();
  const { data: enrollments, isLoading: isEnrollmentsLoading } = getEnrollmentsByCourseOffering(courseOfferingId);

  // Filter enrollments based on search query
  const filteredEnrollments = enrollments?.filter(enrollment => {
    if (!searchQuery) return true;
    
    const student = enrollment.student;
    const searchLower = searchQuery.toLowerCase();
    
    return (
      student?.firstName?.toLowerCase().includes(searchLower) ||
      student?.lastName?.toLowerCase().includes(searchLower) ||
      student?.email?.toLowerCase().includes(searchLower) ||
      enrollment.status.toLowerCase().includes(searchLower)
    );
  });

  const handleToggleEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollments(prev => {
      if (prev.some(e => e.id === enrollment.id)) {
        return prev.filter(e => e.id !== enrollment.id);
      } else {
        return [...prev, enrollment];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedEnrollments.length === filteredEnrollments?.length) {
      setSelectedEnrollments([]);
    } else {
      setSelectedEnrollments(filteredEnrollments || []);
    }
  };

  const handleBatchApprove = () => {
    const enrollmentIds = selectedEnrollments.map(e => e.id);
    
    batchApproveEnrollments.mutate(enrollmentIds, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: `${enrollmentIds.length} enrollments approved successfully`,
        });
        setSelectedEnrollments([]);
        setIsApproveDialogOpen(false);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to approve enrollments",
          variant: "destructive",
        });
      },
    });
  };

  const handleBatchReject = () => {
    const enrollmentIds = selectedEnrollments.map(e => e.id);
    
    batchRejectEnrollments.mutate(enrollmentIds, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: `${enrollmentIds.length} enrollments rejected successfully`,
        });
        setSelectedEnrollments([]);
        setIsRejectDialogOpen(false);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to reject enrollments",
          variant: "destructive",
        });
      },
    });
  };

  const handleChangeStatus = (enrollment: Enrollment, status: EnrollmentStatus) => {
    updateEnrollmentStatus.mutate(
      { id: enrollment.id, status },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Enrollment status changed to ${status}`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update enrollment status",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isCourseOfferingLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!courseOffering) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold">Course offering not found</h2>
          <Button 
            variant="link" 
            className="mt-4"
            onClick={() => router.push("/admin/course-offerings")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course Offerings
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
          onClick={() => router.push("/admin/course-offerings")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {courseOffering.subject?.name} ({courseOffering.subject?.code})
          </h1>
          <p className="text-gray-500">
            {courseOffering.program?.title} • {courseOffering.academicYear} • Term {courseOffering.term}
          </p>
        </div>
        <Badge className={`ml-2 ${courseOffering.status === "Upcoming" ? "bg-blue-100 text-blue-800" : 
                                  courseOffering.status === "InProgress" ? "bg-green-100 text-green-800" : 
                                  courseOffering.status === "Completed" ? "bg-gray-100 text-gray-800" : 
                                  "bg-red-100 text-red-800"}`}>
          {courseOffering.status}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Subject
                    </div>
                    <p className="font-medium">{courseOffering.subject?.name} ({courseOffering.subject?.code})</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Building className="mr-2 h-4 w-4" />
                      Program
                    </div>
                    <p className="font-medium">{courseOffering.program?.title}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      Academic Year
                    </div>
                    <p className="font-medium">{courseOffering.academicYear} (Term {courseOffering.term})</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-2 h-4 w-4" />
                      Instructor
                    </div>
                    <p className="font-medium">{courseOffering.instructor?.firstName} {courseOffering.instructor?.lastName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule & Capacity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      Start Date
                    </div>
                    <p className="font-medium">
                      {courseOffering.startDate && format(new Date(courseOffering.startDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      End Date
                    </div>
                    <p className="font-medium">
                      {courseOffering.endDate && format(new Date(courseOffering.endDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="mr-2 h-4 w-4" />
                      Maximum Students
                    </div>
                    <p className="font-medium">{courseOffering.maxStudents}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="mr-2 h-4 w-4" />
                      Current Enrollments
                    </div>
                    <p className="font-medium">{enrollments?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {courseOffering.description && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{courseOffering.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Student Enrollments</CardTitle>
                  <CardDescription>
                    {filteredEnrollments?.length || 0} students enrolled in this course
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative w-full sm:w-64">
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {selectedEnrollments.length > 0 && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsRejectDialogOpen(true)}
                        disabled={selectedEnrollments.every(e => e.status !== "Pending")}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject Selected
                      </Button>
                      <Button 
                        onClick={() => setIsApproveDialogOpen(true)}
                        disabled={selectedEnrollments.every(e => e.status !== "Pending")}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve Selected
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEnrollmentsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : !filteredEnrollments || filteredEnrollments.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No enrollments found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedEnrollments.length > 0 && selectedEnrollments.length === filteredEnrollments.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEnrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedEnrollments.some(e => e.id === enrollment.id)}
                              onCheckedChange={() => handleToggleEnrollment(enrollment)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {enrollment.student?.firstName} {enrollment.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enrollment.student?.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            {enrollment.enrollmentDate && 
                              format(new Date(enrollment.enrollmentDate), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge className={enrollmentStatusColors[enrollment.status]}>
                              {enrollment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {enrollment.status === "Pending" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleChangeStatus(enrollment, "Rejected")}
                                  >
                                    Reject
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleChangeStatus(enrollment, "Approved")}
                                  >
                                    Approve
                                  </Button>
                                </>
                              )}
                              {enrollment.status === "Approved" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleChangeStatus(enrollment, "Completed")}
                                >
                                  Mark as Completed
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approve Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Enrollments</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {selectedEnrollments.length} enrollment{selectedEnrollments.length !== 1 && 's'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBatchApprove}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Enrollments</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {selectedEnrollments.length} enrollment{selectedEnrollments.length !== 1 && 's'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBatchReject}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 