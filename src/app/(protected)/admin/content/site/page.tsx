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

export default function SiteSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'content', 'site-settings'],
    queryFn: adminContentService.getSiteSettings,
  });

  // Update form when data loads
  useEffect(() => {
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
        setOfficeHours(settings.officeHours);
      }
      
      if (settings.socialMedia) {
        setSocialMedia(settings.socialMedia);
      }
    }
  }, [settings]);

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOfficeHoursChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setOfficeHours(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setSocialMedia(prev => ({ ...prev, [field]: e.target.value }));
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
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-gray-600">Manage your site's basic information and branding</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Site name, tagline, and copyright</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                name="siteName"
                value={formData.siteName}
                onChange={handleFormChange}
                placeholder="E.g., E-Campus"
              />
            </div>

            <div>
              <Label htmlFor="siteTagline">Site Tagline</Label>
              <Input
                id="siteTagline"
                name="siteTagline"
                value={formData.siteTagline}
                onChange={handleFormChange}
                placeholder="E.g., Transforming Education Through Technology"
              />
            </div>

            <div>
              <Label htmlFor="copyrightText">Copyright Text</Label>
              <Input
                id="copyrightText"
                name="copyrightText"
                value={formData.copyrightText}
                onChange={handleFormChange}
                placeholder="E.g., © 2024 E-Campus. All rights reserved."
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Colors and visual identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={handleFormChange}
                  />
                  <Input
                    type="text"
                    value={formData.primaryColor}
                    onChange={handleFormChange}
                    name="primaryColor"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    name="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={handleFormChange}
                  />
                  <Input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={handleFormChange}
                    name="secondaryColor"
                    className="flex-1"
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
            <CardDescription>Email, phone, and location details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleFormChange}
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleFormChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <Label htmlFor="physicalAddress">Physical Address</Label>
              <Textarea
                id="physicalAddress"
                name="physicalAddress"
                value={formData.physicalAddress}
                onChange={handleFormChange}
                placeholder="123 Education Street, Learning City, LC 12345"
              />
            </div>

            <div>
              <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
              <Input
                id="googleMapsUrl"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleFormChange}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Office Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Office Hours</CardTitle>
            <CardDescription>Operational hours for each day type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="weekdays">Weekdays (Mon-Fri)</Label>
              <Input
                id="weekdays"
                value={officeHours.weekdays}
                onChange={(e) => handleOfficeHoursChange(e, 'weekdays')}
                placeholder="9:00 AM - 6:00 PM"
              />
            </div>

            <div>
              <Label htmlFor="saturday">Saturday</Label>
              <Input
                id="saturday"
                value={officeHours.saturday}
                onChange={(e) => handleOfficeHoursChange(e, 'saturday')}
                placeholder="10:00 AM - 2:00 PM"
              />
            </div>

            <div>
              <Label htmlFor="sunday">Sunday</Label>
              <Input
                id="sunday"
                value={officeHours.sunday}
                onChange={(e) => handleOfficeHoursChange(e, 'sunday')}
                placeholder="Closed"
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
                onChange={(e) => handleSocialMediaChange(e, 'facebook')}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={socialMedia.twitter}
                onChange={(e) => handleSocialMediaChange(e, 'twitter')}
                placeholder="https://twitter.com/..."
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={socialMedia.linkedin}
                onChange={(e) => handleSocialMediaChange(e, 'linkedin')}
                placeholder="https://linkedin.com/..."
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
