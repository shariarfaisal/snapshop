"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Archive,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Notice,
  CreateNoticeInput,
  NoticeStatus,
  NoticePriority,
  TargetRole,
} from "@/types/communications";
import { format } from "date-fns";
import {
  useNotices,
  useNotice,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
  usePublishNotice,
  useArchiveNotice,
} from "@/hooks/use-communications";
import { useSchoolClasses } from "@/hooks/use-school-classes";

export default function NoticesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<CreateNoticeInput>({
    title: "",
    content: "",
    target_roles: [],
    target_classes: [],
    priority: "normal",
    status: "draft",
  });

  // Build filters
  const noticeFilters = {
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? (statusFilter as NoticeStatus) : undefined,
    per_page: 15,
  };

  const classFilters = {
    status: true,
    perPage: 100,
  };

  // Hooks
  const { data: noticesData, isLoading: loading } = useNotices(noticeFilters, currentPage);
  const { data: selectedNotice } = useNotice(selectedNoticeId);
  const { data: classesData } = useSchoolClasses(classFilters);
  const createNoticeMutation = useCreateNotice();
  const updateNoticeMutation = useUpdateNotice();
  const deleteNoticeMutation = useDeleteNotice();
  const publishNoticeMutation = usePublishNotice();
  const archiveNoticeMutation = useArchiveNotice();

  // Derived data
  const notices = noticesData?.data || [];
  const totalPages = noticesData?.last_page || 1;
  const classes = classesData?.data || [];

  const handleCreate = () => {
    setFormData({
      title: "",
      content: "",
      target_roles: [],
      target_classes: [],
      priority: "normal",
      status: "draft",
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (notice: Notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
      target_roles: notice.target_roles || [],
      target_classes: notice.target_classes || [],
      priority: notice.priority,
      status: notice.status,
      publish_at: notice.publish_at,
      expire_at: notice.expire_at,
    });
    setSelectedNoticeId(notice.id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isEditing && selectedNoticeId) {
      updateNoticeMutation.mutate(
        { id: selectedNoticeId, data: formData },
        {
          onSuccess: () => {
            toast.success("Notice updated successfully");
            setIsDialogOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update notice");
          },
        }
      );
    } else {
      createNoticeMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Notice created successfully");
          setIsDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to create notice");
        },
      });
    }
  };

  const handleViewDetails = (notice: Notice) => {
    setSelectedNoticeId(notice.id);
    setIsDetailsDialogOpen(true);
  };

  const handlePublish = (id: number) => {
    publishNoticeMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Notice published successfully");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to publish");
      },
    });
  };

  const handleArchive = (id: number) => {
    archiveNoticeMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Notice archived successfully");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to archive");
      },
    });
  };

  const handleDelete = () => {
    if (!selectedNoticeId) return;

    deleteNoticeMutation.mutate(selectedNoticeId, {
      onSuccess: () => {
        toast.success("Notice deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedNoticeId(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete");
      },
    });
  };

  const getStatusBadge = (status: NoticeStatus) => {
    const variants: Record<NoticeStatus, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      published: "default",
      archived: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: NoticePriority) => {
    const colors: Record<NoticePriority, string> = {
      low: "text-gray-600",
      normal: "text-blue-600",
      high: "text-orange-600",
      urgent: "text-red-600",
    };
    return (
      <span className={`text-sm font-medium ${colors[priority]}`}>{priority.toUpperCase()}</span>
    );
  };

  const handleRoleToggle = (role: TargetRole) => {
    const roles = formData.target_roles || [];
    if (roles.includes(role)) {
      setFormData({ ...formData, target_roles: roles.filter((r) => r !== role) });
    } else {
      setFormData({ ...formData, target_roles: [...roles, role] });
    }
  };

  const handleClassToggle = (classId: number) => {
    const classIds = formData.target_classes || [];
    if (classIds.includes(classId)) {
      setFormData({ ...formData, target_classes: classIds.filter((id) => id !== classId) });
    } else {
      setFormData({ ...formData, target_classes: [...classIds, classId] });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notices</h1>
          <p className="text-muted-foreground mt-1">Manage notice board</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Notice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No notices found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Publish Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell className="font-medium">{notice.title}</TableCell>
                      <TableCell>{getPriorityBadge(notice.priority)}</TableCell>
                      <TableCell>{getStatusBadge(notice.status)}</TableCell>
                      <TableCell>
                        {notice.publish_at
                          ? format(new Date(notice.publish_at), "MMM dd, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(notice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(notice)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {notice.status === "draft" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePublish(notice.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {notice.status === "published" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleArchive(notice.id)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedNoticeId(notice.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Notice" : "Create Notice"}</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter notice title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter notice content"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v: NoticePriority) => setFormData({ ...formData, priority: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: NoticeStatus) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Target Roles</Label>
              <div className="flex flex-wrap gap-2">
                {(["all", "student", "parent", "teacher", "staff"] as TargetRole[]).map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={formData.target_roles?.includes(role) ? "default" : "outline"}
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
                    variant={formData.target_classes?.includes(cls.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleClassToggle(cls.id)}
                  >
                    {cls.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Input
                  type="datetime-local"
                  value={formData.publish_at || ""}
                  onChange={(e) => setFormData({ ...formData, publish_at: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expire Date</Label>
                <Input
                  type="datetime-local"
                  value={formData.expire_at || ""}
                  onChange={(e) => setFormData({ ...formData, expire_at: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={createNoticeMutation.isPending || updateNoticeMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createNoticeMutation.isPending || updateNoticeMutation.isPending}>
              {(createNoticeMutation.isPending || updateNoticeMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notice Details</DialogTitle>
          </DialogHeader>
          {selectedNotice && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <p className="text-sm mt-1">{selectedNotice.title}</p>
              </div>
              <div>
                <Label>Content</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{selectedNotice.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <p className="text-sm mt-1">{getPriorityBadge(selectedNotice.priority)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedNotice.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Publish Date</Label>
                  <p className="text-sm mt-1">
                    {selectedNotice.publish_at
                      ? format(new Date(selectedNotice.publish_at), "PPpp")
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <Label>Expire Date</Label>
                  <p className="text-sm mt-1">
                    {selectedNotice.expire_at
                      ? format(new Date(selectedNotice.expire_at), "PPpp")
                      : "No expiry"}
                  </p>
                </div>
              </div>
              {selectedNotice.target_roles && selectedNotice.target_roles.length > 0 && (
                <div>
                  <Label>Target Roles</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedNotice.target_roles.map((role) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteNoticeMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteNoticeMutation.isPending}>
              {deleteNoticeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
