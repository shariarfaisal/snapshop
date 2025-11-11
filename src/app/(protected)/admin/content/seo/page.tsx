'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminContentService } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SeoSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    metaTitleTemplate: '',
    metaDescription: '',
    metaKeywords: '',
    ogImageUrl: '',
  });

  const [twitterSettings, setTwitterSettings] = useState({
    card: '',
    creator: '',
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'content', 'seo'],
    queryFn: adminContentService.getSeoSettings,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        metaTitleTemplate: settings.metaTitleTemplate || '',
        metaDescription: settings.metaDescription || '',
        metaKeywords: settings.metaKeywords || '',
        ogImageUrl: settings.ogImageUrl || '',
      });

      if (settings.twitterCardSettings) {
        setTwitterSettings(settings.twitterCardSettings);
      }
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: adminContentService.updateSeoSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'seo'] });
      toast({
        title: 'Success',
        description: 'SEO settings updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      ...formData,
      twitterCardSettings: twitterSettings,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTwitterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setTwitterSettings(prev => ({ ...prev, [field]: e.target.value }));
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
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/content">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">SEO Settings</h1>
          <p className="text-gray-600">Optimize your site for search engines</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Meta Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Meta Tags</CardTitle>
            <CardDescription>Global meta tags for search engines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitleTemplate">Meta Title Template</Label>
              <Input
                id="metaTitleTemplate"
                name="metaTitleTemplate"
                value={formData.metaTitleTemplate}
                onChange={handleChange}
                placeholder="E-Campus | Page Title"
              />
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="Describe your website..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                placeholder="education, campus, learning, management system"
              />
            </div>
          </CardContent>
        </Card>

        {/* Open Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Open Graph (Social Media)</CardTitle>
            <CardDescription>Settings for sharing on social platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ogImageUrl">OG Image URL</Label>
              <Input
                id="ogImageUrl"
                name="ogImageUrl"
                value={formData.ogImageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Twitter Card */}
        <Card>
          <CardHeader>
            <CardTitle>Twitter Card Settings</CardTitle>
            <CardDescription>Configure how your content appears on Twitter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="card">Card Type</Label>
              <Input
                id="card"
                value={twitterSettings.card}
                onChange={(e) => handleTwitterChange(e, 'card')}
                placeholder="summary_large_image"
              />
            </div>

            <div>
              <Label htmlFor="creator">Creator Handle</Label>
              <Input
                id="creator"
                value={twitterSettings.creator}
                onChange={(e) => handleTwitterChange(e, 'creator')}
                placeholder="@yourhandle"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            size="lg"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
