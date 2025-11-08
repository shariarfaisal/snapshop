"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/finance";
import { studentService } from "@/services/student";
import { academicYearService } from "@/services/api/academic-year";
import {
  StudentLedgerEntry,
  StudentLedgerFilters,
} from "@/types/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Search, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function StudentLedgerPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [filters, setFilters] = useState<StudentLedgerFilters>({
    academic_year_id: "all",
    from_date: "",
    to_date: "",
    entry_type: "all",
  });

  // Fetch students for selection
  const { data: studentsData } = useQuery({
    queryKey: ["students", "all"],
    queryFn: () => studentService.getAll({ per_page: "all" }),
  });

  // Fetch academic years
  const { data: academicYearsData } = useQuery({
    queryKey: ["academic-years"],
    queryFn: () => academicYearService.getAll(),
  });

  // Fetch ledger data
  const { data: ledgerData, isLoading, refetch } = useQuery({
    queryKey: ["student-ledger", selectedStudentId, filters],
    queryFn: () => {
      if (!selectedStudentId) return null;
      return financeService.getStudentLedger(selectedStudentId, filters);
    },
    enabled: !!selectedStudentId,
  });

  // Fetch student balance
  const { data: balanceData } = useQuery({
    queryKey: ["student-balance", selectedStudentId],
    queryFn: () => {
      if (!selectedStudentId) return null;
      return financeService.getStudentBalance(selectedStudentId);
    },
    enabled: !!selectedStudentId,
  });

  const selectedStudent = studentsData?.data?.find(
    (s: any) => s.id === selectedStudentId
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getPaymentModeLabel = (mode?: string) => {
    if (!mode) return "";
    return mode.replace("_", " ").toUpperCase();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Ledger</h1>
          <p className="text-muted-foreground">
            View complete transaction history and balance
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Student Selection */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">
                Select Student
              </label>
              <Select
                value={selectedStudentId?.toString() || ""}
                onValueChange={(value) => setSelectedStudentId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Search and select student..." />
                </SelectTrigger>
                <SelectContent>
                  {studentsData?.data?.map((student: any) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.user?.firstName} {student.user?.lastName} - {student.admissionNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Academic Year Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Academic Year
              </label>
              <Select
                value={filters.academic_year_id?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, academic_year_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {academicYearsData?.data?.map((year: any) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Date */}
            <div>
              <label className="text-sm font-medium mb-2 block">From Date</label>
              <Input
                type="date"
                value={filters.from_date || ""}
                onChange={(e) =>
                  setFilters({ ...filters, from_date: e.target.value })
                }
              />
            </div>

            {/* To Date */}
            <div>
              <label className="text-sm font-medium mb-2 block">To Date</label>
              <Input
                type="date"
                value={filters.to_date || ""}
                onChange={(e) =>
                  setFilters({ ...filters, to_date: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Info & Balance Summary */}
      {selectedStudent && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">
                    {selectedStudent.user?.firstName} {selectedStudent.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admission No</p>
                  <p className="font-semibold">{selectedStudent.admissionNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {balanceData?.balance ? formatCurrency(balanceData.balance) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Amount Due</p>
            </CardContent>
          </Card>

          {ledgerData?.summary && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Charges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(ledgerData.summary.total_debit)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Period Total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(ledgerData.summary.total_credit)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Period Total
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Ledger Table */}
      {selectedStudentId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ledger Entries</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading ledger...</div>
            ) : !ledgerData || ledgerData.entries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No ledger entries found for this student.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Payment Mode</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledgerData.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {format(new Date(entry.entry_date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{entry.description}</span>
                            {entry.entry_type && (
                              <Badge variant="outline" className="w-fit mt-1 text-xs">
                                {entry.entry_type}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {entry.fee_head?.name || "-"}
                        </TableCell>
                        <TableCell>
                          {entry.payment_mode ? (
                            <Badge variant="secondary">
                              {getPaymentModeLabel(entry.payment_mode)}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.debit_amount > 0
                            ? formatCurrency(entry.debit_amount)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {entry.credit_amount > 0
                            ? formatCurrency(entry.credit_amount)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(entry.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Summary Row */}
                {ledgerData?.summary && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-end gap-12 text-sm">
                      <div>
                        <p className="text-muted-foreground">Opening Balance</p>
                        <p className="font-bold">
                          {formatCurrency(ledgerData.summary.opening_balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Debit</p>
                        <p className="font-bold">
                          {formatCurrency(ledgerData.summary.total_debit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Credit</p>
                        <p className="font-bold text-green-600">
                          {formatCurrency(ledgerData.summary.total_credit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Closing Balance</p>
                        <p className="font-bold text-red-600">
                          {formatCurrency(ledgerData.summary.closing_balance)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedStudentId && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a student to view their ledger</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
