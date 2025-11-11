'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminContentService, SeoSettings } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SeoSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await adminContentService.getSeoSettings();
        setSettings(data);
      } catch (err) {
        setError('Failed to load SEO settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Settings</h1>
        <p className="text-gray-600">Manage search engine optimization settings and metadata</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>SEO Configuration</CardTitle>
          <CardDescription>Configure meta tags and SEO settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              SEO settings management interface coming soon.
            </p>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
