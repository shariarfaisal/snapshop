'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminContentService } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function NavigationPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [mainNavLinks, setMainNavLinks] = useState<Array<{ href: string; label: string }>>([]);
  const [footerQuickLinks, setFooterQuickLinks] = useState<Array<{ href: string; label: string }>>([]);
  const [footerLegalLinks, setFooterLegalLinks] = useState<Array<{ href: string; label: string }>>([]);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'content', 'navigation'],
    queryFn: adminContentService.getNavigationSettings,
  });

  useEffect(() => {
    if (settings) {
      setMainNavLinks(settings.mainNavLinks || []);
      setFooterQuickLinks(settings.footerQuickLinks || []);
      setFooterLegalLinks(settings.footerLegalLinks || []);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: adminContentService.updateNavigationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'navigation'] });
      toast({
        title: 'Success',
        description: 'Navigation settings updated successfully',
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
      mainNavLinks,
      footerQuickLinks,
      footerLegalLinks,
    });
  };

  const addLink = (setter: any, links: any[]) => {
    setter([...links, { href: '', label: '' }]);
  };

  const removeLink = (setter: any, links: any[], index: number) => {
    setter(links.filter((_, i) => i !== index));
  };

  const updateLink = (setter: any, links: any[], index: number, field: string, value: string) => {
    const updated = [...links];
    updated[index][field] = value;
    setter(updated);
  };

  const renderLinks = (title: string, links: any[], setter: any) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Manage navigation links</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="flex-1">
              <Label className="text-sm">Label</Label>
              <Input
                value={link.label}
                onChange={(e) => updateLink(setter, links, index, 'label', e.target.value)}
                placeholder="Link label"
              />
            </div>
            <div className="flex-1">
              <Label className="text-sm">URL</Label>
              <Input
                value={link.href}
                onChange={(e) => updateLink(setter, links, index, 'href', e.target.value)}
                placeholder="/path"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeLink(setter, links, index)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addLink(setter, links)}
        >
          Add Link
        </Button>
      </CardContent>
    </Card>
  );

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
          <h1 className="text-3xl font-bold">Navigation Settings</h1>
          <p className="text-gray-600">Configure website navigation menus</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderLinks('Main Navigation Links', mainNavLinks, setMainNavLinks)}
        {renderLinks('Footer Quick Links', footerQuickLinks, setFooterQuickLinks)}
        {renderLinks('Footer Legal Links', footerLegalLinks, setFooterLegalLinks)}

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
