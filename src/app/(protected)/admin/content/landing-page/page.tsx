'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminContentService } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function LandingPageContentPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    heroHeading: '',
    heroSubheading: '',
    heroIcon: '',
    cta1Text: '',
    cta1Link: '',
    cta2Text: '',
    cta2Link: '',
    noticeSectionTitle: '',
    noticeSectionDescription: '',
    ctaSectionHeading: '',
    ctaSectionDescription: '',
    ctaSectionButtonText: '',
    ctaSectionButtonLink: '',
  });

  const [stats, setStats] = useState<Array<{ label: string; value: string }>>([]);
  const [features, setFeatures] = useState<Array<{ icon: string; title: string; description: string }>>([]);

  const { data: content, isLoading } = useQuery({
    queryKey: ['admin', 'content', 'landing-page'],
    queryFn: adminContentService.getLandingPageContent,
  });

  useEffect(() => {
    if (content) {
      setFormData({
        heroHeading: content.heroHeading || '',
        heroSubheading: content.heroSubheading || '',
        heroIcon: content.heroIcon || '',
        cta1Text: content.cta1Text || '',
        cta1Link: content.cta1Link || '',
        cta2Text: content.cta2Text || '',
        cta2Link: content.cta2Link || '',
        noticeSectionTitle: content.noticeSectionTitle || '',
        noticeSectionDescription: content.noticeSectionDescription || '',
        ctaSectionHeading: content.ctaSectionHeading || '',
        ctaSectionDescription: content.ctaSectionDescription || '',
        ctaSectionButtonText: content.ctaSectionButtonText || '',
        ctaSectionButtonLink: content.ctaSectionButtonLink || '',
      });
      setStats(content.stats || []);
      setFeatures(content.features || []);
    }
  }, [content]);

  const updateMutation = useMutation({
    mutationFn: adminContentService.updateLandingPageContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'landing-page'] });
      toast({
        title: 'Success',
        description: 'Landing page content updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update content',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      ...formData,
      stats,
      features,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Stats handlers
  const addStat = () => {
    setStats([...stats, { label: '', value: '' }]);
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  // Features handlers
  const addFeature = () => {
    setFeatures([...features, { icon: '', title: '', description: '' }]);
  };

  const updateFeature = (index: number, field: 'icon' | 'title' | 'description', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
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
          <h1 className="text-3xl font-bold">Landing Page Content</h1>
          <p className="text-gray-600">Customize your landing page</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main heading and call-to-action buttons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="heroHeading">Hero Heading</Label>
              <Input
                id="heroHeading"
                name="heroHeading"
                value={formData.heroHeading}
                onChange={handleChange}
                placeholder="Welcome to E-Campus"
              />
            </div>

            <div>
              <Label htmlFor="heroSubheading">Hero Subheading</Label>
              <Textarea
                id="heroSubheading"
                name="heroSubheading"
                value={formData.heroSubheading}
                onChange={handleChange}
                placeholder="Transform education with our comprehensive platform"
              />
            </div>

            <div>
              <Label htmlFor="heroIcon">Hero Icon</Label>
              <Input
                id="heroIcon"
                name="heroIcon"
                value={formData.heroIcon}
                onChange={handleChange}
                placeholder="graduation-cap"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cta1Text">CTA 1 Button Text</Label>
                <Input
                  id="cta1Text"
                  name="cta1Text"
                  value={formData.cta1Text}
                  onChange={handleChange}
                  placeholder="Get Started"
                />
              </div>
              <div>
                <Label htmlFor="cta1Link">CTA 1 Button Link</Label>
                <Input
                  id="cta1Link"
                  name="cta1Link"
                  value={formData.cta1Link}
                  onChange={handleChange}
                  placeholder="/admission/form"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cta2Text">CTA 2 Button Text</Label>
                <Input
                  id="cta2Text"
                  name="cta2Text"
                  value={formData.cta2Text}
                  onChange={handleChange}
                  placeholder="Learn More"
                />
              </div>
              <div>
                <Label htmlFor="cta2Link">CTA 2 Button Link</Label>
                <Input
                  id="cta2Link"
                  name="cta2Link"
                  value={formData.cta2Link}
                  onChange={handleChange}
                  placeholder="/about"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Display key metrics and numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex gap-2 items-end p-4 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`stat-value-${index}`}>Value</Label>
                  <Input
                    id={`stat-value-${index}`}
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    placeholder="2,500+"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`stat-label-${index}`}>Label</Label>
                  <Input
                    id={`stat-label-${index}`}
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    placeholder="Active Users"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeStat(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addStat}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Statistic
            </Button>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Highlight key features and benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`feature-icon-${index}`}>Icon</Label>
                    <Input
                      id={`feature-icon-${index}`}
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                      placeholder="Users"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`feature-title-${index}`}>Title</Label>
                    <Input
                      id={`feature-title-${index}`}
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      placeholder="Academic Management"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor={`feature-description-${index}`}>Description</Label>
                  <Textarea
                    id={`feature-description-${index}`}
                    value={feature.description}
                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                    placeholder="Complete management of classes, subjects, timetables..."
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addFeature}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </CardContent>
        </Card>

        {/* Notice Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notice Section</CardTitle>
            <CardDescription>Important announcements area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="noticeSectionTitle">Title</Label>
              <Input
                id="noticeSectionTitle"
                name="noticeSectionTitle"
                value={formData.noticeSectionTitle}
                onChange={handleChange}
                placeholder="Latest Notices"
              />
            </div>

            <div>
              <Label htmlFor="noticeSectionDescription">Description</Label>
              <Textarea
                id="noticeSectionDescription"
                name="noticeSectionDescription"
                value={formData.noticeSectionDescription}
                onChange={handleChange}
                placeholder="Stay updated with important announcements"
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Call-to-Action Section</CardTitle>
            <CardDescription>Main CTA for user engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ctaSectionHeading">Heading</Label>
              <Input
                id="ctaSectionHeading"
                name="ctaSectionHeading"
                value={formData.ctaSectionHeading}
                onChange={handleChange}
                placeholder="Ready to join us?"
              />
            </div>

            <div>
              <Label htmlFor="ctaSectionDescription">Description</Label>
              <Textarea
                id="ctaSectionDescription"
                name="ctaSectionDescription"
                value={formData.ctaSectionDescription}
                onChange={handleChange}
                placeholder="Join thousands of students learning with E-Campus"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ctaSectionButtonText">Button Text</Label>
                <Input
                  id="ctaSectionButtonText"
                  name="ctaSectionButtonText"
                  value={formData.ctaSectionButtonText}
                  onChange={handleChange}
                  placeholder="Apply Now"
                />
              </div>
              <div>
                <Label htmlFor="ctaSectionButtonLink">Button Link</Label>
                <Input
                  id="ctaSectionButtonLink"
                  name="ctaSectionButtonLink"
                  value={formData.ctaSectionButtonLink}
                  onChange={handleChange}
                  placeholder="/admission/form"
                />
              </div>
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
