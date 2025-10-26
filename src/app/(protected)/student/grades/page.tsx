"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentGradesPage() {
  const grades = [
    { subject: "Mathematics", midTerm: "A+", final: "A", overall: "A" },
    { subject: "English", midTerm: "A", final: "A-", overall: "A" },
    { subject: "Science", midTerm: "B+", final: "A-", overall: "A-" },
    { subject: "History", midTerm: "A-", final: "B+", overall: "A-" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Grades</h1>
        <p className="text-gray-500 mt-1">View your academic performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Year 2024-2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Subject</th>
                  <th className="text-center p-3">Mid-Term</th>
                  <th className="text-center p-3">Final</th>
                  <th className="text-center p-3">Overall Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3 font-medium">{grade.subject}</td>
                    <td className="p-3 text-center">
                      <Badge className="bg-blue-100 text-blue-800">{grade.midTerm}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-blue-100 text-blue-800">{grade.final}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className="bg-green-100 text-green-800 font-bold">{grade.overall}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
