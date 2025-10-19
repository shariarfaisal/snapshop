"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { RoleTable } from "@/components/role/role-table";
import { AddRoleDialog } from "@/components/role/add-role-dialog";

export default function RolesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>
      
      <RoleTable />
      
      <AddRoleDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
} 