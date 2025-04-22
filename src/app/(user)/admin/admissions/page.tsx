"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdmissionList } from "../../../../components/admissions/admission-list";
import { useToast } from "@/hooks";
import { admissionService } from "@/services/admission";
import { Admission } from "@/types/admission";
import { AddAdmissionDialog } from "@/components/admissions/add-admission-dialog";
import { ViewAdmissionDrawer } from "@/components/admissions/view-admission-drawer";

export default function AdmissionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    programId: "",
    campusId: "",
    meritCategory: "",
    status: "",
  });

  const { data: admissions, isLoading } = useQuery({
    queryKey: ["admissions", filters],
    queryFn: () => admissionService.getAll(),
  });

  const createAdmissionMutation = useMutation({
    mutationFn: admissionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      toast({
        title: "Success",
        description: "Application created successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create application",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      admissionService.updateStatus(id, { status: status as any, notes }),
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

  const handleView = (admission: Admission) => {
    setSelectedAdmission(admission);
    setIsViewDrawerOpen(true);
  };

  const handleStatusChange = (admission: Admission, status: string, notes?: string) => {
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
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Manual Application
        </Button>
      </div>

      <AdmissionList
        admissions={admissions || []}
        filters={filters}
        onFilterChange={setFilters}
        onView={handleView}
        onStatusChange={handleStatusChange}
      />

      <AddAdmissionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => createAdmissionMutation.mutate(data)}
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