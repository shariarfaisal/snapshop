'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminContentService, HelpResource } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelpResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<HelpResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await adminContentService.getHelpResources();
        setResources(data);
      } catch (err) {
        setError('Failed to load help resources');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Help Resources</h1>
          <p className="text-gray-600">Manage help resources and documentation</p>
        </div>
        <Button onClick={() => router.push('/admin/settings/content/help-resources/create')}>
          Add Resource
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {resources.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No help resources found. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription>{resource.icon}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{resource.description}</p>
                {resource.link && (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    View Resource
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
