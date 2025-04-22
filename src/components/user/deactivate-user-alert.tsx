"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/types/user";

interface DeactivateUserAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onConfirm: () => void;
}

export function DeactivateUserAlert({
  open,
  onOpenChange,
  user,
  onConfirm,
}: DeactivateUserAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to deactivate {user.name}? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 