import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { financeService } from "@/services/finance";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "../ui/date-picker";

const scholarshipSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["Zakat", "Waqf", "Other"]),
  source: z.string().min(1, "Source is required"),
  notes: z.string().optional(),
  awardedDate: z.date(),
});

type ScholarshipFormData = z.infer<typeof scholarshipSchema>;

interface ScholarshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarshipId?: string | null;
  onSuccess?: () => void;
}

export function ScholarshipDialog({
  open,
  onOpenChange,
  scholarshipId,
  onSuccess,
}: ScholarshipDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => {
      return [
        { name: "XYZ", id: "1", rollNumber: 123, }
      ]
    }
  });

  const form = useForm<ScholarshipFormData>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      studentId: "",
      amount: 0,
      type: "Zakat",
      source: "",
      notes: "",
      awardedDate: new Date(),
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ScholarshipFormData) =>
      financeService.createScholarship({
        ...data,
        awardedDate: data.awardedDate.toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scholarships"] });
      toast({
        title: "Success",
        description: "Scholarship created successfully",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create scholarship",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ScholarshipFormData) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {scholarshipId ? "Edit Scholarship" : "Add Scholarship"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.rollNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Zakat">Zakat</SelectItem>
                      <SelectItem value="Waqf">Waqf</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="awardedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Awarded Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 