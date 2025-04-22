import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CampusTable } from "@/components/campus/campus-table";
import { AddCampusDialog } from "@/components/campus/add-campus-dialog";

export default function CampusesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campus Management</h1>
        <AddCampusDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Campus
          </Button>
        </AddCampusDialog>
      </div>
      <CampusTable />
    </div>
  );
} 