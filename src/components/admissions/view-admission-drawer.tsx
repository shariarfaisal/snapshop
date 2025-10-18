"use client"

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Admission, AdmissionStatus } from "@/types/admission";
import { Application, ApplicationStatus } from "@/types/application";
import { format } from "date-fns";
import { Check, X, Clock } from "lucide-react";

interface ViewAdmissionDrawerProps {
  admission: Application;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onWaitlist?: () => void;
}

export function ViewAdmissionDrawer({
  admission,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onWaitlist,
}: ViewAdmissionDrawerProps) {
  
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-100 text-yellow-800";
      case "Shortlisted":
        return "bg-blue-100 text-blue-800";
      case "Offered":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Accepted":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Admission Details</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{admission.first_name} {admission.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{admission.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{admission.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {format(new Date(admission.date_of_birth), "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{admission.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Merit Category</p>
                  <p className="font-medium">{admission.merit_cat_id}</p>
                </div>
              </div>
            </div>

            {/* Program Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Program Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Program</p>
                  <p className="font-medium">{admission.applied_level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Campus</p>
                  <p className="font-medium">{admission.campus}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Date</p>
                  <p className="font-medium">
                    {format(new Date(admission.created_at), "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      admission.status
                    )}`}
                  >
                    {admission.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                {admission.documents.map((doc) => (
                  <div key={doc.id}>
                    <p className="text-sm text-muted-foreground">{doc.type}</p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6">
              {admission.status === "Submitted" && (
                <>
                  <Button
                    variant="outline"
                    onClick={onWaitlist}
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Shortlist
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={onReject}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={onApprove}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Offer
                  </Button>
                </>
              )}
              {admission.status === "Shortlisted" && (
                <>
                  <Button
                    variant="destructive"
                    onClick={onReject}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={onApprove}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Offer
                  </Button>
                </>
              )}
              {admission.status === "Offered" && (
                <Button
                  variant="destructive"
                  onClick={onReject}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
} 