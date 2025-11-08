"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Invoice, PaymentMethod } from "@/types/finance";
import { useCreatePayment } from "@/hooks/use-finance";

interface QuickPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function QuickPaymentModal({ open, onOpenChange, invoice }: QuickPaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: 0,
    payment_method: "cash" as PaymentMethod,
    payment_date: new Date().toISOString().split('T')[0],
    transaction_id: "",
    remarks: "",
  });

  const createPaymentMutation = useCreatePayment();

  // Reset and pre-fill when invoice changes
  useEffect(() => {
    if (invoice) {
      setFormData({
        amount: Number(invoice.due_amount),
        payment_method: "cash",
        payment_date: new Date().toISOString().split('T')[0],
        transaction_id: "",
        remarks: "",
      });
    }
  }, [invoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoice) return;

    if (formData.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (formData.amount > Number(invoice.due_amount)) {
      toast.error("Amount cannot exceed due amount");
      return;
    }

    createPaymentMutation.mutate(
      {
        invoice_id: invoice.id,
        ...formData,
      },
      {
        onSuccess: () => {
          toast.success("Payment recorded successfully!");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to record payment");
        },
      }
    );
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Quick Payment
          </DialogTitle>
          <DialogDescription>
            Record payment for Invoice #{invoice.invoice_number}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Invoice Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Student:</span>
              <span className="font-medium">{invoice.student?.user?.name || "Unknown"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Invoice Total:</span>
              <span className="font-medium">${Number(invoice.net_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Already Paid:</span>
              <span className="font-medium text-green-600">${Number(invoice.paid_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-600 font-semibold">Due Amount:</span>
              <span className="font-bold text-lg text-red-600">${Number(invoice.due_amount).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Payment Amount <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={Number(invoice.due_amount)}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="pl-7"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Maximum: ${Number(invoice.due_amount).toFixed(2)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">
                Payment Method <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value: PaymentMethod) => setFormData({ ...formData, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">
                Payment Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_id">Transaction ID / Reference</Label>
              <Input
                id="transaction_id"
                value={formData.transaction_id}
                onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Optional notes about this payment"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createPaymentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPaymentMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {createPaymentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Record Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
