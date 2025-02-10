"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CardDescription } from "@/components/ui/card";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { EyeOff } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const UpdatePasswordForm = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    form.reset();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <CardDescription className="w-full text-center">
          Reset your password
        </CardDescription>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Input
                  className="rounded-md h-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute right-3 top-1"
              >
                {showPassword ? (
                  <EyeOpenIcon className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Input
                  className="rounded-md h-10"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  {...field}
                />
              </FormControl>
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
                className="absolute right-3 top-1"
              >
                {showConfirmPassword ? (
                  <EyeOpenIcon className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full h-10 rounded-md" type="submit">
          Update
        </Button>
        <Link href="/login" className="w-full flex items-center justify-center">
          Back to login
        </Link>
      </form>
    </Form>
  );
};
