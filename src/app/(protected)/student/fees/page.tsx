"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, CreditCard, DollarSign, AlertCircle, Clock, CheckCircle, Loader2, FileText } from "lucide-react";
import { useStudentInvoices, useStudentOutstandingDues } from "@/hooks/use-finance";
import { format } from "date-fns";
import { InvoiceStatus } from "@/types/finance";

// TODO: Replace with actual student ID from auth context
const TEMP_STUDENT_ID = 1;

const getStatusBadge = (status: InvoiceStatus) => {
  const config = {
    paid: { variant: "default" as const, icon: CheckCircle, className: "bg-green-100 text-green-800" },
    pending: { variant: "secondary" as const, icon: Clock, className: "bg-yellow-100 text-yellow-800" },
    partially_paid: { variant: "outline" as const, icon: Clock, className: "bg-blue-100 text-blue-800" },
    overdue: { variant: "destructive" as const, icon: AlertCircle, className: "bg-red-100 text-red-800" },
    cancelled: { variant: "secondary" as const, icon: AlertCircle, className: "bg-gray-100 text-gray-800" },
  };

  const { icon: Icon, className } = config[status] || config.pending;

  return (
    <Badge className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {status.replace("_", " ").toUpperCase()}
    </Badge>
  );
};

export default function StudentFeesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch student data
  const { data: invoices, isLoading: invoicesLoading } = useStudentInvoices(TEMP_STUDENT_ID);
  const { data: outstandingDues, isLoading: duesLoading } = useStudentOutstandingDues(TEMP_STUDENT_ID);

  const loading = invoicesLoading || duesLoading;

  // Filter invoices
  const filteredInvoices = statusFilter === "all"
    ? invoices
    : invoices?.filter(inv => inv.status === statusFilter);

  // Calculate totals from actual data
  const totalFees = invoices?.reduce((sum, inv) => sum + Number(inv.net_amount), 0) || 0;
  const totalPaid = invoices?.reduce((sum, inv) => sum + Number(inv.paid_amount), 0) || 0;
  const totalDue = outstandingDues?.total_due || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fee Status</h1>
        <p className="text-gray-500 mt-1">View and manage your fee payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold">${totalFees.toFixed(2)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-red-600">${totalDue.toFixed(2)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Alert */}
      {outstandingDues && outstandingDues.overdue_count > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900">Overdue Payment Alert</h3>
                <p className="text-sm text-red-700 mt-1">
                  You have {outstandingDues.overdue_count} overdue invoice(s) with total amount of ${outstandingDues.total_overdue.toFixed(2)}.
                  Please make payment as soon as possible to avoid penalties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoices</CardTitle>
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
          {!filteredInvoices || filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No invoices found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => {
                const isOverdue = invoice.status === 'overdue';
                const isPending = invoice.status === 'pending' || invoice.status === 'partially_paid';

                return (
                  <div
                    key={invoice.id}
                    className={`p-4 border rounded-lg ${isOverdue ? 'border-red-300 bg-red-50' : 'hover:bg-gray-50'} transition`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold">{invoice.invoice_number}</p>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Invoice Date</p>
                            <p className="font-medium">{format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                              {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Amount</p>
                            <p className="font-bold">${Number(invoice.net_amount).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due Amount</p>
                            <p className={`font-bold ${isPending ? 'text-red-600' : 'text-green-600'}`}>
                              ${Number(invoice.due_amount).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="ghost" size="sm" title="Download Invoice">
                          <Download className="h-4 w-4" />
                        </Button>
                        {isPending && (
                          <Button size="sm">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Payment History */}
                    {invoice.payments && invoice.payments.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Payment History</p>
                        <div className="space-y-1">
                          {invoice.payments.map((payment) => (
                            <div key={payment.id} className="flex justify-between text-xs text-gray-600">
                              <span>{format(new Date(payment.payment_date), "MMM dd, yyyy")} - {payment.payment_method}</span>
                              <span className="font-semibold text-green-600">${Number(payment.amount).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
