"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Eye } from "lucide-react";

export default function ParentChildrenPage() {
  const children = [
    {
      id: "1",
      name: "John Doe",
      class: "Grade 10-A",
      regNo: "STU001",
      attendance: "95%",
      gpa: "3.9",
      pendingFees: "$1,250",
    },
    {
      id: "2",
      name: "Jane Doe",
      class: "Grade 8-B",
      regNo: "STU002",
      attendance: "92%",
      gpa: "3.7",
      pendingFees: "$0",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Children</h1>
        <p className="text-gray-500 mt-1">Monitor all your children's academic progress</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {children.map((child) => (
          <Card key={child.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle>{child.name}</CardTitle>
                    <p className="text-sm text-gray-500">{child.class} - {child.regNo}</p>
                  </div>
                </div>
                <Button>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Attendance</p>
                  <p className="text-xl font-bold">{child.attendance}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">GPA</p>
                  <p className="text-xl font-bold">{child.gpa}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Pending Fees</p>
                  <p className="text-xl font-bold text-red-600">{child.pendingFees}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
