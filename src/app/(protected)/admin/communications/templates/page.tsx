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
} from "lucide-react";
import { toast } from "sonner";
import { MessageTemplate, CreateMessageTemplateInput, TemplateType } from "@/types/communications";
import { useMessageTemplates, useMessageTemplate, useCreateMessageTemplate, useUpdateMessageTemplate, useDeleteMessageTemplate } from "@/hooks/use-communications";

export default function TemplatesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<CreateMessageTemplateInput>({
    name: "",
    slug: "",
    type: "email",
    body: "",
    is_active: true,
  });

  // Hooks
  const { data: templatesData, isLoading: loading } = useMessageTemplates(
    {
      search: searchQuery || undefined,
      type: typeFilter !== "all" ? (typeFilter as TemplateType) : undefined,
      per_page: 15,
    },
    currentPage
  );

  const { data: selectedTemplate } = useMessageTemplate(isDetailsDialogOpen ? selectedTemplateId : null);
  const createTemplateMutation = useCreateMessageTemplate();
  const updateTemplateMutation = useUpdateMessageTemplate();
  const deleteTemplateMutation = useDeleteMessageTemplate();

  // Handle API response formats
  const templates = Array.isArray(templatesData) ? templatesData : (templatesData?.data || []);
  const totalPages = templatesData?.last_page || 1;

  const handleCreate = () => {
    setFormData({
      name: "",
      slug: "",
      type: "email",
      body: "",
      is_active: true,
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (template: MessageTemplate) => {
    setFormData({
      name: template.name,
      slug: template.slug,
      type: template.type,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
      is_active: template.is_active,
    });
    setSelectedTemplateId(template.id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.body.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isEditing && selectedTemplateId) {
      updateTemplateMutation.mutate(
        { id: selectedTemplateId, data: formData },
        {
          onSuccess: () => {
            toast.success("Template updated successfully");
            setIsDialogOpen(false);
            setIsEditing(false);
            setSelectedTemplateId(null);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update template");
          },
        }
      );
    } else {
      createTemplateMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Template created successfully");
          setIsDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to create template");
        },
      });
    }
  };

  const handleViewDetails = (template: MessageTemplate) => {
    setSelectedTemplateId(template.id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedTemplateId) return;

    deleteTemplateMutation.mutate(selectedTemplateId, {
      onSuccess: () => {
        toast.success("Template deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedTemplateId(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete template");
      },
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Message Templates</h1>
          <p className="text-muted-foreground mt-1">Manage reusable message templates</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No templates found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Variables</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.type}</Badge>
                      </TableCell>
                      <TableCell>
                        {template.variables && template.variables.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {template.variables.slice(0, 3).map((v, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {"{" + v + "}"}
                              </Badge>
                            ))}
                            {template.variables.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{template.variables.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedTemplateId(template.id);
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
            <DialogTitle>{isEditing ? "Edit Template" : "Create Template"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update template details" : "Create a reusable message template"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name *</Label>
              <Input
                id="templateName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Welcome Email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateSlug">Slug</Label>
              <Input
                id="templateSlug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="welcome-email (auto-generated if empty)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: TemplateType) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Only</SelectItem>
                    <SelectItem value="sms">SMS Only</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(v) => setFormData({ ...formData, is_active: v === "active" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(formData.type === "email" || formData.type === "both") && (
              <div className="space-y-2">
                <Label htmlFor="templateSubject">Email Subject</Label>
                <Input
                  id="templateSubject"
                  value={formData.subject || ""}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Use variables for dynamic content"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="templateBody">Message Body *</Label>
              <Textarea
                id="templateBody"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Use variables for dynamic content"
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                Available variables: name, email, and any custom variables you define
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
            >
              {(createTemplateMutation.isPending || updateTemplateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Details</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm mt-1">{selectedTemplate.name}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm mt-1">
                    <Badge variant="outline">{selectedTemplate.type}</Badge>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug</Label>
                  <p className="text-sm mt-1">{selectedTemplate.slug}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedTemplate.is_active ? "default" : "secondary"}>
                      {selectedTemplate.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              {selectedTemplate.subject && (
                <div>
                  <Label>Subject</Label>
                  <p className="text-sm mt-1">{selectedTemplate.subject}</p>
                </div>
              )}
              <div>
                <Label>Message Body</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap p-3 bg-gray-50 rounded">
                  {selectedTemplate.body}
                </p>
              </div>
              {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                <div>
                  <Label>Variables</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTemplate.variables.map((v, i) => (
                      <Badge key={i} variant="secondary">
                        {"{" + v + "}"}
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
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTemplate?.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTemplateMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteTemplateMutation.isPending}>
              {deleteTemplateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
