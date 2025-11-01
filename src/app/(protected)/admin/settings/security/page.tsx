"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SecuritySettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-gray-500 mt-1">Manage security and permission settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security & Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">Two-Factor Authentication</div>
              <p className="text-sm text-gray-600 mb-3">Add an extra layer of security</p>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-1">Session Management</div>
              <p className="text-sm text-gray-600 mb-3">Manage active sessions</p>
              <Button variant="outline" size="sm">
                View Sessions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
