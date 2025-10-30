"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye, Trash2, ChevronLeft, ChevronRight, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { financeService } from "@/services/finance";
import { studentService } from "@/services/student";
import { schoolClassService } from "@/services/schoolClass";
import { Invoice, CreateInvoiceInput, InvoiceStatus } from "@/types/finance";
import { format } from "date-fns";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [students, setStudents] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateInvoiceInput>({
    student_id: 0,
    due_date: "",
  });

  const [bulkFormData, setBulkFormData] = useState({
    class_id: 0,
    fee_structure_id: 0,
    due_date: "",
  });

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [studentsData, structuresData, classesData] = await Promise.all([
        studentService.getAll({ per_page: 100 }, 1),
        financeService.getAllFeeStructures({ per_page: 100 }, 1),
        schoolClassService.getAll(),
      ]);
      setStudents(studentsData.data || []);
      setFeeStructures(structuresData.data || []);
      setClasses(classesData.data || []);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await financeService.getAllInvoices(
        {
          search: searchQuery || undefined,
          status: statusFilter !== "all" ? (statusFilter as InvoiceStatus) : undefined,
          per_page: 15,
        },
        currentPage
      );
      setInvoices(data.data);
      setTotalPages(data.last_page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({ student_id: 0, due_date: "" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.student_id || !formData.due_date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await financeService.createInvoice(formData);
      toast.success("Invoice created successfully");
      setIsDialogOpen(false);
      fetchInvoices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (!bulkFormData.class_id || !bulkFormData.fee_structure_id || !bulkFormData.due_date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const result = await financeService.bulkGenerateInvoices(bulkFormData);
      toast.success(`Generated ${result.length} invoices successfully`);
      setIsBulkDialogOpen(false);
      fetchInvoices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = async (invoice: Invoice) => {
    try {
      const details = await financeService.getInvoiceById(invoice.id);
      setSelectedInvoice(details);
      setIsDetailsDialogOpen(true);
    } catch (error: any) {
      toast.error("Failed to load details");
    }
  };

  const handleDelete = async () => {
    if (!selectedInvoice) return;

    try {
      setSubmitting(true);
      await financeService.deleteInvoice(selectedInvoice.id);
      toast.success("Invoice deleted successfully");
      setDeleteDialogOpen(false);
      fetchInvoices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setSubmitting(false);
    }
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
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{invoice.student?.user?.name || "-"}</TableCell>
                      <TableCell>{format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(new Date(invoice.due_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-right">${Number(invoice.net_amount).toFixed(2)}</TableCell>
                      <TableCell className="text-right">${Number(invoice.paid_amount).toFixed(2)}</TableCell>
                      <TableCell className="text-right">${Number(invoice.due_amount).toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.user?.name || s.id}
                    </SelectItem>
                  ))}
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
            <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleBulkGenerate} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                  <p className="text-sm mt-1">{selectedInvoice.student?.user?.name || "-"}</p>
                </div>
                <div>
                  <Label>Class</Label>
                  <p className="text-sm mt-1">{selectedInvoice.fee_structure?.school_class?.name || "-"}</p>
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
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
