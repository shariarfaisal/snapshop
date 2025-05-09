"use client";

import { useStore } from "../useStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { WEBSITE_API } from "@/services/website";
import { useToast } from "@/hooks";
import { Loader, User } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().optional(),
});

export default function ProfilePage() {
  const { auth, setAuthOpen, setAuth } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      setAuthOpen("login");
    }
  }, [auth, setAuthOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: auth?.user.name || "",
      email: auth?.user.email || "",
      phone: auth?.user.phone || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: WEBSITE_API.updateProfile,
    onSuccess: (data) => {
      if (auth) {
        setAuth({
          ...auth,
          user: data,
        });
      }
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
      });
    },
  });

  if (!auth) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please Login</h1>
          <p className="text-gray-500">You need to login to view your profile</p>
        </div>
      </div>
    );
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
                      {...field}
                      disabled={!isEditing}
                      className="rounded-md"
                    />
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
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      disabled={!isEditing}
                      className="rounded-md"
                    />
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
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      {...field}
                      disabled={!isEditing}
                      className="rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
} 