'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminContentService, Faq } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FaqsPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await adminContentService.getFaqs();
        setFaqs(data.data || []);
      } catch (err) {
        setError('Failed to load FAQs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-gray-600">Manage frequently asked questions</p>
        </div>
        <Button onClick={() => router.push('/admin/settings/content/faqs/create')}>
          Add FAQ
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No FAQs found. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
                <CardDescription>{faq.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
