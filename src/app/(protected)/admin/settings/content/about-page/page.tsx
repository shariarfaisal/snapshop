'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminContentService, AboutPageContent } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPageContentPage() {
  const router = useRouter();
  const [content, setContent] = useState<AboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await adminContentService.getAboutPageContent();
        setContent(data);
      } catch (err) {
        setError('Failed to load about page content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">About Page Content</h1>
        <p className="text-gray-600">Manage your website's about page content</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About Page Settings</CardTitle>
          <CardDescription>Edit the content displayed on your about page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              About page content management interface coming soon.
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
