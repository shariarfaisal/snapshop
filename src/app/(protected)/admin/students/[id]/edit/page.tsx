"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Student } from "@/types/student";
import { useStudentById, useUpdateStudent } from "@/hooks/use-student";
import { useSchoolClasses } from "@/hooks/use-school-classes";
import { useSectionsBySchoolClass } from "@/hooks/use-sections";
import { studentService } from "@/services/student";

const studentEditSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  admissionNumber: z.string().optional(),
  schoolClassId: z.string().min(1, "Class is required"),
  sectionId: z.string().optional(),
  rollNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  nationality: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal("")),
  enrollmentDate: z.string().optional(),
  status: z.enum(["active", "inactive", "graduated", "suspended", "withdrawn"]).default("active"),
  academicYearId: z.string().optional(),
});

type StudentEditFormValues = z.infer<typeof studentEditSchema>;

export default function StudentEditPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = parseInt(params.id as string);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const { data: student, isLoading, error } = useStudentById(studentId);
  const { data: classesData } = useSchoolClasses();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const { data: sectionsData } = useSectionsBySchoolClass(selectedClassId);

  const form = useForm<StudentEditFormValues>({
    resolver: zodResolver(studentEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: undefined,
      admissionNumber: "",
      schoolClassId: "",
      sectionId: "",
      rollNumber: "",
      dateOfBirth: "",
      bloodGroup: undefined,
      nationality: "",
      parentPhone: "",
      parentEmail: "",
      enrollmentDate: "",
      status: "active",
      academicYearId: "",
    },
  });

  useEffect(() => {
    if (classesData) {
      const classArray = Array.isArray(classesData) ? classesData : classesData.data || [];
      setClasses(classArray.filter(cls => cls.id && cls.id.toString().trim() !== ""));
    }
  }, [classesData]);

  useEffect(() => {
    if (sectionsData) {
      const sectionArray = Array.isArray(sectionsData) ? sectionsData : sectionsData.data || [];
      setSections(sectionArray.filter(sec => sec.id && sec.id.toString().trim() !== ""));
    }
  }, [sectionsData]);

  useEffect(() => {
    if (student) {
      form.reset({
        firstName: student.user?.firstName || "",
        lastName: student.user?.lastName || "",
        email: student.user?.email || "",
        phone: student.user?.phone || "",
        gender: student.user?.gender as any,
        admissionNumber: student.admissionNumber || "",
        schoolClassId: student.schoolClassId?.toString() || "",
        sectionId: student.sectionId?.toString() || "",
        rollNumber: student.rollNumber || "",
        dateOfBirth: student.dateOfBirth || "",
        bloodGroup: student.bloodGroup as any,
        nationality: student.nationality || "",
        parentPhone: student.parentPhone || "",
        parentEmail: student.parentEmail || "",
        enrollmentDate: student.enrollmentDate || "",
        status: student.status,
        academicYearId: student.academicYearId?.toString() || "",
      });

      if (student.schoolClassId) {
        setSelectedClassId(student.schoolClassId);
      }
    }
  }, [student, form]);

  const onSubmit = async (data: StudentEditFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        schoolClassId: parseInt(data.schoolClassId),
        sectionId: data.sectionId && data.sectionId !== "none" ? parseInt(data.sectionId) : undefined,
        academicYearId: data.academicYearId && data.academicYearId !== "none" ? parseInt(data.academicYearId) : undefined,
      };

      await studentService.update(studentId, payload as any);
      toast.success("Student updated successfully");
      router.push(`/admin/students/${studentId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update student");
    } finally {
      setIsSubmitting(false);
    }
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
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
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
      <div className="mb-6 flex items-center gap-4">
        <Button onClick={() => router.back()} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Student</h1>
          <p className="text-gray-600 mt-1">
            {student.user?.firstName} {student.user?.lastName} • {student.admissionNumber}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                              <SelectItem key={bg} value={bg}>
                                {bg}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <h3 className="text-lg font-semibold">Academic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="admissionNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Auto-generated if empty" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rollNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schoolClassId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class *</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedClassId(parseInt(value));
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id.toString()}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {sections.map((sec) => (
                              <SelectItem key={sec.id} value={sec.id.toString()}>
                                {sec.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enrollmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enrollment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="graduated">Graduated</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="withdrawn">Withdrawn</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <h3 className="text-lg font-semibold">Parent/Guardian Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent/Guardian Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
