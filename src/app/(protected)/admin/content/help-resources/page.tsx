'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminContentService } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function HelpResourcesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    link: '',
    order: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: resourcesData, isLoading } = useQuery({
    queryKey: ['admin', 'content', 'help-resources'],
    queryFn: adminContentService.getHelpResources,
  });

  const resources = Array.isArray(resourcesData) ? resourcesData : (resourcesData?.data || []);

  const createMutation = useMutation({
    mutationFn: adminContentService.createHelpResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'help-resources'] });
      toast({
        title: 'Success',
        description: 'Help resource created successfully',
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create resource',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminContentService.updateHelpResource(editingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'help-resources'] });
      toast({
        title: 'Success',
        description: 'Help resource updated successfully',
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update resource',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminContentService.deleteHelpResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'help-resources'] });
      toast({
        title: 'Success',
        description: 'Help resource deleted successfully',
      });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete resource',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      link: '',
      order: 0,
    });
    setEditingId(null);
    setIsEditMode(false);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditClick = (resource: any) => {
    setFormData({
      title: resource.title,
      description: resource.description,
      icon: resource.icon,
      link: resource.link || '',
      order: resource.order,
    });
    setEditingId(resource.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (isEditMode && editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Help Resources</h1>
            <p className="text-gray-600">Manage help documentation and resources</p>
          </div>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Resource
        </Button>
      </div>

      {resources.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No help resources found. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource: any) => (
            <Card key={resource.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(resource)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteId(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">{resource.description}</p>
                {resource.link && (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Resource →
                  </a>
                )}
                <p className="text-xs text-gray-500">Order: {resource.order}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Resource' : 'Add Help Resource'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update the resource details below'
                : 'Create a new help resource or documentation link'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Getting Started"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this resource..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="help-circle"
              />
            </div>

            <div>
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com/help"
              />
            </div>

            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.title ||
                !formData.description ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Resource'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this help resource? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
