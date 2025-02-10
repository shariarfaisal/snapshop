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
import { EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { CardContent, CardDescription, CardTitle } from "@/components";
import { useMutation } from "@tanstack/react-query";
import { WEBSITE_API } from "@/services/website";
import { isAxiosError } from "axios";
import { setCookie } from "cookies-next";
import { Dialog, DialogContent } from "@/components";
import { useStore } from "./useStore";
import { useToast } from "@/hooks";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const LoginForm = () => {
  const { setAuth, authOpen, setAuthOpen } = useStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: WEBSITE_API.login,
    onSuccess: (data) => {
      form.reset();
      setCookie("x-customer-token", data.token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      setAuth({
        token: data.token,
        user: data.user,
      });
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Dialog
      open={authOpen === "login"}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setAuthOpen("none");
        } else {
          setAuthOpen("login");
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <CardContent className="w-full max-w-[30rem] space-y-3">
          <CardTitle className="w-full text-3xl 2xl:text-4xl text-center">
            Log In
          </CardTitle>
          <CardDescription className="w-full text-center text-base">
            Enter your email below to create your account
          </CardDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-0">
                    <FormControl>
                      <Input
                        className="rounded-md h-10"
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

              <Button className="w-full h-10 rounded-md" type="submit">
                {isPending && <Loader className="w-5 h-5 mr-2 animate-spin" />}
                Sign In
              </Button>
              <div className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => setAuthOpen("register")}
                    className="hover:underline text-sky-500 cursor-pointer"
                  >
                    Sign Up
                  </span>
                </div>
                {/* <Link
                  className="hover:underline transition-all duration-150"
                  href="/reset-password"
                >
                  Forgot Password?
                </Link> */}
              </div>
            </form>
          </Form>

          <div className="w-full py-4 px-6">
            <p className="text-center text-sm text-gray-500">
              By clicking continue, you agree to our{" "}
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
