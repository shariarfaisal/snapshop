"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Building, Users, Bell, Shield, Building2, Briefcase } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage system configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              <CardTitle>Institute Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Institute Name</Label>
              <Input defaultValue="Excellence School" />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" defaultValue="info@school.com" />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input defaultValue="+1234567890" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <CardTitle>Organization Structure</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/settings/departments">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Departments
              </Button>
            </Link>
            <Link href="/admin/settings/designations">
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="mr-2 h-4 w-4" />
                Manage Designations
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Roles & Permissions
            </Button>
          </CardContent>
        </Card>
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
          </div>
          <Button>Update Configuration</Button>
        </CardContent>
      </Card>
    </div>
  );
}
