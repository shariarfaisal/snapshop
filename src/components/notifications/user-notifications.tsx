import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { notificationService } from "@/services/notification";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export function UserNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: notificationService.getUserNotifications,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: notificationService.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 p-0">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h4 className="text-sm font-medium">Notifications</h4>
          <Link
            href="/notifications"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            View all
          </Link>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications?.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications?.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3"
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.preview}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Badge variant="secondary" className="h-4 w-4 p-0">
                      <Check className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {notification.notification.type}
                  </Badge>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 