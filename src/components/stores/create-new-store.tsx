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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Label } from "../ui";

const formSchema = z.object({
  storeName: z
    .string()
    .min(2, { message: "Store name must be at least 2 characters" })
    .max(50, { message: "Store name cannot exceed 50 characters" }),
  storeLogo: z.any().refine((file) => file && file.size < 5000000, {
    message: "File size should be less than 5MB",
  }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, {
    message: "Please enter a valid phone number",
  }),
  currency: z.string().min(1, { message: "Please select a currency" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  domain: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/.test(val), {
      message: "Enter a valid domain (e.g., mystore.com)",
    }),
});

export const CreateNewStore = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storeName: "",
      storeLogo: null,
      email: "",
      phone: "",
      currency: "",
      address: "",
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <CardContent className="w-full max-w-[40rem] space-y-5">
      <CardTitle className="w-full text-3xl 2xl:text-4xl text-center">
        Store Setup
      </CardTitle>
      <CardDescription className="w-full text-center text-base">
        Fill out the details below to set up your store
      </CardDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Store Name Field */}
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <Label>Store Name</Label>
                <FormControl>
                  <Input
                    className="rounded-md h-10"
                    type="text"
                    placeholder="Enter your store name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <Label>Domain</Label>
                <FormControl>
                  <Input
                    className="rounded-md h-10"
                    type="text"
                    placeholder="Enter your custom domain (e.g., mystore.com)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Store Logo Field */}
          <FormField
            control={form.control}
            name="storeLogo"
            render={({ field }) => (
              <FormItem>
                <Label>Store Logo</Label>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={(e) => field.onChange(e.target.files?.[0])}
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
                <Label>Email</Label>
                <FormControl>
                  <Input
                    className="rounded-md h-10"
                    type="email"
                    placeholder="Store email address"
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
                <Label>Phone Number</Label>
                <FormControl>
                  <Input
                    className="rounded-md h-10"
                    type="tel"
                    placeholder="Phone number (e.g., +1234567890)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Currency Field */}
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <Label>Currency</Label>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">
                        USD - United States Dollar
                      </SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="BDT">
                        BDT - Bangladeshi Taka
                      </SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Field */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <Label>Address</Label>
                <FormControl>
                  <Textarea
                    className="rounded-md"
                    placeholder="Enter your store address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full h-10 rounded-md" type="submit">
            Save & Continue
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};
