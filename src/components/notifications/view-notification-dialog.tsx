import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationService } from "@/services/notification";
import type { NotificationDetails } from "@/types/notification";

interface ViewNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notificationId: string | null;
}

export function ViewNotificationDialog({
  open,
  onOpenChange,
  notificationId,
}: ViewNotificationDialogProps) {
  const { data: notification, isLoading } = useQuery({
    queryKey: ["notification", notificationId],
    queryFn: () => notificationService.getNotificationById(notificationId!),
    enabled: !!notificationId,
  });

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!notification) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Notification Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{notification.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{notification.type}</Badge>
                <Badge
                  variant={
                    notification.status === "Sent"
                      ? "default"
                      : notification.status === "Failed"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {notification.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Message</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {notification.body}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Target Audience</h4>
              <div className="flex flex-wrap gap-2">
                {notification.targetRoles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))}
              </div>
              {notification.targetCampus && (
                <p className="text-sm text-muted-foreground">
                  Campus: {notification.targetCampus}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Delivery Channels</h4>
              <div className="flex flex-wrap gap-2">
                {notification.channels.map((channel) => (
                  <Badge key={channel} variant="outline">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Delivery Statistics</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Recipients</span>
                  <span className="text-sm">{notification.totalRecipients}</span>
                </div>
                {notification.deliveryStats.map((stat) => (
                  <div key={stat.channel} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stat.channel}</span>
                      <span className="text-sm">
                        {stat.sent} / {stat.total}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${(stat.sent / stat.total) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sent: {stat.sent}</span>
                      <span>Failed: {stat.failed}</span>
                      <span>Pending: {stat.pending}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Timing</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                {notification.scheduledAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Scheduled</span>
                    <span>
                      {new Date(notification.scheduledAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {notification.sentAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sent</span>
                    <span>
                      {new Date(notification.sentAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Created By</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{notification.createdBy.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{notification.createdBy.email}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 