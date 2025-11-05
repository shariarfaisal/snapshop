import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSchoolClassStats } from "@/hooks/use-school-classes";
import { Loader2, BookOpen, Users, Grid } from "lucide-react";

interface ClassStatsCardProps {
  classId: number;
}

export function ClassStatsCard({ classId }: ClassStatsCardProps) {
  const { data: statsData, isLoading } = useSchoolClassStats(classId);
  const stats = statsData?.data;

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-green-50 p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xs font-medium text-gray-600">Subjects</p>
              </div>
              <p className="text-2xl font-bold">{stats?.totalSubjects ?? 0}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Grid className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-gray-600">Sections</p>
              </div>
              <p className="text-2xl font-bold">{stats?.totalSections ?? 0}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-600">Students</p>
              </div>
              <p className="text-2xl font-bold">{stats?.totalStudents ?? 0}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-pink-50 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-pink-600" />
                </div>
                <p className="text-xs font-medium text-gray-600">Active Students</p>
              </div>
              <p className="text-2xl font-bold">{stats?.activeStudents ?? 0}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
