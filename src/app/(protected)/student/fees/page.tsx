"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CreditCard } from "lucide-react";

export default function StudentFeesPage() {
  const fees = [
    { month: "January 2025", amount: 1250, status: "Paid", date: "2025-01-05" },
    { month: "February 2025", amount: 1250, status: "Paid", date: "2025-02-03" },
    { month: "March 2025", amount: 1250, status: "Pending", date: "-" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fee Status</h1>
        <p className="text-gray-500 mt-1">View and manage your fee payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Fees</p>
            <p className="text-2xl font-bold">$15,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-2xl font-bold text-green-600">$2,500</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-red-600">$1,250</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fees.map((fee, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{fee.month}</p>
                  <p className="text-sm text-gray-500">{fee.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">${fee.amount}</p>
                  <Badge className={fee.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {fee.status}
                  </Badge>
                  {fee.status === "Paid" ? (
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
