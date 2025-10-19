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
import { useStudent, useToast, useProgram, useCampus } from "@/hooks";
import { StudentStatus } from "@/types/student";
import { Plus, Search, UserCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Campus } from "@/types";

const studentStatusColors: Record<StudentStatus, string> = {
  "Active": "bg-green-100 text-green-800",
  "Inactive": "bg-gray-100 text-gray-800",
  "Graduated": "bg-blue-100 text-blue-800",
  "Suspended": "bg-red-100 text-red-800",
  "Withdrawn": "bg-yellow-100 text-yellow-800",
};

export default function StudentsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [campusFilter, setCampusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const { students, isStudentsLoading, deleteStudentProfile } = useStudent();
  const { programs } = useProgram();
  const { campuses } = useCampus();

  // Filter students
  const filteredStudents = students?.data?.filter((student) => {
    if (!student) return false;
    
    // Search filter
    const matchesSearch = searchQuery === "" || 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    
    // Program filter
    const matchesProgram = programFilter === "all" || student.programId === programFilter;
    
    // Campus filter
    const matchesCampus = campusFilter === "all" || student.campusId === campusFilter;
    
    return matchesSearch && matchesStatus && matchesProgram && matchesCampus;
  });

  const handleDelete = (studentId: string) => {
    setSelectedStudentId(studentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStudentId) {
      deleteStudentProfile.mutate(selectedStudentId, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Student profile deleted successfully",
          });
          setDeleteDialogOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete student profile",
            variant: "destructive",
          });
        },
      });
    }
  };

  if (isStudentsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button asChild>
          <Link href="/admin/students/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email, or ID"
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Graduated">Graduated</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Withdrawn">Withdrawn</SelectItem>
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
            <div>
              <label className="text-sm font-medium mb-2 block">Campus</label>
              <Select value={campusFilter} onValueChange={setCampusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by campus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  {campuses?.data?.map((campus: Campus) => (
                    <SelectItem key={campus.id} value={campus.id}>
                      {campus.name}
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
            Students {filteredStudents && `(${filteredStudents.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!filteredStudents || filteredStudents.length === 0 ? (
            <div className="text-center py-10">
              <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new student profile.</p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/admin/students/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="font-medium">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.registrationNumber}
                      </TableCell>
                      <TableCell>
                        {student.programName || student.programId}
                      </TableCell>
                      <TableCell>
                        {student.campusName || student.campusId}
                      </TableCell>
                      <TableCell>
                        {student.currentLevel}
                      </TableCell>
                      <TableCell>
                        <Badge className={studentStatusColors[student.status as StudentStatus]}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={`/admin/students/${student.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={`/admin/students/${student.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(student.id)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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