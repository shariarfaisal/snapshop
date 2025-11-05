"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { UserSearchSelectCombobox } from "./UserSearchSelectCombobox";
import { useCreateTeacher } from "@/hooks/use-teacher";
import { teacherService } from "@/services/teacher";
import { useQuery } from "@tanstack/react-query";

interface TeacherFormData {
  user_id?: string;
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

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: string;
}

export function TeacherCreateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<TeacherFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const createMutation = useCreateTeacher();

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => teacherService.getDepartments(),
  });

  const { data: designations = [] } = useQuery({
    queryKey: ["designations"],
    queryFn: () => teacherService.getDesignations(),
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.user_id) {
      newErrors.user_id = "Please select a teacher user";
    }

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
      await createMutation.mutateAsync(formData);
      toast.success("Teacher created successfully");
      router.push("/admin/teachers");
    } catch (error: any) {
      toast.error(error.message || "Failed to create teacher");
    }
  };

  const handleUserSelect = (userId: string, user: User) => {
    setSelectedUser(user);
    setFormData({ ...formData, user_id: userId });
    setErrors({ ...errors, user_id: "" });
  };

  return (
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
          <h1 className="text-3xl font-bold">Create Teacher</h1>
          <p className="text-gray-600">Add a new teacher to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Selection - Full Width */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <UserSearchSelectCombobox
                  value={formData.user_id}
                  onSelect={handleUserSelect}
                  disabled={createMutation.isPending}
                  error={errors.user_id}
                />
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
                    disabled={createMutation.isPending}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for auto-generated ID
                  </p>
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
                    disabled={createMutation.isPending}
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
                    disabled={createMutation.isPending}
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
                    disabled={createMutation.isPending}
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
                    disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
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
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Teacher
          </Button>
        </div>
      </form>
    </div>
  );
}
