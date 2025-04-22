import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { financeService } from "@/services/finance";
import { useToast } from "@/hooks/use-toast";
import { FeePlanDialog } from "./fee-plan-dialog";

export function FeePlansList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: feePlans, isLoading } = useQuery({
    queryKey: ["fee-plans"],
    queryFn: () => financeService.getAllFeePlans(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => financeService.deleteFeePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-plans"] });
      toast({
        title: "Success",
        description: "Fee plan deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete fee plan",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (id: string) => {
    setSelectedPlan(id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this fee plan?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Fee Plan
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Effective From</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feePlans?.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{plan.programName}</TableCell>
                <TableCell>
                  {new Date(plan.effectiveFrom).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{plan.items.length}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(plan.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(plan.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FeePlanDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        planId={selectedPlan}
        onSuccess={() => {
          setIsDialogOpen(false);
          setSelectedPlan(null);
        }}
      />
    </div>
  );
} 