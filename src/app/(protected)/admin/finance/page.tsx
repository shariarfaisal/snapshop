"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Users, FileText } from "lucide-react";

export default function FinancePage() {
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
            <p className="text-2xl font-bold">$125,450</p>
            <p className="text-xs text-green-600 mt-1">+8.3% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Pending Invoices</p>
            <p className="text-2xl font-bold">245</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
            <p className="text-sm text-gray-600">Collection Rate</p>
            <p className="text-2xl font-bold">89.5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Users className="h-8 w-8 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Defaulters</p>
            <p className="text-2xl font-bold">42</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-medium">Student Name</p>
                    <p className="text-sm text-gray-500">INV-2024-{i.toString().padStart(3, '0')}</p>
                  </div>
                  <span className="font-bold text-green-600">$1,250</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
