import { Admission, AdmissionStatus, MeritCategory } from "@/types/admission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, CheckCircle2, XCircle, Send, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Application, ApplicationStatus } from "@/types/application";

interface AdmissionListProps {
  admissions: Application[];
  filters: {
    programId: string;
    campusId: string;
    meritCategory: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
  onView: (admission: Application) => void;
  onStatusChange: (admission: Application, status: string, notes?: string) => void;
}

const statusColors: Record<ApplicationStatus, string> = {
  Submitted: "bg-blue-100 text-blue-800",
  Shortlisted: "bg-purple-100 text-purple-800",
  Offered: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800",
  Accepted: "bg-green-100 text-green-800",
};

export function Applications({
  admissions,
  filters,
  onFilterChange,
  onView,
  onStatusChange,
}: AdmissionListProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };
  const maritCategories = ["xyz"]

  if (admissions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No applications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          value={filters.programId}
          onValueChange={(value) => handleFilterChange("programId", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Programs</SelectItem>
            {/* Add program options here */}
          </SelectContent>
        </Select>

        <Select
          value={filters.campusId}
          onValueChange={(value) => handleFilterChange("campusId", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Campus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Campuses</SelectItem>
            {/* Add campus options here */}
          </SelectContent>
        </Select>

        <Select
          value={filters.meritCategory}
          onValueChange={(value) => handleFilterChange("meritCategory", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {maritCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {Object.keys(statusColors).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admissions.map((admission) => (
              <TableRow key={admission.id}>
                <TableCell className="font-medium">{admission.first_name} {admission.last_name}</TableCell>
                <TableCell>{admission.applied_level}</TableCell>
                <TableCell>{admission.merit_cat_id}</TableCell>
                <TableCell>
                  <Badge className={statusColors[admission.status]}>
                    {admission.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(admission.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(admission)}
                      title="View Application"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {admission.status === "Submitted" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStatusChange(admission, "Shortlisted")}
                        title="Shortlist"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    {admission.status === "Shortlisted" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStatusChange(admission, "Offered")}
                        title="Offer Admission"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    {admission.status === "Offered" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStatusChange(admission, "Accepted")}
                        title="Mark as Accepted"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    )}
                    {admission.status !== "Rejected" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStatusChange(admission, "Rejected")}
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 