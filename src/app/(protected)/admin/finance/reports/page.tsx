"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Loader2, DollarSign, TrendingUp, FileCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { financeService } from "@/services/finance";
import { format } from "date-fns";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [invoiceStats, setInvoiceStats] = useState<any>(null);
  const [paymentStats, setPaymentStats] = useState<any>(null);
  
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("all");

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (dateFrom || dateTo || paymentMethod !== "all") {
      fetchPaymentStatistics();
    }
  }, [dateFrom, dateTo, paymentMethod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [invoiceData, paymentData] = await Promise.all([
        financeService.getInvoiceStatistics(),
        financeService.getPaymentStatistics(),
      ]);
      setInvoiceStats(invoiceData);
      setPaymentStats(paymentData);
    } catch (error: any) {
      toast.error("Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStatistics = async () => {
    try {
      const filters: any = {};
      if (dateFrom) filters.from_date = dateFrom;
      if (dateTo) filters.to_date = dateTo;
      if (paymentMethod !== "all") filters.payment_method = paymentMethod;
      
      const data = await financeService.getPaymentStatistics(filters);
      setPaymentStats(data);
    } catch (error: any) {
      toast.error("Failed to fetch payment statistics");
    }
  };

  const handleExport = () => {
    toast.info("Export functionality will be implemented soon");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground mt-1">View financial statistics and reports</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${invoiceStats?.total_amount?.toFixed(2) || "0.00"}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collected</p>
                <p className="text-2xl font-bold text-green-600">${invoiceStats?.paid_amount?.toFixed(2) || "0.00"}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">${invoiceStats?.due_amount?.toFixed(2) || "0.00"}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold">{invoiceStats?.collection_rate?.toFixed(1) || "0.0"}%</p>
              </div>
              <FileCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-semibold">{invoiceStats?.total_invoices || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold text-orange-600">{invoiceStats?.pending_invoices || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-semibold text-green-600">{invoiceStats?.paid_invoices || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-semibold text-red-600">{invoiceStats?.overdue_invoices || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
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
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Payments</p>
                  <p className="text-2xl font-bold">{paymentStats?.total_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">${paymentStats?.total_amount?.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Breakdown */}
      {paymentStats?.by_method && paymentStats.by_method.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentStats.by_method.map((method: any) => (
                  <TableRow key={method.payment_method}>
                    <TableCell className="font-medium">
                      {method.payment_method.replace("_", " ").toUpperCase()}
                    </TableCell>
                    <TableCell className="text-right">{method.count}</TableCell>
                    <TableCell className="text-right">${Number(method.total).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {paymentStats.total_amount > 0
                        ? ((Number(method.total) / paymentStats.total_amount) * 100).toFixed(1)
                        : "0.0"}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{paymentStats.total_count}</TableCell>
                  <TableCell className="text-right">${paymentStats.total_amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Outstanding Dues Alert */}
      {invoiceStats && invoiceStats.overdue_invoices > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900">Overdue Invoices Alert</h3>
                <p className="text-sm text-red-700 mt-1">
                  There are {invoiceStats.overdue_invoices} overdue invoices worth ${invoiceStats.due_amount?.toFixed(2) || "0.00"}.
                  Please follow up with the concerned students/guardians.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
