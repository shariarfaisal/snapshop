"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, FileText, AlertCircle, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useInvoiceStatistics, usePayments } from "@/hooks/use-finance";

export default function FinancePage() {
  // Hooks
  const { data: stats, isLoading: statsLoading } = useInvoiceStatistics();
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments({ per_page: 5 }, 1);

  // Handle API response format
  const recentPayments = paymentsData?.data || [];
  const loading = statsLoading || paymentsLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finance Management</h1>
        <p className="text-gray-500 mt-1">Manage fees, payments, and financial reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold">${stats?.total_amount?.toFixed(2) || "0.00"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Pending Invoices</p>
            <p className="text-2xl font-bold">{stats?.pending_invoices || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
            <p className="text-sm text-gray-600">Collection Rate</p>
            <p className="text-2xl font-bold">{stats?.collection_rate?.toFixed(1) || "0.0"}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
            <p className="text-sm text-gray-600">Overdue Invoices</p>
            <p className="text-2xl font-bold">{stats?.overdue_invoices || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/finance/invoices">
                <FileText className="mr-2 h-4 w-4" />
                Manage Invoices
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/finance/payments">
                <DollarSign className="mr-2 h-4 w-4" />
                Record Payment
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/finance/reports">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/finance/fee-structure">
                <FileText className="mr-2 h-4 w-4" />
                Fee Structure
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/finance/student-ledger">
                <BookOpen className="mr-2 h-4 w-4" />
                Student Ledger
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent payments</p>
            ) : (
              <div className="space-y-3">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 border-b">
                    <div>
                      <p className="font-medium">{payment.student?.user?.name || payment.invoice?.student?.user?.name || "N/A"}</p>
                      <p className="text-sm text-gray-500">{payment.payment_number}</p>
                    </div>
                    <span className="font-bold text-green-600">${Number(payment.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {stats && stats.overdue_invoices > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900">Overdue Invoices Alert</h3>
                <p className="text-sm text-red-700 mt-1">
                  There are {stats.overdue_invoices} overdue invoices totaling ${stats.due_amount?.toFixed(2) || "0.00"}. 
                  Please follow up with the concerned students/guardians.
                </p>
                <Button variant="outline" className="mt-3" size="sm" asChild>
                  <Link href="/admin/finance/invoices">View Overdue Invoices</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
