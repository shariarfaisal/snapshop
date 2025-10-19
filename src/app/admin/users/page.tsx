"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UserTable } from "@/components/user/user-table";
import { AddUserDialog } from "@/components/user/add-user-dialog";

export default function UsersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <UserTable />
      
      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
} 