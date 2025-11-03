"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserForm } from "@/components/user/user-form";
import { CreateUserInput } from "@/types/user";
import { useUser } from "@/hooks/use-user";

export default function CreateUserPage() {
  const router = useRouter();
  const { createUser } = useUser();

  const handleSubmit = async (data: CreateUserInput) => {
    try {
      await createUser.mutateAsync(data);
      toast.success("User created successfully!");
      router.push("/admin/users");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create user");
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
          <h1 className="text-3xl font-bold">Create New User</h1>
          <p className="text-muted-foreground mt-1">Add a new user to the system</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <UserForm 
          onSubmit={handleSubmit} 
          isLoading={createUser.isPending}
          onCancel={() => router.push("/admin/users")}
        />
      </div>
    </div>
  );
}
