"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InstituteSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Institute Information</CardTitle>
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
        <div className="grid gap-2">
          <Label>Address</Label>
          <Input defaultValue="123 Main Street, City" />
        </div>
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
