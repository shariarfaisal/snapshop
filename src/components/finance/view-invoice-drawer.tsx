import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { financeService } from "@/services/finance";

interface ViewInvoiceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string | null;
}

export function ViewInvoiceDrawer({
  open,
  onOpenChange,
  invoiceId,
}: ViewInvoiceDrawerProps) {
  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => (invoiceId ? financeService.getInvoiceById(invoiceId) : null),
    enabled: !!invoiceId,
  });

  if (isLoading || !invoice) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Invoice Details</DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="h-[calc(100vh-200px)] p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Student
                </h3>
                <p className="text-lg">{invoice.studentName}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.rollNumber}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Program
                </h3>
                <p className="text-lg">{invoice.programName}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.campusName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Invoice #
                </h3>
                <p>{invoice.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Due Date
                </h3>
                <p>{format(new Date(invoice.dueDate), "PPP")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status
                </h3>
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
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.label}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </h3>
                <p className="text-lg">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(invoice.totalAmount)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Paid Amount
                </h3>
                <p className="text-lg">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(invoice.paidAmount)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Due Amount
                </h3>
                <p className="text-lg">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(invoice.dueAmount)}
                </p>
              </div>
            </div>

            {invoice.payments.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Payment History</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {format(new Date(payment.paymentDate), "PPP")}
                          </TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{payment.transactionReference}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(payment.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
} 