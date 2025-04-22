import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { financeService } from "@/services/finance";
import { useToast } from "@/hooks/use-toast";
import { ScholarshipDialog } from "./scholarship-dialog";

export function ScholarshipsList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scholarships, isLoading } = useQuery({
    queryKey: ["scholarships"],
    queryFn: () => financeService.getAllScholarships(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => financeService.deleteScholarship(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scholarships"] });
      toast({
        title: "Success",
        description: "Scholarship deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete scholarship",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (id: string) => {
    setSelectedScholarship(id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this scholarship?")) {
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
          Add Scholarship
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Awarded Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scholarships?.map((scholarship) => (
              <TableRow key={scholarship.id}>
                <TableCell className="font-medium">
                  {scholarship.studentName}
                  <p className="text-sm text-muted-foreground">
                    {scholarship.rollNumber}
                  </p>
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(scholarship.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{scholarship.type}</Badge>
                </TableCell>
                <TableCell>{scholarship.source}</TableCell>
                <TableCell>
                  {format(new Date(scholarship.awardedDate), "PPP")}
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
                        onClick={() => handleEdit(scholarship.id)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(scholarship.id)}
                      >
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

      <ScholarshipDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        scholarshipId={selectedScholarship}
        onSuccess={() => {
          setIsDialogOpen(false);
          setSelectedScholarship(null);
        }}
      />
    </div>
  );
} 