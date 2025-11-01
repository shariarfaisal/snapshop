"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useCommunicationStatistics, useNotices } from "@/hooks/use-communications";

export default function CommunicationsPage() {
  // Hooks
  const { data: stats, isLoading: statsLoading } = useCommunicationStatistics();
  const { data: noticesData, isLoading: noticesLoading } = useNotices(
    { status: "published", per_page: 5 },
    1
  );

  const recentNotices = noticesData?.data || [];
  const loading = statsLoading || noticesLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-gray-500 mt-1">Manage notices, messages, and notifications</p>
        </div>
        <Button asChild>
          <Link href="/admin/communications/notices">
            Manage Communications
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Total Notices</p>
            <p className="text-2xl font-bold">{stats?.total_notices || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Mail className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Messages Sent</p>
            <p className="text-2xl font-bold">{stats?.sent_messages || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-orange-600 mb-2" />
            <p className="text-sm text-gray-600">Total Messages</p>
            <p className="text-2xl font-bold">{stats?.total_messages || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Active Notices</p>
            <p className="text-2xl font-bold">{stats?.active_notices || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/communications/notices">
                <MessageSquare className="mr-2 h-4 w-4" />
                Manage Notices
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/communications/messages">
                <Mail className="mr-2 h-4 w-4" />
                Send Messages
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/communications/templates">
                <FileText className="mr-2 h-4 w-4" />
                Message Templates
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent notices</p>
            ) : (
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{notice.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {notice.publish_at ? format(new Date(notice.publish_at), "MMM dd, yyyy") : "-"}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/communications/notices`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
