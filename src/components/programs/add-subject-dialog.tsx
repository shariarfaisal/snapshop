import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Program } from "@/types/program";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { programService } from "@/services/program";
import { useToast } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";

const subjectFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  creditHours: z.number().min(1).max(6),
  year: z.number().min(1),
  term: z.number().min(1).max(2),
  mandatory: z.boolean(),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program;
}

export function AddSubjectDialog({
  open,
  onOpenChange,
  program,
}: AddSubjectDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: "",
      code: "",
      creditHours: 3,
      year: 1,
      term: 1,
      mandatory: true,
    },
  });

  const addSubjectMutation = useMutation({
    mutationFn: (data: SubjectFormValues) =>
      programService.addSubject(program.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects", program.id] });
      toast({
        title: "Success",
        description: "Subject added successfully",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add subject",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: SubjectFormValues) => {
    addSubjectMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subject to {program.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject name" {...field} />
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
                    <Input placeholder="Enter subject code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creditHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={6}
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
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: program.duration }, (_, i) => i + 1).map(
                        (year) => (
                          <SelectItem key={year} value={year.toString()}>
                            Year {year}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2].map((term) => (
                        <SelectItem key={term} value={term.toString()}>
                          Term {term}
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
              name="mandatory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mandatory Subject</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Subject</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 