"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campusService } from "@/services/campus";
import { campusFormSchema, type CampusFormValues } from "./campus-form";
import { Campus } from "@/types/campus";
import { useToast, useCampus } from "@/hooks";
import { isAxiosError } from "axios";

interface EditCampusDialogProps {
  children: React.ReactNode;
  campus: Campus;
}

export function EditCampusDialog({ children, campus }: EditCampusDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { updateCampus, invalidateCampuses } = useCampus()

  const form = useForm<CampusFormValues>({
    resolver: zodResolver(campusFormSchema),
    defaultValues: {
      name: campus.name,
      code: campus.code,
      address_line1: campus.address_line1,
      city: campus.city,
      country: campus.country,
      is_main: campus.is_main,
    },
  });

  

  const onSubmit = (data: CampusFormValues) => {
    updateCampus.mutate({id: campus.id, data}, {
      onSuccess: () => {
        invalidateCampuses()
        setOpen(false)
        form.reset()
        toast({
          title: "Success",
          description: "Campus updated successfully",
        })
      },
      onError: (err) => {
        const msg = isAxiosError(err) ? err.response?.data?.error || "Failed to update campus" : "Failed to update campus"
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        })
      }
    })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Campus</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campus name" {...field} />
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
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campus code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campus address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_main"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Main Campus</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateCampus.isPending}>
                {updateCampus.isPending ? "Updating..." : "Update Campus"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 