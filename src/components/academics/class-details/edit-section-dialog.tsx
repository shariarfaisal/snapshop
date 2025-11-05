"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useUpdateSection } from "@/hooks/use-sections";
import { useToast } from "@/hooks/use-toast";

interface Section {
  id: number;
  name: string;
  schoolClassId: number;
  maxCapacity: number;
  status: boolean;
}

interface EditSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  section: Section | null;
  onSuccess?: () => void;
}

export function EditSectionDialog({
  open,
  onOpenChange,
  classId,
  section,
  onSuccess,
}: EditSectionDialogProps) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState(true);
  const { toast } = useToast();
  const updateMutation = useUpdateSection();

  useEffect(() => {
    if (section) {
      setName(section.name);
      setCapacity(section.maxCapacity?.toString() || "");
      setStatus(section.status);
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!section) return;

    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Section name is required",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate(
      {
        id: section.id,
        data: {
          name: name.trim(),
          maxCapacity: capacity ? parseInt(capacity) : 50,
          status,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Section updated successfully",
          });
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to update section",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-name">Section Name</Label>
            <Input
              id="section-name"
              placeholder="e.g., Section A, Section B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updateMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g., 50"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              disabled={updateMutation.isPending}
              min="1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="status"
              checked={status}
              onCheckedChange={(checked) => setStatus(checked as boolean)}
              disabled={updateMutation.isPending}
            />
            <Label htmlFor="status" className="font-normal cursor-pointer">
              Active
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Section
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
