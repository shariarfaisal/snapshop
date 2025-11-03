"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Save, X } from "lucide-react";
import { CreateUserInput, User } from "@/types/user";
import { useRole } from "@/hooks/use-role";
import { toast } from "sonner";

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: CreateUserInput) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function UserForm({ user, onSubmit, isLoading = false, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserInput>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: 0,
    status: "active",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { roles } = useRole();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "", // Don't show password when editing
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        roleId: user.roleId || 0,
        status: user.status || "active",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      roleId: parseInt(value),
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "active" | "inactive" | "suspended",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!user && !formData.password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (!formData.roleId) {
      toast.error("Role is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Don't send password if empty when editing
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password && user) {
        delete (dataToSubmit as any).password;
      }

      await onSubmit(dataToSubmit);
    } catch (error: any) {
      toast.error(error?.message || "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!user;

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit User" : "Create New User"}</CardTitle>
          <CardDescription>
            {isEditing ? "Update user information" : "Enter user details to create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Username & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                disabled={isEditing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isEditing}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password {isEditing && "(leave blank to keep current)"}*
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={isEditing ? "Leave blank to keep current" : "Enter password"}
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.roleId.toString()} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles?.data?.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status || "active"} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting || isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting || isLoading ? "Saving..." : "Save"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
