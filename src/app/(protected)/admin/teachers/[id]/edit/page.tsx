"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTeacherById, useUpdateTeacher } from "@/hooks/use-teacher";
import { teacherService } from "@/services/teacher";
import { useQuery } from "@tanstack/react-query";

interface TeacherFormData {
  employee_id?: string;
  qualification?: string;
  experience?: number;
  joining_date?: string;
  salary?: number;
  designation_id?: number;
  department_id?: number;
  address?: string;
  subject_ids?: number[];
}

export default function TeacherEditPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = parseInt(params.id as string);

  const [formData, setFormData] = useState<TeacherFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: teacher, isLoading: loadingTeacher } = useTeacherById(teacherId);
  const updateMutation = useUpdateTeacher();

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => teacherService.getDepartments(),
  });

  const { data: designations = [] } = useQuery({
    queryKey: ["designations"],
    queryFn: () => teacherService.getDesignations(),
  });

  // Initialize form data when teacher data is loaded
  useEffect(() => {
    if (teacher && !isInitialized) {
      setFormData({
        employee_id: teacher.employeeId || "",
        qualification: teacher.qualification || "",
        experience: teacher.experience || undefined,
        joining_date: teacher.joiningDate || "",
        salary: teacher.salary || undefined,
        designation_id: teacher.designationId || undefined,
        department_id: teacher.departmentId || undefined,
        address: teacher.address || "",
      });
      setIsInitialized(true);
    }
  }, [teacher, isInitialized]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.salary !== undefined && formData.salary < 0) {
      newErrors.salary = "Salary cannot be negative";
    }

    if (
      formData.experience !== undefined &&
      (formData.experience < 0 || formData.experience > 60)
    ) {
      newErrors.experience = "Experience must be between 0 and 60";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: teacherId,
        data: formData
      });
      toast.success("Teacher updated successfully");
      router.push(`/admin/teachers/${teacherId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update teacher");
    }
  };

  if (loadingTeacher) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-600">Teacher not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const teacherName = teacher.user
    ? `${teacher.user.firstName} ${teacher.user.lastName}`
    : "Unknown Teacher";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Teacher</h1>
              <p className="text-gray-600">Update {teacherName}'s information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Information - Read Only */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">User Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm text-gray-600">Name</Label>
                        <p className="font-medium text-base mt-1">{teacherName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Email</Label>
                        <p className="font-medium text-base mt-1">{teacher.user?.email || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Phone</Label>
                        <p className="font-medium text-base mt-1">{teacher.user?.phone || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Status</Label>
                        <p className="font-medium text-base mt-1 capitalize">{teacher.user?.status || "-"}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      User information cannot be edited from here. Please edit from User Management.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Basic Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label className="text-sm">Employee ID</Label>
                      <Input
                        placeholder="e.g., EMP202500001"
                        value={formData.employee_id || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, employee_id: e.target.value })
                        }
                        disabled={updateMutation.isPending}
                      />
                    </div>

                    <div>
                      <Label className="text-sm">
                        Experience <span className="text-gray-400">(years)</span>
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        max="60"
                        placeholder="0"
                        value={formData.experience || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                        disabled={updateMutation.isPending}
                      />
                      {errors.experience && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.experience}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm">Joining Date</Label>
                      <Input
                        type="date"
                        value={formData.joining_date || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, joining_date: e.target.value })
                        }
                        disabled={updateMutation.isPending}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm">Qualification</Label>
                      <Input
                        placeholder="e.g., B.Sc Education, M.A"
                        value={formData.qualification || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, qualification: e.target.value })
                        }
                        disabled={updateMutation.isPending}
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Salary</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.salary || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salary: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        disabled={updateMutation.isPending}
                      />
                      {errors.salary && (
                        <p className="text-sm text-red-500 mt-1">{errors.salary}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Department & Designation */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">
                    Department & Designation
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm">Department</Label>
                    <Select
                      value={formData.department_id?.toString() || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          department_id: value ? parseInt(value) : undefined,
                        })
                      }
                      disabled={updateMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept: any) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">Designation</Label>
                    <Select
                      value={formData.designation_id?.toString() || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          designation_id: value ? parseInt(value) : undefined,
                        })
                      }
                      disabled={updateMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {designations.map((desig: any) => (
                          <SelectItem key={desig.id} value={desig.id.toString()}>
                            {desig.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="text-sm">Address</Label>
                    <Textarea
                      placeholder="Enter teacher address"
                      value={formData.address || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      disabled={updateMutation.isPending}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 justify-end mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Teacher
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
