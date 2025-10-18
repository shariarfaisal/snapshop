"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, ResetPasswordInput } from "@/types/user";
import { useUser, useToast } from "@/hooks";
import { isAxiosError } from "axios";

const passwordSchema = z
  .object({
    new_password: z.string().min(8, "New password must be at least 8 characters"),
    confirm_new_password: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  user,
}: ResetPasswordDialogProps) {
  const { adminResetUserPassword } = useUser();
  const { toast } = useToast();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      new_password: "",
      confirm_new_password: "",
    },
  });

  const handleSubmit = (data: PasswordFormValues) => {
    const resetData: ResetPasswordInput = {
      new_password: data.new_password,
    };

    adminResetUserPassword.mutate(
      { id: user.id, data: resetData },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Password has been reset successfully",
          });
          form.reset();
          onOpenChange(false);
        },
        onError: (err) => {
          const msg = isAxiosError(err)
            ? err.response?.data?.error || "Failed to reset password"
            : "Failed to reset password";
          toast({
            title: "Error",
            description: msg,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password for {user.username}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={adminResetUserPassword.isPending}>
                {adminResetUserPassword.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 