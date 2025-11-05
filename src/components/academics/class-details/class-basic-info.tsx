import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar } from "lucide-react";

interface SchoolClass {
  id: number;
  name: string;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface ClassBasicInfoCardProps {
  schoolClass: SchoolClass;
}

export function ClassBasicInfoCard({ schoolClass }: ClassBasicInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-50 p-2 rounded-lg mt-1">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600">Class Name</p>
            <p className="text-sm font-semibold mt-1">{schoolClass.name}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-purple-50 p-2 rounded-lg mt-1">
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600">Created On</p>
            <p className="text-sm font-semibold mt-1">
              {new Date(schoolClass.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {schoolClass.description && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-gray-600 mb-1">Description</p>
            <p className="text-sm text-gray-700">{schoolClass.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
