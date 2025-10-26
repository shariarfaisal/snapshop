"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Mail, Bell } from "lucide-react";

export default function CommunicationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Communications</h1>
          <p className="text-gray-500 mt-1">Manage notices, messages, and notifications</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />New Notice</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Total Notices</p>
            <p className="text-2xl font-bold">48</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Mail className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Messages Sent</p>
            <p className="text-2xl font-bold">1,245</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Bell className="h-8 w-8 text-orange-600 mb-2" />
            <p className="text-sm text-gray-600">Active Alerts</p>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Notice Title {i}</h3>
                    <p className="text-sm text-gray-500 mt-1">Published 2 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
