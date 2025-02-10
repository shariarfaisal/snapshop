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

const formSchema = z.object({
  otp: z.string(),
});

export const VerifyOtpForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="mb-0">
              <FormControl>
                <Input
                  className="rounded-md h-10"
                  type="text"
                  placeholder="Enter OTP"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Resend OTP</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-700">
              44
            </span>
            <span className="text-gray-600">seconds</span>
          </div>
        </div>

        <Button className="w-full h-10 rounded-md" type="submit">
          Continue
        </Button>
        <Link href="/login" className="w-full flex items-center justify-center">
          Login
        </Link>
      </form>
    </Form>
  );
};
