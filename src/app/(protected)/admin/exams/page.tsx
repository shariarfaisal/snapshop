"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar } from "lucide-react";

export default function ExamsPage() {
  const exams = [
    { id: "1", name: "Mid-Term Examination", class: "Grade 10", date: "2024-06-15", status: "Upcoming" },
    { id: "2", name: "Final Examination", class: "Grade 9", date: "2024-12-10", status: "Scheduled" },
    { id: "3", name: "Unit Test 1", class: "Grade 10", date: "2024-05-01", status: "Completed" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Examinations</h1>
          <p className="text-gray-500 mt-1">Manage exams and assessments</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Schedule Exam</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Total Exams</p>
            <p className="text-2xl font-bold">{exams.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Calendar className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Upcoming</p>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-gray-600 mb-2" />
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold">1</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map(exam => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>{exam.class}</TableCell>
                  <TableCell>{exam.date}</TableCell>
                  <TableCell>
                    <Badge className={exam.status === "Completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
