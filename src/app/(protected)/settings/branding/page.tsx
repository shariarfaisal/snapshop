"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BrandingSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href="/admin/settings/branding">
          <Button className="w-full">Manage Branding</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
