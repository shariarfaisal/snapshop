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

export default function FaqsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order: 0,
    is_active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: faqsData, isLoading } = useQuery({
    queryKey: ['admin', 'content', 'faqs'],
    queryFn: async () => {
      const response = await adminContentService.getFaqs();
      return Array.isArray(response) ? response : (response?.data || []);
    },
  });

  const faqs = Array.isArray(faqsData) ? faqsData : (faqsData?.data || []);

  const createMutation = useMutation({
    mutationFn: adminContentService.createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'faqs'] });
      toast({
        title: 'Success',
        description: 'FAQ created successfully',
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create FAQ',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminContentService.updateFaq(editingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'faqs'] });
      toast({
        title: 'Success',
        description: 'FAQ updated successfully',
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update FAQ',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminContentService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'faqs'] });
      toast({
        title: 'Success',
        description: 'FAQ deleted successfully',
      });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete FAQ',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      order: 0,
      is_active: true,
    });
    setEditingId(null);
    setIsEditMode(false);
  };

  const handleOpenDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditClick = (faq: any) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      is_active: faq.is_active,
    });
    setEditingId(faq.id);
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
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
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
            <h1 className="text-3xl font-bold">FAQs</h1>
            <p className="text-gray-600">Manage frequently asked questions</p>
          </div>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No FAQs found. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq: any) => (
            <Card key={faq.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <CardDescription>{faq.category}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(faq)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteId(faq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{faq.answer}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>Order: {faq.order}</span>
                  <span>{faq.is_active ? '✓ Active' : '✗ Inactive'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update the FAQ details below'
                : 'Create a new frequently asked question'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="What is...?"
              />
            </div>

            <div>
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Provide a detailed answer..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Admission"
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

            <div className="flex items-center gap-2">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
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
                !formData.question ||
                !formData.answer ||
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
                'Save FAQ'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
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
