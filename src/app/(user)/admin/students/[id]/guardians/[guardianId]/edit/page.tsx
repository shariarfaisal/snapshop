"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentGuardianForm } from "@/components/students/student-guardian-form";
import { StudentGuardianFormValues } from "@/components/students/student-form";
import { useStudent, useToast } from "@/hooks";
import { ArrowLeft } from "lucide-react";

export default function EditGuardianPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const studentId = params.id as string;
  const guardianId = params.guardianId as string;
  const { getStudentById, getStudentGuardians, updateGuardian } = useStudent();
  const { data: student, isLoading: isStudentLoading } = getStudentById(studentId);
  const { data: guardians, isLoading: isGuardiansLoading } = getStudentGuardians(studentId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guardian, setGuardian] = useState<any>(null);
  
  // Find the specific guardian to edit
  useEffect(() => {
    if (guardians) {
      const foundGuardian = guardians.find(g => g.id === guardianId);
      if (foundGuardian) {
        setGuardian(foundGuardian);
      }
    }
  }, [guardians, guardianId]);

  // Check if there's another primary guardian besides this one
  const hasOtherPrimaryGuardian = guardians?.some(g => g.isPrimary && g.id !== guardianId);

  const handleSubmit = (data: StudentGuardianFormValues) => {
    setIsSubmitting(true);
    updateGuardian.mutate(
      {
        guardianId,
        data,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Guardian updated successfully",
          });
          router.push(`/admin/students/${studentId}`);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update guardian",
            variant: "destructive",
          });
          setIsSubmitting(false);
        },
      }
    );
  };

  if (isStudentLoading || isGuardiansLoading || !guardian) {
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
          <h1 className="text-3xl font-bold">Edit Guardian</h1>
          <p className="text-gray-500">
            {student.firstName} {student.lastName} • {student.registrationNumber}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guardian Information</CardTitle>
          <CardDescription>
            Update guardian information for {guardian.fullName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentGuardianForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            submitLabel="Update Guardian"
            defaultValues={guardian}
            hasExistingPrimaryGuardian={hasOtherPrimaryGuardian}
          />
        </CardContent>
      </Card>
    </div>
  );
} 