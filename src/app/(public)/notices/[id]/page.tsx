"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import dynamic from "next/dynamic";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

interface Notice {
  id: number;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: string;
  publish_at: string;
  expire_at: string;
  created_at: string;
  updated_at: string;
  published_by: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export default function NoticeDetailPage() {
  const params = useParams();
  const noticeId = params.id;

  // This would need a dedicated endpoint for single notice
  // For now, we'll fetch from the list and find it
  const { data: noticesData, isLoading } = useQuery({
    queryKey: ["notice-detail", noticeId],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE}/api/public/notices?per_page=50`,
        {
          headers: { Accept: "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch notice");
      const json = await response.json();
      return json.data?.find((n: Notice) => n.id === parseInt(noticeId as string));
    },
  });

  const notice = noticesData as Notice | undefined;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const isExpiringSoon = (expireAt: string | null) => {
    if (!expireAt) return false;
    const expiryDate = new Date(expireAt);
    const daysUntilExpiry =
      (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading notice...</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button asChild variant="outline" className="mb-8">
            <Link href="/notices">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notices
            </Link>
          </Button>

          <Card className="border-0 shadow-lg">
            <CardContent className="py-16">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Notice not found
                </h3>
                <p className="text-gray-600 mb-6">
                  The notice you're looking for doesn't exist or has been removed.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/notices">View All Notices</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" className="text-white hover:bg-blue-600 mb-6">
            <Link href="/notices">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notices
            </Link>
          </Button>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                className={`${getPriorityColor(notice.priority)} border capitalize`}
              >
                {notice.priority}
              </Badge>
              {isExpiringSoon(notice.expire_at) && (
                <Badge variant="outline" className="border-red-300 text-red-200 bg-red-900/30">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Expiring Soon
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-3">{notice.title}</h1>

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(notice.publish_at), "MMMM dd, yyyy")}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  {notice.published_by.firstName} {notice.published_by.lastName}
                </span>
              </div>

              {notice.expire_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Expires: {format(new Date(notice.expire_at), "MMMM dd, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 md:p-12">
            {/* Publisher Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Published by
              </h3>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {notice.published_by.firstName} {notice.published_by.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{notice.published_by.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Published</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(notice.publish_at), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>

            {/* Notice Content */}
            <div className="prose prose-lg max-w-none">
              {typeof ReactMarkdown === 'function' && (
                <ReactMarkdown 
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-3 text-gray-800" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800" {...props} />,
                    p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-4 my-4 text-gray-700" {...props} />
                    ),
                    code: ({node, inline, ...props}) => 
                      inline ? (
                        <code className="bg-gray-100 text-red-600 px-2 py-1 rounded font-mono text-sm" {...props} />
                      ) : (
                        <code className="bg-gray-100 text-gray-900 p-4 rounded block font-mono text-sm overflow-x-auto mb-4" {...props} />
                      ),
                    a: ({node, ...props}) => (
                      <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
                    ),
                  }}
                >
                  {notice.content}
                </ReactMarkdown>
              )}
            </div>

            {/* Footer Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Priority Level</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {notice.priority}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Status</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {notice.status}
                  </p>
                </div>

                {notice.expire_at && (
                  <div>
                    <p className="text-gray-600 mb-1">Expires</p>
                    <p className="font-semibold text-gray-900">
                      {format(new Date(notice.expire_at), "MMM dd, yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/notices">View All Notices</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/contact">Contact Administration</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
