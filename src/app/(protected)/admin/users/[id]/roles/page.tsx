"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, UserCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useRole } from "@/hooks/use-role";
import { toast } from "sonner";
import { userService } from "@/services/user";

export default function RolesPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const { roles, isRolesLoading, assignRoleToUser, invalidateUserRoles } = useRole();

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoadingUser(true);
        const userData = await userService.getUserById(userId);
        setUser(userData);
        if (userData.roleId) {
          setSelectedRoleId(userData.roleId.toString());
        }
      } catch (error) {
        toast.error("Failed to load user details");
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedRoleId) {
      toast.error("Please select a role");
      return;
    }

    setIsSubmitting(true);

    try {
      await assignRoleToUser.mutateAsync({
        userId: userId,
        roleId: parseInt(selectedRoleId)
      });

      invalidateUserRoles();
      toast.success("Role assigned successfully");
      router.push("/admin/users");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to assign role");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Manage User Roles</h1>
          <p className="text-muted-foreground mt-1">Assign roles and permissions to user</p>
        </div>
      </div>

      {/* User Info Card */}
      {isLoadingUser ? (
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-24" />
          </CardContent>
        </Card>
      ) : user ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>Details of the user you are managing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Role</p>
                <p className="font-medium">{user.role?.name || "No role assigned"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Role Assignment Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Assign Role</CardTitle>
            <CardDescription>Select a role to assign to this user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isRolesLoading ? (
              <Skeleton className="h-10" />
            ) : (
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={selectedRoleId}
                  onValueChange={setSelectedRoleId}
                  required
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.data?.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting || !selectedRoleId}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
