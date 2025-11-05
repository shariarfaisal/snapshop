"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { studentService } from "@/services/student";
import { schoolClassService } from "@/services/schoolClass";
import { sectionService } from "@/services/section";
import { Student } from "@/types/student";

const studentSchema = z.object({
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
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSuccess?: () => void;
}

export function StudentFormDialog({
  open,
  onOpenChange,
  student,
  onSuccess,
}: StudentFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
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
    },
  });

  useEffect(() => {
    loadClasses();
  }, []);

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
      });

      if (student.schoolClassId) {
        loadSections(student.schoolClassId);
      }
    } else {
      form.reset();
    }
  }, [student, open]);

  const loadClasses = async () => {
    try {
      const data = await schoolClassService.getAll();
      setClasses(data.data || data);
    } catch (error) {
      console.error("Failed to load classes", error);
    }
  };

  const loadSections = async (classId: number) => {
    try {
      const data = await sectionService.getAll({ classId });
      setSections(data.data || data);
    } catch (error) {
      console.error("Failed to load sections", error);
    }
  };

  const onSubmit = async (data: StudentFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        schoolClassId: parseInt(data.schoolClassId),
        sectionId: data.sectionId && data.sectionId !== "none" ? parseInt(data.sectionId) : undefined,
      };

      if (student) {
        await studentService.update(student.id, payload as any);
        toast.success("Student updated successfully");
      } else {
        await studentService.create(payload as any);
        toast.success("Student created successfully");
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${student ? "update" : "create"} student`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student ? "Edit Student" : "Add New Student"}</DialogTitle>
          <DialogDescription>
            {student ? "Update student information" : "Enter student information to create a new account"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                name="schoolClassId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class *</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        loadSections(parseInt(value));
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.filter(cls => cls.id && cls.id.toString().trim() !== "").map((cls) => (
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {sections.filter(sec => sec.id && sec.id.toString().trim() !== "").map((sec) => (
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
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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

              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Phone</FormLabel>
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
                    <FormLabel>Parent Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {student ? "Update" : "Create"} Student
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
