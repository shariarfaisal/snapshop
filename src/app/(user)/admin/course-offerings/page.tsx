"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProgram, useCourseOffering, useToast } from "@/hooks";
import { CourseOffering, CourseStatus } from "@/types/course-offering";
import { Plus, Search, Pencil, Trash2, Calendar, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import { CreateCourseOfferingDialog } from "../../../../components/course-offerings/create-course-offering-dialog";
import { EditCourseOfferingDialog } from "../../../../components/course-offerings/edit-course-offering-dialog";

const courseStatusColors: Record<CourseStatus, string> = {
  "Upcoming": "bg-blue-100 text-blue-800",
  "InProgress": "bg-green-100 text-green-800",
  "Completed": "bg-gray-100 text-gray-800",
  "Cancelled": "bg-red-100 text-red-800",
};

export default function CourseOfferingsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourseOffering, setSelectedCourseOffering] = useState<CourseOffering | null>(null);

  const { programs } = useProgram();
  const { 
    courseOfferings, 
    isCourseOfferingsLoading, 
    deleteCourseOffering 
  } = useCourseOffering();

  // Filter course offerings
  const filteredCourseOfferings = courseOfferings?.filter((offering) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      (offering.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       offering.subject?.code?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === "all" || offering.status === statusFilter;
    
    // Program filter
    const matchesProgram = programFilter === "all" || offering.programId === programFilter;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const handleEdit = (offering: CourseOffering) => {
    setSelectedCourseOffering(offering);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (offering: CourseOffering) => {
    if (confirm(`Are you sure you want to delete this course offering for ${offering.subject?.name}?`)) {
      deleteCourseOffering.mutate(offering.id, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Course offering deleted successfully",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete course offering",
            variant: "destructive",
          });
        },
      });
    }
  };

  if (isCourseOfferingsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Course Offerings</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Course Offering
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Course Offerings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by subject name or code"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Program</label>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs?.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Course Offerings {filteredCourseOfferings && `(${filteredCourseOfferings.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!filteredCourseOfferings || filteredCourseOfferings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No course offerings found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Academic Year / Term</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourseOfferings.map((offering) => (
                    <TableRow key={offering.id}>
                      <TableCell className="font-medium">
                        <div>
                          <Link 
                            href={`/admin/course-offerings/${offering.id}`}
                            className="hover:underline"
                          >
                            {offering.subject?.name}
                          </Link>
                          <div className="text-sm text-gray-500">
                            {offering.subject?.code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {offering.program?.title}
                      </TableCell>
                      <TableCell>
                        {offering.academicYear} / Term {offering.term}
                      </TableCell>
                      <TableCell>
                        {offering.instructor?.firstName} {offering.instructor?.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-gray-500" />
                          <span className="text-sm">
                            {offering.startDate && format(new Date(offering.startDate), "MMM d")} - 
                            {offering.endDate && format(new Date(offering.endDate), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Users className="mr-1 h-3 w-3 text-gray-500" />
                          <span className="text-sm">{offering.maxStudents} max</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={courseStatusColors[offering.status]}>
                          {offering.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={`/admin/course-offerings/${offering.id}`}>
                              <Users className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(offering)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(offering)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Create Course Offering Dialog */}
      <CreateCourseOfferingDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {/* Edit Course Offering Dialog */}
      {selectedCourseOffering && (
        <EditCourseOfferingDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          courseOffering={selectedCourseOffering}
        />
      )}
    </div>
  );
} 