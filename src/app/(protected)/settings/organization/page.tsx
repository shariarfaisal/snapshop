"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Briefcase } from "lucide-react";

export default function OrganizationSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Structure</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  );
}
