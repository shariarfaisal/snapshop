"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { UserForm } from "@/components/user/user-form";
import { CreateUserInput } from "@/types/user";
import { useUser, useGetUserById } from "@/hooks/use-user";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const { updateUser } = useUser();
  const { data: user, isLoading } = useGetUserById(userId);

  const handleSubmit = (data: CreateUserInput) => {
    updateUser.mutate(
      { 
        id: userId, 
        data: data as any 
      },
      {
        onSuccess: () => {
          toast.success("User updated successfully!");
          router.push("/admin/users");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update user");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
          <Button className="mt-4" asChild>
            <Link href="/admin/users">Back to Users</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit User</h1>
          <p className="text-muted-foreground mt-1">Update user information</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <UserForm 
          user={user} 
          onSubmit={handleSubmit} 
          isLoading={updateUser.isPending}
          onCancel={() => router.push("/admin/users")}
        />
      </div>
    </div>
  );
}
