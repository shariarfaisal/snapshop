"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, FileText } from "lucide-react";

export default function AccountantDashboard() {
  const stats = [
    { title: "Total Revenue", value: "$125,450", change: "+8.3%", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Pending Payments", value: "$45,200", change: "-12%", icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Outstanding Fees", value: "245", change: "+5%", icon: Users, color: "text-red-600", bgColor: "bg-red-50" },
    { title: "Invoices Issued", value: "842", change: "+15%", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Accountant Dashboard</h1>
        <p className="text-gray-500 mt-1">Financial overview and pending tasks</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change} vs last month</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border-b">
                <div>
                  <p className="font-medium">Student Name {i}</p>
                  <p className="text-sm text-gray-500">Invoice #INV-2024-{i.toString().padStart(3, '0')}</p>
                </div>
                <span className="font-bold text-green-600">$1,250</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
