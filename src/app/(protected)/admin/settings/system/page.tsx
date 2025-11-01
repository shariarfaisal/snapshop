"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SystemSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure system-wide settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Academic Year Start</Label>
              <Input type="date" />
            </div>
            <div className="grid gap-2">
              <Label>Default Language</Label>
              <Input defaultValue="English" />
            </div>
            <div className="grid gap-2">
              <Label>Timezone</Label>
              <Input defaultValue="UTC+0" />
            </div>
            <div className="grid gap-2">
              <Label>Date Format</Label>
              <Input defaultValue="DD/MM/YYYY" />
            </div>
          </div>
          <Button>Update Configuration</Button>
        </CardContent>
      </Card>
    </div>
  );
}
