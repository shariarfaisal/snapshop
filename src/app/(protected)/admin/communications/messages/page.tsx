"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Eye, Send, ChevronLeft, ChevronRight, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Message,
  MessageType,
  MessageStatus,
  TargetRole,
  CreateMessageInput,
  BulkMessageInput,
} from "@/types/communications";
import { format } from "date-fns";
import { useMessages, useMessage, useCreateMessage, useSendBulkMessages, useMessageTemplates } from "@/hooks/use-communications";
import { useSchoolClasses } from "@/hooks/use-school-classes";

export default function MessagesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateMessageInput>({
    type: "email",
    body: "",
  });

  const [bulkFormData, setBulkFormData] = useState<BulkMessageInput>({
    type: "email",
    body: "",
    target_roles: [],
  });

  // Hooks
  const { data: messagesData, isLoading: loading } = useMessages(
    {
      search: searchQuery || undefined,
      type: typeFilter !== "all" ? (typeFilter as MessageType) : undefined,
      status: statusFilter !== "all" ? (statusFilter as MessageStatus) : undefined,
      per_page: 15,
    },
    currentPage
  );

  const { data: selectedMessage } = useMessage(selectedMessageId);
  const { data: templatesData } = useMessageTemplates({ per_page: 100 }, 1);
  const { data: classesData } = useSchoolClasses({ per_page: 'all' });

  const createMessageMutation = useCreateMessage();
  const sendBulkMessagesMutation = useSendBulkMessages();

  // Handle API response formats
  const messages = Array.isArray(messagesData) ? messagesData : (messagesData?.data || []);
  const totalPages = messagesData?.last_page || 1;
  const templates = Array.isArray(templatesData) ? templatesData : (templatesData?.data || []);
  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || []);

  const handleCreate = () => {
    setFormData({ type: "email", body: "" });
    setIsDialogOpen(true);
  };

  const handleBulkOpen = () => {
    setBulkFormData({ type: "email", body: "", target_roles: [] });
    setIsBulkDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.body.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    createMessageMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Message sent successfully");
        setIsDialogOpen(false);
        setFormData({ type: "email", body: "" });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to send message");
      },
    });
  };

  const handleBulkSend = () => {
    if (
      !bulkFormData.body.trim() ||
      (!bulkFormData.target_roles?.length && !bulkFormData.target_classes?.length)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    sendBulkMessagesMutation.mutate(bulkFormData, {
      onSuccess: (result: any) => {
        toast.success(`Sent ${result.sent} messages successfully`);
        setIsBulkDialogOpen(false);
        setBulkFormData({ type: "email", body: "", target_roles: [] });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to send messages");
      },
    });
  };

  const handleViewDetails = (message: Message) => {
    setSelectedMessageId(message.id);
    setIsDetailsDialogOpen(true);
  };

  const getStatusBadge = (status: MessageStatus) => {
    const variants: Record<MessageStatus, string> = {
      queued: "bg-yellow-100 text-yellow-800",
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      bounced: "bg-gray-100 text-gray-800",
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const handleRoleToggle = (role: TargetRole) => {
    const roles = bulkFormData.target_roles || [];
    if (roles.includes(role)) {
      setBulkFormData({ ...bulkFormData, target_roles: roles.filter((r) => r !== role) });
    } else {
      setBulkFormData({ ...bulkFormData, target_roles: [...roles, role] });
    }
  };

  const handleClassToggle = (classId: number) => {
    const classIds = bulkFormData.target_classes || [];
    if (classIds.includes(classId)) {
      setBulkFormData({ ...bulkFormData, target_classes: classIds.filter((id) => id !== classId) });
    } else {
      setBulkFormData({ ...bulkFormData, target_classes: [...classIds, classId] });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">Send and manage messages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBulkOpen}>
            <Users className="mr-2 h-4 w-4" />
            Bulk Send
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No messages found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <Badge variant="outline">{message.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {message.recipient_email || message.recipient_phone || "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{message.subject || "-"}</TableCell>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell>
                        {message.sent_at
                          ? format(new Date(message.sent_at), "MMM dd, yyyy HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>Send a message to a specific recipient</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(v: MessageType) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.type === "email" && (
              <>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    value={formData.recipient_email || ""}
                    onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
                    placeholder="recipient@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={formData.subject || ""}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Message subject"
                  />
                </div>
              </>
            )}
            {formData.type === "sms" && (
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  value={formData.recipient_phone || ""}
                  onChange={(e) => setFormData({ ...formData, recipient_phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Message Body *</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Enter your message"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={createMessageMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createMessageMutation.isPending}>
              {createMessageMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Send Messages</DialogTitle>
            <DialogDescription>Send messages to multiple recipients</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message Type *</Label>
              <Select
                value={bulkFormData.type}
                onValueChange={(v: MessageType) => setBulkFormData({ ...bulkFormData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Roles *</Label>
              <div className="flex flex-wrap gap-2">
                {(["all", "student", "parent", "teacher", "staff"] as TargetRole[]).map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={bulkFormData.target_roles?.includes(role) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRoleToggle(role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Target Classes (Optional)</Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {classes.map((cls) => (
                  <Button
                    key={cls.id}
                    type="button"
                    variant={bulkFormData.target_classes?.includes(cls.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleClassToggle(cls.id)}
                  >
                    {cls.name}
                  </Button>
                ))}
              </div>
            </div>
            {bulkFormData.type === "email" && (
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={bulkFormData.subject || ""}
                  onChange={(e) => setBulkFormData({ ...bulkFormData, subject: e.target.value })}
                  placeholder="Message subject"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Message Body *</Label>
              <Textarea
                value={bulkFormData.body}
                onChange={(e) => setBulkFormData({ ...bulkFormData, body: e.target.value })}
                placeholder="Use {{name}} for recipient name"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDialogOpen(false)}
              disabled={sendBulkMessagesMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkSend} disabled={sendBulkMessagesMutation.isPending}>
              {sendBulkMessagesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Send to All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <p className="text-sm mt-1">
                    <Badge variant="outline">{selectedMessage.type}</Badge>
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedMessage.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Recipient</Label>
                  <p className="text-sm mt-1">
                    {selectedMessage.recipient_email || selectedMessage.recipient_phone || "-"}
                  </p>
                </div>
                <div>
                  <Label>Sent Date</Label>
                  <p className="text-sm mt-1">
                    {selectedMessage.sent_at
                      ? format(new Date(selectedMessage.sent_at), "PPpp")
                      : "Not sent yet"}
                  </p>
                </div>
              </div>
              {selectedMessage.subject && (
                <div>
                  <Label>Subject</Label>
                  <p className="text-sm mt-1">{selectedMessage.subject}</p>
                </div>
              )}
              <div>
                <Label>Message Body</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap p-3 bg-gray-50 rounded">
                  {selectedMessage.body}
                </p>
              </div>
              {selectedMessage.error_message && (
                <div>
                  <Label>Error Message</Label>
                  <p className="text-sm mt-1 text-red-600">{selectedMessage.error_message}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
