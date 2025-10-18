"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentForm } from "@/components/students/student-form";
import { StudentFormValues } from "@/components/students/student-form";
import { useStudent, useToast } from "@/hooks";
import { ArrowLeft } from "lucide-react";

export default function CreateStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createStudentProfile } = useStudent();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data: StudentFormValues) => {
    setIsSubmitting(true);
    createStudentProfile.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Student profile created successfully",
        });
        router.push("/admin/students");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create student profile",
          variant: "destructive",
        });
        setIsSubmitting(false);
      },
    });
  };

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
        <div>
          <h1 className="text-3xl font-bold">Add New Student</h1>
          <p className="text-gray-500">Create a new student profile</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>
            Fill in the student's personal and academic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            submitLabel="Create Student"
          />
        </CardContent>
      </Card>
    </div>
  );
} 