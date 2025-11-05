"use client";

import { useState } from "react";
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
import { useCreateSection } from "@/hooks/use-sections";
import { useToast } from "@/hooks/use-toast";

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  onSuccess?: () => void;
}

export function AddSectionDialog({
  open,
  onOpenChange,
  classId,
  onSuccess,
}: AddSectionDialogProps) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState(true);
  const { toast } = useToast();
  const createMutation = useCreateSection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Section name is required",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(
      {
        schoolClassId: classId,
        name: name.trim(),
        maxCapacity: capacity ? parseInt(capacity) : 50,
        status,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Section created successfully",
          });
          setName("");
          setCapacity("");
          setStatus(true);
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to create section",
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
          <DialogTitle>Add Section to Class</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-name">Section Name</Label>
            <Input
              id="section-name"
              placeholder="e.g., Section A, Section B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={createMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (Optional)</Label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g., 50"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              disabled={createMutation.isPending}
              min="1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="status"
              checked={status}
              onCheckedChange={(checked) => setStatus(checked as boolean)}
              disabled={createMutation.isPending}
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
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Section
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
