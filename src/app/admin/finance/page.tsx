"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeePlansList } from "@/components/finance/fee-plans-list";
import { FeePlanDialog } from "@/components/finance/fee-plan-dialog";
import { InvoicesList } from "@/components/finance/invoices-list";
import { ViewInvoiceDrawer } from "@/components/finance/view-invoice-drawer";
import { RecordPaymentDialog } from "@/components/finance/record-payment-dialog";
import { ScholarshipsList } from "@/components/finance/scholarships-list";
import { ScholarshipDialog } from "@/components/finance/scholarship-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FinancePage() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showFeePlanDialog, setShowFeePlanDialog] = useState(false);
  const [showScholarshipDialog, setShowScholarshipDialog] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Finance Management</h1>
      </div>

      <Tabs defaultValue="fee-plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fee-plans">Fee Plans</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
        </TabsList>

        <TabsContent value="fee-plans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fee Plans</CardTitle>
              <Button onClick={() => setShowFeePlanDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Fee Plan
              </Button>
            </CardHeader>
            <CardContent>
              <FeePlansList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoicesList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scholarships">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Scholarships</CardTitle>
              <Button onClick={() => setShowScholarshipDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Scholarship
              </Button>
            </CardHeader>
            <CardContent>
              <ScholarshipsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs and Drawers */}
      <FeePlanDialog
        open={showFeePlanDialog}
        onOpenChange={setShowFeePlanDialog}
      />

      <ViewInvoiceDrawer
        invoiceId={selectedInvoice}
        open={isViewDrawerOpen}
        onOpenChange={setIsViewDrawerOpen}
      />

      <RecordPaymentDialog
        invoiceId={selectedInvoice}
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
      />

      <ScholarshipDialog
        open={showScholarshipDialog}
        onOpenChange={setShowScholarshipDialog}
      />
    </div>
  );
} 