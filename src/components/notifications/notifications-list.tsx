import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Eye, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { notificationService } from "@/services/notification";
import type { Notification } from "@/types/notification";
import { useToast } from "@/hooks/use-toast";
import { ViewNotificationDialog } from "./view-notification-dialog";

export function NotificationsList() {
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    channel: "",
    status: "",
    search: "",
  });

  const { toast } = useToast();

  const {
    data: notifications,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => notificationService.getAllNotifications(filters),
  });

  const handleViewNotification = (notificationId: string) => {
    setSelectedNotification(notificationId);
    setIsViewDialogOpen(true);
  };

  const handleResendNotification = async (notificationId: string) => {
    try {
      await notificationService.resendNotification(notificationId);
      toast({
        title: "Success",
        description: "Notification has been resent successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend notification",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      toast({
        title: "Success",
        description: "Notification has been deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search notifications..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-xs"
        />

        <Select
          value={filters.role}
          onValueChange={(value) => setFilters({ ...filters, role: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Target Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Student">Students</SelectItem>
            <SelectItem value="Teacher">Teachers</SelectItem>
            <SelectItem value="Guardian">Guardians</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.channel}
          onValueChange={(value) => setFilters({ ...filters, channel: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="In-app">In-app</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Queued">Queued</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Target Roles</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications?.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="font-medium">{notification.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{notification.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {notification.targetRoles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {notification.channels.map((channel) => (
                      <Badge key={channel} variant="outline">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {notification.sentAt ? new Date(notification.sentAt).toLocaleString() : "-"}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewNotification(notification.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      {notification.status === "Failed" && (
                        <DropdownMenuItem onClick={() => handleResendNotification(notification.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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

      <ViewNotificationDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        notificationId={selectedNotification}
      />
    </div>
  );
}
