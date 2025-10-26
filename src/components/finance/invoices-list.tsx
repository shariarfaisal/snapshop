import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { financeService } from "@/services/finance";
import { programService } from "@/services/program";
import { campusService } from "@/services/campus";
import { ViewInvoiceDrawer } from "./view-invoice-drawer";
import { RecordPaymentDialog } from "./record-payment-dialog";

export function InvoicesList() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    student: "",
    status: "",
    campusId: "",
    programId: "",
    termId: "",
  });

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => financeService.getAllInvoices(filters),
  });

  const { data: programs } = useQuery({
    queryKey: ["programs"],
    queryFn: () => programService.getAllPrograms(),
  });

  const { data: campuses } = useQuery({
    queryKey: ["campuses"],
    queryFn: () => campusService.getAll(),
  });

  const { data: terms } = useQuery({
    queryKey: ["terms"],
    queryFn: () => {
      return [
        {
          id: "1",
          name: "xyz"
        }
      ]
    }
  });

  const handleView = (id: string) => {
    setSelectedInvoice(id);
    setIsViewDrawerOpen(true);
  };

  const handleRecordPayment = (id: string) => {
    setSelectedInvoice(id);
    setIsPaymentDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search by student name"
          value={filters.student}
          onChange={(e) =>
            setFilters({ ...filters, student: e.target.value })
          }
          className="max-w-xs"
        />

        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters({ ...filters, status: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.campusId}
          onValueChange={(value) =>
            setFilters({ ...filters, campusId: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Campus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {campuses?.data?.map((campus) => (
              <SelectItem key={campus.id} value={String(campus.id)}>
                {campus.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.programId}
          onValueChange={(value) =>
            setFilters({ ...filters, programId: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {programs?.map((program) => (
              <SelectItem key={program.id} value={String(program.id)}>
                {program.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.termId}
          onValueChange={(value) =>
            setFilters({ ...filters, termId: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {terms?.map((term) => (
              <SelectItem key={term.id} value={term.id}>
                {term.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  {invoice.studentName}
                </TableCell>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(invoice.totalAmount)}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(invoice.dueAmount)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === "Paid"
                        ? "default"
                        : invoice.status === "Overdue"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleView(invoice.id)}
                      >
                        View
                      </DropdownMenuItem>
                      {invoice.status !== "Paid" && (
                        <DropdownMenuItem
                          onClick={() => handleRecordPayment(invoice.id)}
                        >
                          Record Payment
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ViewInvoiceDrawer
        open={isViewDrawerOpen}
        onOpenChange={setIsViewDrawerOpen}
        invoiceId={selectedInvoice}
      />

      <RecordPaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        invoiceId={selectedInvoice}
      />
    </div>
  );
} 