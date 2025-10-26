"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";

export default function AccountantFeesPage() {
  const students = [
    { id: "1", name: "John Doe", class: "Grade 10-A", totalFees: 15000, paid: 10000, pending: 5000, status: "Partial" },
    { id: "2", name: "Jane Smith", class: "Grade 10-A", totalFees: 15000, paid: 15000, pending: 0, status: "Paid" },
    { id: "3", name: "Mike Johnson", class: "Grade 9-A", totalFees: 14000, paid: 0, pending: 14000, status: "Unpaid" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fee Collection</h1>
          <p className="text-gray-500 mt-1">Manage student fee payments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search students..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.class}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total: ${student.totalFees}</p>
                    <p className="text-sm text-green-600">Paid: ${student.paid}</p>
                    <p className="text-sm text-red-600">Pending: ${student.pending}</p>
                  </div>
                  <Badge className={
                    student.status === "Paid" ? "bg-green-100 text-green-800" :
                    student.status === "Partial" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }>
                    {student.status}
                  </Badge>
                  <Button size="sm">Collect</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
