"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Applications } from "@/components/admissions/applications";
import { useToast } from "@/hooks";
import { Admission } from "@/types/admission";
import { ViewAdmissionDrawer } from "@/components/admissions/view-admission-drawer";
import Link from "next/link";
import { admissionService } from "@/services/admission";
import { Application } from "@/types/application";

export default function AdmissionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAdmission, setSelectedAdmission] = useState<Application | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    programId: "",
    campusId: "",
    meritCategory: "",
    status: "",
  });

  const { data: admissions, isLoading } = useQuery({
    queryKey: [admissionService.getAllApplications.name, filters],
    queryFn: () => admissionService.getAllApplications(filters),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      admissionService.updateApplication(id, { status: status as any, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  const handleView = (admission: Application) => {
    setSelectedAdmission(admission);
    setIsViewDrawerOpen(true);
  };

  const handleStatusChange = (admission: Application, status: string, notes?: string) => {
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this application?`)) {
      updateStatusMutation.mutate({ id: admission.id, status, notes });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admissions</h1>
        <Link href="/admin/admissions/new-application">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      <Applications
        admissions={admissions?.data || []}
        filters={filters}
        onFilterChange={setFilters}
        onView={handleView}
        onStatusChange={handleStatusChange}
      />

      {selectedAdmission && (
        <ViewAdmissionDrawer
          isOpen={isViewDrawerOpen}
          onClose={() => setIsViewDrawerOpen(false)}
          admission={selectedAdmission}
        />
      )}
    </div>
  );
} 