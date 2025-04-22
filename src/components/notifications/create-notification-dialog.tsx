import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification";
import { useToast } from "@/hooks/use-toast";
import type { NotificationType, NotificationChannel, NotificationTargetRole } from "@/types/notification";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Message body is required"),
  type: z.enum(["Announcement", "Alert"]),
  targetRoles: z.array(z.enum(["Student", "Teacher", "Guardian", "Staff"])),
  targetCampus: z.string().optional(),
  channels: z.array(z.enum(["Email", "SMS", "WhatsApp", "In-app"])),
  isScheduled: z.boolean(),
  scheduledAt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateNotificationDialog({
  open,
  onOpenChange,
}: CreateNotificationDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      type: "Announcement",
      targetRoles: [],
      channels: ["In-app"],
      isScheduled: false,
    },
  });

  const { mutate: createNotification, isPending } = useMutation({
    mutationFn: notificationService.createNotification,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createNotification({
      ...data,
      scheduledAt: data.isScheduled ? data.scheduledAt : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Notification</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter notification title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notification message"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Announcement">Announcement</SelectItem>
                      <SelectItem value="Alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetRoles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Roles</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {["Student", "Teacher", "Guardian", "Staff"].map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={field.value?.includes(role as NotificationTargetRole)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, role]);
                            } else {
                              field.onChange(
                                current.filter((r) => r !== role)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={role}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {role}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="channels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Channels</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {["Email", "SMS", "WhatsApp", "In-app"].map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox
                          id={channel}
                          checked={field.value?.includes(channel as NotificationChannel)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, channel]);
                            } else {
                              field.onChange(
                                current.filter((c) => c !== channel)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={channel}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {channel}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isScheduled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Schedule</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Send notification at a later time
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("isScheduled") && (
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Notification"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 