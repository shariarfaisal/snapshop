"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentMedicalForm } from "@/components/students/student-medical-form";
import { StudentMedicalFormValues } from "@/components/students/student-form";
import { useStudent, useToast } from "@/hooks";
import { ArrowLeft } from "lucide-react";

export default function CreateMedicalRecordPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const studentId = params.id as string;
  const { getStudentById, createMedicalRecord } = useStudent();
  const { data: student, isLoading } = getStudentById(studentId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data: StudentMedicalFormValues) => {
    setIsSubmitting(true);
    createMedicalRecord.mutate(
      {
        studentId,
        ...data,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Medical record created successfully",
          });
          router.push(`/admin/students/${studentId}`);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to create medical record",
            variant: "destructive",
          });
          setIsSubmitting(false);
        },
      }
    );
  };

  if (isLoading) {
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
          onClick={() => router.push(`/admin/students/${studentId}`)}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Medical Record</h1>
          <p className="text-gray-500">
            {student.firstName} {student.lastName} • {student.registrationNumber}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
          <CardDescription>
            Add medical information for this student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentMedicalForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            submitLabel="Add Medical Record"
          />
        </CardContent>
      </Card>
    </div>
  );
} 