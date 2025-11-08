"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Eye, ChevronLeft, ChevronRight, Loader2, Pencil, RotateCcw, Printer } from "lucide-react";
import { toast } from "sonner";
import { Payment, CreatePaymentInput, PaymentMethod } from "@/types/finance";
import { format } from "date-fns";
import {
  usePayments,
  usePayment,
  useCreatePayment,
  useUpdatePayment,
  useRefundPayment,
  useInvoices,
} from "@/hooks/use-finance";

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editFormData, setEditFormData] = useState({
    payment_date: "",
    payment_method: "cash" as PaymentMethod,
    transaction_id: "",
    remarks: "",
  });
  const [refundReason, setRefundReason] = useState("");

  const [formData, setFormData] = useState<CreatePaymentInput>({
    invoice_id: 0,
    amount: 0,
    payment_method: "cash",
    payment_date: new Date().toISOString().split('T')[0],
  });

  // Build filters
  const paymentFilters = {
    search: searchQuery || undefined,
    payment_method: methodFilter !== "all" ? (methodFilter as PaymentMethod) : undefined,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
    per_page: 15,
  };

  const invoiceFilters = {
    status: "pending" as const,
    per_page: 100,
  };

  // Hooks
  const { data: paymentsData, isLoading: loading } = usePayments(paymentFilters, currentPage);
  const { data: invoicesData } = useInvoices(invoiceFilters, 1);
  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();
  const refundPaymentMutation = useRefundPayment();

  // Derived data
  const payments = paymentsData?.data || [];
  const totalPages = paymentsData?.last_page || 1;
  const invoices = invoicesData?.data || [];

  const handleCreate = () => {
    setFormData({
      invoice_id: 0,
      amount: 0,
      payment_method: "cash",
      payment_date: new Date().toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id.toString() === invoiceId);
    if (invoice) {
      setFormData({
        ...formData,
        invoice_id: invoice.id,
        amount: Number(invoice.due_amount),
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.invoice_id || !formData.amount || !formData.payment_method) {
      toast.error("Please fill all required fields");
      return;
    }

    createPaymentMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Payment recorded successfully");
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Operation failed");
      },
    });
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditFormData({
      payment_date: payment.payment_date,
      payment_method: payment.payment_method,
      transaction_id: payment.transaction_id || "",
      remarks: payment.remarks || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePayment = () => {
    if (!selectedPayment) return;

    updatePaymentMutation.mutate(
      { id: selectedPayment.id, data: editFormData },
      {
        onSuccess: () => {
          toast.success("Payment updated successfully");
          setIsEditDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to update payment");
        },
      }
    );
  };

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundReason("");
    setIsRefundDialogOpen(true);
  };

  const handleConfirmRefund = () => {
    if (!selectedPayment) return;

    refundPaymentMutation.mutate(
      { id: selectedPayment.id, data: { refund_reason: refundReason } },
      {
        onSuccess: () => {
          toast.success("Payment refunded successfully");
          setIsRefundDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to refund payment");
        },
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground mt-1">Record and manage payments</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="from_date" className="text-sm">From Date</Label>
                <Input
                  id="from_date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="to_date" className="text-sm">To Date</Label>
                <Input
                  id="to_date"
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              {(fromDate || toDate || searchQuery || methodFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setMethodFilter("all");
                    setFromDate("");
                    setToDate("");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No payments found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment #</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.payment_number}</TableCell>
                      <TableCell>{payment.invoice?.invoice_number || "-"}</TableCell>
                      <TableCell>{payment.student?.user?.name || payment.invoice?.student?.user?.name || "-"}</TableCell>
                      <TableCell>{format(new Date(payment.payment_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-right">${Number(payment.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.payment_method.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(payment)} title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.status === "completed" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(payment)} title="Edit Payment">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleRefund(payment)} title="Refund Payment" className="text-orange-600 hover:text-orange-700">
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Print Receipt">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Record a payment against an invoice</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invoice *</Label>
              <Select
                value={formData.invoice_id.toString()}
                onValueChange={handleInvoiceSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id.toString()}>
                      {inv.invoice_number} - {inv.student?.user?.name} (Due: ${Number(inv.due_amount).toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method *</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(v: PaymentMethod) => setFormData({ ...formData, payment_method: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Date *</Label>
              <Input
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Transaction ID</Label>
              <Input
                value={formData.transaction_id || ""}
                onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                value={formData.remarks || ""}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Optional notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={createPaymentMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createPaymentMutation.isPending}>
              {createPaymentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payment Number</Label>
                  <p className="text-sm mt-1">{selectedPayment.payment_number}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedPayment.status === "completed" ? "default" : "secondary"}>
                      {selectedPayment.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Number</Label>
                  <p className="text-sm mt-1">{selectedPayment.invoice?.invoice_number || "-"}</p>
                </div>
                <div>
                  <Label>Student</Label>
                  <p className="text-sm mt-1">{selectedPayment.student?.user?.name || selectedPayment.invoice?.student?.user?.name || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payment Date</Label>
                  <p className="text-sm mt-1">{format(new Date(selectedPayment.payment_date), "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="text-sm mt-1 font-bold">${Number(selectedPayment.amount).toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payment Method</Label>
                  <p className="text-sm mt-1">{selectedPayment.payment_method.replace("_", " ")}</p>
                </div>
                <div>
                  <Label>Transaction ID</Label>
                  <p className="text-sm mt-1">{selectedPayment.transaction_id || "-"}</p>
                </div>
              </div>
              {selectedPayment.remarks && (
                <div>
                  <Label>Remarks</Label>
                  <p className="text-sm mt-1">{selectedPayment.remarks}</p>
                </div>
              )}
              <div>
                <Label>Collected By</Label>
                <p className="text-sm mt-1">{selectedPayment.collected_by_user?.name || "-"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Update payment details for {selectedPayment?.payment_number}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Date *</Label>
              <Input
                type="date"
                value={editFormData.payment_date}
                onChange={(e) => setEditFormData({ ...editFormData, payment_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method *</Label>
              <Select
                value={editFormData.payment_method}
                onValueChange={(v: PaymentMethod) => setEditFormData({ ...editFormData, payment_method: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Transaction ID</Label>
              <Input
                value={editFormData.transaction_id}
                onChange={(e) => setEditFormData({ ...editFormData, transaction_id: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                value={editFormData.remarks}
                onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                placeholder="Optional notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={updatePaymentMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePayment} disabled={updatePaymentMutation.isPending}>
              {updatePaymentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Payment Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to refund payment {selectedPayment?.payment_number}?
              <br />
              <span className="text-red-600 font-semibold">Amount: ${Number(selectedPayment?.amount).toFixed(2)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This action will mark the payment as refunded and update the related invoice.
                This cannot be undone.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Refund Reason *</Label>
              <Textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Please provide a reason for this refund"
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)} disabled={refundPaymentMutation.isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRefund}
              disabled={refundPaymentMutation.isPending || !refundReason.trim()}
              variant="destructive"
            >
              {refundPaymentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
