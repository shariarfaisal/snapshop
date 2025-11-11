'use client';

import { useState } from 'react';
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

export default function SiteSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'content', 'site-settings'],
    queryFn: adminContentService.getSiteSettings,
  });

  const [formData, setFormData] = useState({
    siteName: '',
    siteTagline: '',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    contactEmail: '',
    contactPhone: '',
    physicalAddress: '',
    googleMapsUrl: '',
    copyrightText: '',
  });

  const [officeHours, setOfficeHours] = useState({
    weekdays: '',
    saturday: '',
    sunday: '',
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
  });

  // Update form when data loads
  useState(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || '',
        siteTagline: settings.siteTagline || '',
        primaryColor: settings.primaryColor || '#2563eb',
        secondaryColor: settings.secondaryColor || '#1e40af',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        physicalAddress: settings.physicalAddress || '',
        googleMapsUrl: settings.googleMapsUrl || '',
        copyrightText: settings.copyrightText || '',
      });
      
      if (settings.officeHours) {
        setOfficeHours({
          weekdays: settings.officeHours.weekdays || '',
          saturday: settings.officeHours.saturday || '',
          sunday: settings.officeHours.sunday || '',
        });
      }
      
      if (settings.socialMedia) {
        setSocialMedia({
          facebook: settings.socialMedia.facebook || '',
          twitter: settings.socialMedia.twitter || '',
          linkedin: settings.socialMedia.linkedin || '',
        });
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: adminContentService.updateSiteSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'site-settings'] });
      toast({
        title: 'Success',
        description: 'Site settings updated successfully',
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
      officeHours,
      socialMedia,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/settings/content"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Content Management
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your site-wide settings, branding, and contact information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic site information and branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name *</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                placeholder="E-Campus"
                required
              />
            </div>

            <div>
              <Label htmlFor="siteTagline">Site Tagline</Label>
              <Input
                id="siteTagline"
                value={formData.siteTagline}
                onChange={(e) => setFormData({ ...formData, siteTagline: e.target.value })}
                placeholder="Transforming Education Through Technology"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#2563eb"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    placeholder="#1e40af"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How users can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="support@ecampus.com"
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <Label htmlFor="physicalAddress">Physical Address</Label>
              <Textarea
                id="physicalAddress"
                value={formData.physicalAddress}
                onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                placeholder="123 Education Street, Learning City, LC 12345"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="googleMapsUrl">Google Maps Embed URL</Label>
              <Input
                id="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Office Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Office Hours</CardTitle>
            <CardDescription>Your operating hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="weekdays">Weekdays</Label>
              <Input
                id="weekdays"
                value={officeHours.weekdays}
                onChange={(e) => setOfficeHours({ ...officeHours, weekdays: e.target.value })}
                placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
              />
            </div>

            <div>
              <Label htmlFor="saturday">Saturday</Label>
              <Input
                id="saturday"
                value={officeHours.saturday}
                onChange={(e) => setOfficeHours({ ...officeHours, saturday: e.target.value })}
                placeholder="Saturday: 10:00 AM - 2:00 PM"
              />
            </div>

            <div>
              <Label htmlFor="sunday">Sunday</Label>
              <Input
                id="sunday"
                value={officeHours.sunday}
                onChange={(e) => setOfficeHours({ ...officeHours, sunday: e.target.value })}
                placeholder="Sunday: Closed"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={socialMedia.facebook}
                onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                placeholder="https://facebook.com/ecampus"
              />
            </div>

            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={socialMedia.twitter}
                onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                placeholder="https://twitter.com/ecampus"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={socialMedia.linkedin}
                onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/ecampus"
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Settings</CardTitle>
            <CardDescription>Copyright and legal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="copyrightText">Copyright Text</Label>
              <Input
                id="copyrightText"
                value={formData.copyrightText}
                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                placeholder="© 2024 E-Campus. All rights reserved."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
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
