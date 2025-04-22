import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Exam, CreateExamInput } from "@/types/exam";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { examService } from "@/services/exam";
import { useToast } from "@/hooks";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const examFormSchema = z.object({
  name: z.string().min(1, "Exam name is required"),
  subjectOfferingId: z.string().min(1, "Subject offering is required"),
  examDate: z.date({
    required_error: "Exam date is required",
  }),
  maxMarks: z.number().min(1, "Maximum marks must be greater than 0"),
  weight: z.number().min(0).max(100, "Weight must be between 0 and 100"),
});

type ExamFormValues = z.infer<typeof examFormSchema>;

interface AddExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam?: Exam | null;
  onSuccess: () => void;
}

export function AddExamDialog({
  open,
  onOpenChange,
  exam,
  onSuccess,
}: AddExamDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      name: exam?.name || "",
      subjectOfferingId: exam?.subjectOfferingId || "",
      examDate: exam ? new Date(exam.examDate) : undefined,
      maxMarks: exam?.maxMarks || 100,
      weight: exam?.weight || 100,
    },
  });

  const createExamMutation = useMutation({
    mutationFn: examService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast({
        title: "Success",
        description: "Exam created successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create exam",
        variant: "destructive",
      });
    },
  });

  const updateExamMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExamInput> }) =>
      examService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast({
        title: "Success",
        description: "Exam updated successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update exam",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ExamFormValues) => {
    if (exam) {
      updateExamMutation.mutate({ id: exam.id, data });
    } else {
      createExamMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{exam ? "Edit Exam" : "Add Exam"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter exam name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectOfferingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Offering</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject offering" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Add subject offering options here */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="examDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Exam Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Marks</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter maximum marks"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Enter weight percentage"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {exam ? "Update Exam" : "Create Exam"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 