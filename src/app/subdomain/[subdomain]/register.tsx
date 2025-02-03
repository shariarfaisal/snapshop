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
import { EyeOff } from "lucide-react";
import { useState } from "react";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { WEBSITE_API } from "@/services/website";
import { isAxiosError } from "axios";
import { Dialog, DialogContent } from "@/components";
import { setCookie } from "cookies-next";
import { useStore } from "./useStore";
import { useToast } from "@/hooks";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name cannot exceed 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignUpForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth, authOpen, setAuthOpen } = useStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { mutate } = useMutation({
    mutationFn: WEBSITE_API.signup,
    onSuccess: (data) => {
      form.reset();
      setCookie("x-customer-token", data.token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      setAuth({
        token: data.token,
        user: data.user,
      });
      toast({
        title: "Success",
        description: "You have successfully signed up",
      });
    },
    onError: (error) => {
      const msg = isAxiosError(error)
        ? error.response?.data.message
        : error.message;
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { password, confirmPassword } = values;
    if (password !== confirmPassword) {
      form.setError("confirmPassword", {
        message: "Passwords do not match",
      });

      return;
    }

    mutate(values);
  }

  return (
    <Dialog
      open={authOpen === "register"}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setAuthOpen("none");
        } else {
          setAuthOpen("register");
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <CardContent className="w-full max-w-[30rem] space-y-3">
          <CardTitle className="w-full text-3xl 2xl:text-4xl text-center">
            Sign Up
          </CardTitle>
          <CardDescription className="w-full text-center text-base">
            Create an account to get started
          </CardDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="rounded-md h-10"
                        type="text"
                        placeholder="Full Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="rounded-md h-10"
                        type="email"
                        placeholder="Email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="rounded-md h-10"
                        type="text"
                        placeholder="Phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password Field */}
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
              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <Input
                        className="rounded-md h-10"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button className="w-full h-10 rounded-md" type="submit">
                Sign Up
              </Button>
              <div className="text-sm text-center">
                Already have an account?{" "}
                <span
                  onClick={() => setAuthOpen("login")}
                  className="hover:underline cursor-pointer text-sky-500  transition-all duration-150"
                >
                  Log In
                </span>
              </div>
            </form>
          </Form>

          <div className="w-full py-4 px-6">
            <p className="text-center text-sm text-gray-500">
              By signing up, you agree to our{" "}
              <Link href="/terms-of-service" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};
