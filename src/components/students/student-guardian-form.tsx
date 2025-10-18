import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { studentGuardianFormSchema, StudentGuardianFormValues } from "./student-form";
import { Loader2 } from "lucide-react";

interface StudentGuardianFormProps {
  defaultValues?: Partial<StudentGuardianFormValues>;
  onSubmit: (data: StudentGuardianFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  hasExistingPrimaryGuardian?: boolean;
}

export function StudentGuardianForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Submit",
  hasExistingPrimaryGuardian = false,
}: StudentGuardianFormProps) {
  const form = useForm<StudentGuardianFormValues>({
    resolver: zodResolver(studentGuardianFormSchema),
    defaultValues: {
      fullName: "",
      relationship: "",
      phone: "",
      email: "",
      occupation: "",
      isPrimary: false,
      ...defaultValues,
    },
  });

  const handleFormSubmit = (data: StudentGuardianFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Guardian's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Father, Mother, Guardian" {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Contact phone number" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="Guardian's occupation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPrimary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={hasExistingPrimaryGuardian && !defaultValues?.isPrimary}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Primary Guardian
                  </FormLabel>
                  <FormDescription>
                    {hasExistingPrimaryGuardian && !defaultValues?.isPrimary
                      ? "There is already a primary guardian assigned. You must change the primary guardian status of the existing primary guardian first."
                      : "Set as the primary contact for the student"}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
} 