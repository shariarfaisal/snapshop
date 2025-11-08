"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye, Trash2, ChevronLeft, ChevronRight, Loader2, FileText, CreditCard, AlertCircle, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Invoice, CreateInvoiceInput, InvoiceStatus } from "@/types/finance";
import { format, isPast } from "date-fns";
import { QuickPaymentModal } from "@/components/finance/quick-payment-modal";
import {
  useInvoices,
  useInvoice,
  useCreateInvoice,
  useUpdateInvoice,
  useDeleteInvoice,
  useBulkGenerateInvoices,
  useFeeStructures,
} from "@/hooks/use-finance";
import { useStudents } from "@/hooks/use-student";
import { useSchoolClasses } from "@/hooks/use-school-classes";

export default function InvoicesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editFormData, setEditFormData] = useState({
    due_date: "",
    discount_amount: 0,
    description: "",
    remarks: "",
  });

  const [formData, setFormData] = useState<CreateInvoiceInput>({
    student_id: 0,
    due_date: "",
  });

  const [bulkFormData, setBulkFormData] = useState({
    class_id: 0,
    fee_structure_id: 0,
    due_date: "",
  });

  // Build filters
  const filters = {
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? (statusFilter as InvoiceStatus) : undefined,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
    per_page: 15,
  };

  // Hooks
  const { data: invoicesData, isLoading: loading } = useInvoices(filters, currentPage);
  const { data: studentsData } = useStudents({ per_page: 100 }, 1);
  const { data: feeStructuresData } = useFeeStructures({ per_page: 100 }, 1);
  const { data: classesData } = useSchoolClasses();
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoice();
  const deleteInvoiceMutation = useDeleteInvoice();
  const bulkGenerateInvoicesMutation = useBulkGenerateInvoices();

  // Derived data
  const invoices = invoicesData?.data || [];
  const totalPages = invoicesData?.last_page || 1;
  const students = studentsData?.data || [];
  const feeStructures = feeStructuresData?.data || [];
  const classes = classesData?.data || classesData || [];

  const handleCreate = () => {
    setFormData({ student_id: 0, due_date: "" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.student_id || !formData.due_date) {
      toast.error("Please fill all required fields");
      return;
    }

    createInvoiceMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Invoice created successfully");
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Operation failed");
      },
    });
  };

  const handleBulkGenerate = async () => {
    if (!bulkFormData.class_id || !bulkFormData.fee_structure_id || !bulkFormData.due_date) {
      toast.error("Please fill all required fields");
      return;
    }

    bulkGenerateInvoicesMutation.mutate(bulkFormData, {
      onSuccess: (result) => {
        toast.success(`Generated ${result.length} invoices successfully`);
        setIsBulkDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Operation failed");
      },
    });
  };

  const handleViewDetails = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsDialogOpen(true);
  };

  const handleQuickPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setEditFormData({
      due_date: invoice.due_date,
      discount_amount: Number(invoice.discount_amount),
      description: invoice.description || "",
      remarks: invoice.remarks || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateInvoice = async () => {
    if (!selectedInvoice) return;

    updateInvoiceMutation.mutate(
      { id: selectedInvoice.id, data: editFormData },
      {
        onSuccess: () => {
          toast.success("Invoice updated successfully!");
          setIsEditDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to update invoice");
        },
      }
    );
  };

  const handleDelete = async () => {
    if (!selectedInvoice) return;

    deleteInvoiceMutation.mutate(selectedInvoice.id, {
      onSuccess: () => {
        toast.success("Invoice deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedInvoice(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete");
      },
    });
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const variants: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      partially_paid: "outline",
      paid: "default",
      overdue: "destructive",
      cancelled: "secondary",
    };
    return <Badge variant={variants[status] || "default"}>{status.replace("_", " ")}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage student invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBulkDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Bulk Generate
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
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
              {(fromDate || toDate || searchQuery || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
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
          ) : invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No invoices found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const isOverdue = invoice.status === 'overdue' || (invoice.status !== 'paid' && isPast(new Date(invoice.due_date)));
                    const canPay = invoice.status === 'pending' || invoice.status === 'partially_paid' || invoice.status === 'overdue';

                    return (
                    <TableRow
                      key={invoice.id}
                      className={isOverdue ? "bg-red-50 hover:bg-red-100" : ""}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {invoice.invoice_number}
                          {isOverdue && <AlertCircle className="h-4 w-4 text-red-600" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        {invoice.student?.user?.name || "-"}
                        {invoice.student?.roll_number && (
                          <div className="text-xs text-muted-foreground">
                            Roll: {invoice.student.roll_number}
                          </div>
                        )}
                        {invoice.student?.school_class?.name && (
                          <div className="text-xs text-muted-foreground">
                            {invoice.student.school_class.name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell className={isOverdue ? "text-red-600 font-semibold" : ""}>
                        {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">${Number(invoice.net_amount).toFixed(2)}</TableCell>
                      <TableCell className="text-right">${Number(invoice.paid_amount).toFixed(2)}</TableCell>
                      <TableCell className="text-right">${Number(invoice.due_amount).toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {canPay && (
                            <Button
                              size="sm"
                              onClick={() => handleQuickPayment(invoice)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          )}
                          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(invoice)} title="Edit Invoice">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(invoice)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
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
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Generate a new invoice for a student</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Student *</Label>
              <Select
                value={formData.student_id.toString()}
                onValueChange={(v) => setFormData({ ...formData, student_id: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => {
                    const className = s.school_class?.name || 'N/A';
                    const rollNo = s.roll_number || 'N/A';
                    const studentName = s.user?.name || 'Unknown';
                    return (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {studentName} • Roll: {rollNo} • Class: {className}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fee Structure</Label>
              <Select
                value={formData.fee_structure_id?.toString()}
                onValueChange={(v) => setFormData({ ...formData, fee_structure_id: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee structure" />
                </SelectTrigger>
                <SelectContent>
                  {feeStructures.map((fs) => (
                    <SelectItem key={fs.id} value={fs.id.toString()}>
                      {fs.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={createInvoiceMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createInvoiceMutation.isPending}>
              {createInvoiceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Generate Invoices</DialogTitle>
            <DialogDescription>Generate invoices for all students in a class</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Class *</Label>
              <Select
                value={bulkFormData.class_id.toString()}
                onValueChange={(v) => setBulkFormData({ ...bulkFormData, class_id: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fee Structure *</Label>
              <Select
                value={bulkFormData.fee_structure_id.toString()}
                onValueChange={(v) => setBulkFormData({ ...bulkFormData, fee_structure_id: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee structure" />
                </SelectTrigger>
                <SelectContent>
                  {feeStructures.map((fs) => (
                    <SelectItem key={fs.id} value={fs.id.toString()}>
                      {fs.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={bulkFormData.due_date}
                onChange={(e) => setBulkFormData({ ...bulkFormData, due_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)} disabled={bulkGenerateInvoicesMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleBulkGenerate} disabled={bulkGenerateInvoicesMutation.isPending}>
              {bulkGenerateInvoicesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Number</Label>
                  <p className="text-sm mt-1">{selectedInvoice.invoice_number}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student</Label>
                  <div className="text-sm mt-1">
                    <p className="font-medium">{selectedInvoice.student?.user?.name || "-"}</p>
                    {selectedInvoice.student?.roll_number && (
                      <p className="text-xs text-muted-foreground">
                        Roll: {selectedInvoice.student.roll_number}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Class</Label>
                  <p className="text-sm mt-1">{selectedInvoice.student?.school_class?.name || selectedInvoice.fee_structure?.school_class?.name || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Date</Label>
                  <p className="text-sm mt-1">{format(new Date(selectedInvoice.invoice_date), "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <p className="text-sm mt-1">{format(new Date(selectedInvoice.due_date), "MMM dd, yyyy")}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Gross Amount:</div>
                  <div className="text-right">${Number(selectedInvoice.gross_amount).toFixed(2)}</div>
                  <div>Discount:</div>
                  <div className="text-right text-green-600">-${Number(selectedInvoice.discount_amount).toFixed(2)}</div>
                  <div>Tax:</div>
                  <div className="text-right">${Number(selectedInvoice.tax_amount).toFixed(2)}</div>
                  <div className="font-semibold">Net Amount:</div>
                  <div className="text-right font-semibold">${Number(selectedInvoice.net_amount).toFixed(2)}</div>
                  <div className="text-green-600">Paid Amount:</div>
                  <div className="text-right text-green-600">${Number(selectedInvoice.paid_amount).toFixed(2)}</div>
                  <div className="font-bold text-lg">Due Amount:</div>
                  <div className="text-right font-bold text-lg">${Number(selectedInvoice.due_amount).toFixed(2)}</div>
                </div>
              </div>
              {selectedInvoice.payments && selectedInvoice.payments.length > 0 && (
                <div className="border-t pt-4">
                  <Label>Payment History</Label>
                  <Table className="mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{format(new Date(payment.payment_date), "MMM dd, yyyy")}</TableCell>
                          <TableCell>{payment.payment_method}</TableCell>
                          <TableCell className="text-right">${Number(payment.amount).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete invoice "{selectedInvoice?.invoice_number}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteInvoiceMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteInvoiceMutation.isPending}>
              {deleteInvoiceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-blue-600" />
              Edit Invoice
            </DialogTitle>
            <DialogDescription>
              Update invoice details for {selectedInvoice?.invoice_number}
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4">
              {/* Current Invoice Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Student:</span>
                  <span className="font-medium">{selectedInvoice.student?.user?.name || "Unknown"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Gross Amount:</span>
                  <span className="font-medium">${Number(selectedInvoice.gross_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Discount:</span>
                  <span className="font-medium text-green-600">-${Number(selectedInvoice.discount_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-600 font-semibold">Current Net Amount:</span>
                  <span className="font-bold text-lg">${Number(selectedInvoice.net_amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_due_date">
                      Due Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit_due_date"
                      type="date"
                      value={editFormData.due_date}
                      onChange={(e) => setEditFormData({ ...editFormData, due_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit_discount">
                      Discount Amount ($)
                    </Label>
                    <Input
                      id="edit_discount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={Number(selectedInvoice.gross_amount)}
                      value={editFormData.discount_amount}
                      onChange={(e) => setEditFormData({ ...editFormData, discount_amount: parseFloat(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-gray-500">
                      Maximum: ${Number(selectedInvoice.gross_amount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Preview of new amounts */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Preview After Changes:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Gross Amount:</span>
                      <span className="font-medium">${Number(selectedInvoice.gross_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Discount:</span>
                      <span className="font-medium text-green-600">-${editFormData.discount_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tax:</span>
                      <span className="font-medium">${Number(selectedInvoice.tax_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="font-bold text-blue-900">New Net Amount:</span>
                      <span className="font-bold text-lg text-blue-900">
                        ${(Number(selectedInvoice.gross_amount) - editFormData.discount_amount + Number(selectedInvoice.tax_amount)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_description">Description</Label>
                  <Textarea
                    id="edit_description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    placeholder="Optional invoice description"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_remarks">Remarks</Label>
                  <Textarea
                    id="edit_remarks"
                    value={editFormData.remarks}
                    onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                    placeholder="Optional remarks or notes"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updateInvoiceMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateInvoice}
              disabled={updateInvoiceMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateInvoiceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Update Invoice
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Payment Modal */}
      <QuickPaymentModal
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        invoice={selectedInvoice}
      />
    </div>
  );
}
