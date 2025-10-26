import { useState } from "react";
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
import { Plus, Trash2 } from "lucide-react";
import { financeService } from "@/services/finance";
import { programService } from "@/services/program";
import { useToast } from "@/hooks/use-toast";
import { FeeItemType, CreateFeePlanInput } from "@/types/finance";
import { DatePicker } from "../ui/date-picker";

const feePlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  programId: z.string().min(1, "Program is required"),
  effectiveFrom: z.date(),
  items: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      amount: z.number().min(0, "Amount must be positive"),
      type: z.enum(["Admission", "Term", "Hostel", "Transport"]),
    })
  ),
});

type FeePlanFormData = z.infer<typeof feePlanSchema>;

interface FeePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId?: string | null;
  onSuccess?: () => void;
}

export function FeePlanDialog({
  open,
  onOpenChange,
  planId,
  onSuccess,
}: FeePlanDialogProps) {
  const [items, setItems] = useState<Array<{ label: string; amount: number; type: FeeItemType }>>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: programs } = useQuery({
    queryKey: ["programs"],
    queryFn: () => programService.getAllPrograms(),
  });

  const { data: existingPlan } = useQuery({
    queryKey: ["fee-plan", planId],
    queryFn: () => (planId ? financeService.getFeePlanById(planId) : null),
    enabled: !!planId,
  });

  const form = useForm<FeePlanFormData>({
    resolver: zodResolver(feePlanSchema),
    defaultValues: {
      name: "",
      programId: "",
      effectiveFrom: new Date(),
      items: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: FeePlanFormData) => {
      const input: CreateFeePlanInput = {
        ...data,
        effectiveFrom: data.effectiveFrom.toISOString(),
        items: data.items.map(item => ({
          label: item.label,
          amount: item.amount,
          type: item.type,
        })),
      };
      return financeService.createFeePlan(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-plans"] });
      toast({
        title: "Success",
        description: "Fee plan created successfully",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create fee plan",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FeePlanFormData }) => {
      const input: CreateFeePlanInput = {
        ...data,
        effectiveFrom: data.effectiveFrom.toISOString(),
        items: data.items.map(item => ({
          label: item.label,
          amount: item.amount,
          type: item.type,
        })),
      };
      return financeService.updateFeePlan(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-plans"] });
      toast({
        title: "Success",
        description: "Fee plan updated successfully",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update fee plan",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: FeePlanFormData) => {
    if (planId) {
      updateMutation.mutate({ id: planId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const addItem = () => {
    setItems([...items, { label: "", amount: 0, type: "Term" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{planId ? "Edit Fee Plan" : "Add Fee Plan"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="programId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programs?.map((program) => (
                        <SelectItem key={program.id} value={String(program.id)}>
                          {program.title}
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
              name="effectiveFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effective From</FormLabel>
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Fee Items</h3>
                <Button type="button" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <FormLabel>Label</FormLabel>
                    <Input
                      value={item.label}
                      onChange={(e) =>
                        updateItem(index, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <FormLabel>Amount</FormLabel>
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(index, "amount", parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <FormLabel>Type</FormLabel>
                    <Select
                      value={item.type}
                      onValueChange={(value) =>
                        updateItem(index, "type", value as FeeItemType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admission">Admission</SelectItem>
                        <SelectItem value="Term">Term</SelectItem>
                        <SelectItem value="Hostel">Hostel</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

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