"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useRole, useToast } from "@/hooks";
import { isAxiosError } from "axios";
import { CreateRoleInput } from "@/types/role";

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  label: z.string().min(1, "Label is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export function AddRoleDialog({
  open,
  onOpenChange,
  children,
}: AddRoleDialogProps) {
  const { createRole, invalidateRoles } = useRole();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      label: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    const roleData: CreateRoleInput = {
      code: data.code,
      label: data.label,
    };

    createRole.mutate(roleData, {
      onSuccess: () => {
        invalidateRoles();
        onOpenChange(false);
        form.reset();
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      },
      onError: (err) => {
        const msg = isAxiosError(err) 
          ? err.response?.data?.error || "Failed to create role" 
          : "Failed to create role";
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role code" {...field} />
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
              <Button type="submit" disabled={createRole.isPending}>
                {createRole.isPending ? "Creating..." : "Add Role"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 