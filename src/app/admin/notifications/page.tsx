"use client"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { CreateNotificationDialog } from "@/components/notifications/create-notification-dialog";
import { useState } from "react";

export default function NotificationsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and send notifications to students, teachers, and staff
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Notification
        </Button>
      </div>

      <NotificationsList />

      <CreateNotificationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
} 