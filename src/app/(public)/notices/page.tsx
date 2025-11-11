"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, AlertCircle, Loader2, ChevronRight } from "lucide-react";
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
  published_by: {
    firstName: string;
    lastName: string;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Fetch notices
  const { data: noticesData, isLoading } = useQuery({
    queryKey: ["public-notices", searchQuery, sortBy, priorityFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("per_page", "50");
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`${API_BASE}/api/public/notices?${params.toString()}`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch notices");
      const json = await response.json();
      return json.data || [];
    },
  });

  // Process and filter notices
  const processedNotices = useMemo(() => {
    let notices = noticesData || [];

    // Filter by priority
    if (priorityFilter !== "all") {
      notices = notices.filter((n: Notice) => n.priority === priorityFilter);
    }

    // Sort
    if (sortBy === "latest") {
      notices = [...notices].sort(
        (a: Notice, b: Notice) =>
          new Date(b.publish_at).getTime() - new Date(a.publish_at).getTime()
      );
    } else if (sortBy === "oldest") {
      notices = [...notices].sort(
        (a: Notice, b: Notice) =>
          new Date(a.publish_at).getTime() - new Date(b.publish_at).getTime()
      );
    } else if (sortBy === "expiring") {
      notices = [...notices]
        .filter((n: Notice) => n.expire_at)
        .sort(
          (a: Notice, b: Notice) =>
            new Date(a.expire_at).getTime() - new Date(b.expire_at).getTime()
        );
    }

    return notices;
  }, [noticesData, priorityFilter, sortBy]);

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

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent" || priority === "high") {
      return <AlertCircle className="w-4 h-4" />;
    }
    return null;
  };

  const isExpiringSoon = (expireAt: string) => {
    if (!expireAt) return false;
    const expiryDate = new Date(expireAt);
    const daysUntilExpiry = (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Notices</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Stay updated with the latest announcements and important information
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4 flex items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search notices by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-2 h-auto"
                />
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="expiring">Expiring Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notices List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading notices...</p>
            </div>
          </div>
        ) : processedNotices.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchQuery ? "No notices found" : "No notices available"}
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? "Try adjusting your search terms" : "Check back later for updates"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {processedNotices.map((notice: Notice) => (
              <Card
                key={notice.id}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-blue-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left Section - Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with Priority and Expiry */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge
                          className={`${getPriorityColor(
                            notice.priority
                          )} border flex items-center gap-1`}
                        >
                          {getPriorityIcon(notice.priority)}
                          <span className="capitalize">{notice.priority}</span>
                        </Badge>

                        {isExpiringSoon(notice.expire_at) && (
                          <Badge variant="outline" className="border-red-300 text-red-700">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Expiring Soon
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {notice.title}
                      </h3>

                      {/* Content Preview */}
                      <div className="text-gray-600 mb-4 line-clamp-2 prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p className="text-gray-600 line-clamp-2" {...props} />
                            ),
                            h1: ({ node, ...props }) => null,
                            h2: ({ node, ...props }) => null,
                            h3: ({ node, ...props }) => null,
                            ul: ({ node, ...props }) => null,
                            ol: ({ node, ...props }) => null,
                            table: ({ node, ...props }) => null,
                            img: ({ node, ...props }) => null,
                          }}
                        >
                          {notice.content}
                        </ReactMarkdown>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(notice.publish_at), "MMM dd, yyyy")}</span>
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
                              Expires: {format(new Date(notice.expire_at), "MMM dd, yyyy")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Action Button */}
                    <div className="flex-shrink-0 md:ml-4">
                      <Button
                        asChild
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Link href={`/notices/${notice.id}`}>
                          Read More
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Statistics */}
        {!isLoading && processedNotices.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Showing {processedNotices.length} notice
              {processedNotices.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
