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
import { financeService } from "@/services/finance";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "../ui/date-picker";

const paymentSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  method: z.enum(["Cash", "Bank", "Cheque"]),
  paymentDate: z.date(),
  transactionReference: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string | null;
}

export function RecordPaymentDialog({
  open,
  onOpenChange,
  invoiceId,
}: RecordPaymentDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoice } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => (invoiceId ? financeService.getInvoiceById(invoiceId) : null),
    enabled: !!invoiceId,
  });

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: invoice?.dueAmount || 0,
      method: "Cash",
      paymentDate: new Date(),
      transactionReference: "",
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: (data: PaymentFormData) =>
      financeService.createPayment(invoiceId!, {
        ...data,
        paymentDate: data.paymentDate.toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PaymentFormData) => {
    createPaymentMutation.mutate(data);
  };

  if (!invoice) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Invoice Amount
                </h3>
                <p className="text-lg">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(invoice.totalAmount)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Due Amount
                </h3>
                <p className="text-lg">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(invoice.dueAmount)}
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
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
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
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

            <FormField
              control={form.control}
              name="transactionReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Reference (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              <Button type="submit">Record Payment</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 