"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks";
import { subjectService } from "@/services/subject";
import { CreateSubjectInput } from "@/types/program";
import { Plus } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useSubject } from "@/hooks/use-subject";

const subjectSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  credit: z.number().min(0.5, "Credit must be at least 0.5").max(10, "Credit cannot exceed 10"),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export const CreateSubjectDialog = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { createSubject, invalidateSubjects } = useSubject();

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      code: "",
      name: "",
      credit: 3,
    },
  });

  const onSubmit = async (data: SubjectFormValues) => {
    setIsSubmitting(true);
    try {
      createSubject.mutate(data, {
        onSuccess: () => {
            invalidateSubjects();
            toast({
              title: "Success",
              description: `Subject "${data.name}" created successfully`,
          });
          form.reset();
          setIsOpen(false);
        },
        onError: (error) => {
          console.error("Error creating subject:", error);
          toast({
            title: "Error",
            description: "Failed to create subject",
          });
        },
      });
    } catch (error) {
      console.error("Error creating subject:", error);
      toast({
        title: "Error",
        description: "Failed to create subject",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Add a new subject to the system
        </DialogDescription>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Programming" {...field} />
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
                      <FormLabel>Subject Code</FormLabel>
                      <FormControl>
                        <Input placeholder="CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="credit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Hours</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0.5" 
                        max="10" 
                        step="0.5" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Subject"}
                </Button>
              </div>
            </form>
          </Form>
      </DialogContent>
    </Dialog>
  );
} 