import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import { AttendanceStatistics } from "@/types/attendance";

interface StatisticsCardsProps {
  statistics: AttendanceStatistics;
  showPercentage?: boolean;
  className?: string;
}

/**
 * Reusable statistics cards component for attendance data
 * Displays key metrics in a grid of cards
 */
export function StatisticsCards({
  statistics,
  showPercentage = true,
  className = ""
}: StatisticsCardsProps) {
  // Calculate attendance percentage if needed
  const calculatePercentage = () => {
    if (!showPercentage) return null;

    const total = statistics.total || 0;
    if (total === 0) return "0.0";

    const attended = (statistics.present || 0) +
                     (statistics.late || 0) +
                     ((statistics.half_day || 0) * 0.5);
    return ((attended / total) * 100).toFixed(1);
  };

  const percentage = calculatePercentage();

  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Attendance Percentage (if enabled) */}
        {showPercentage && percentage !== null && (
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700 font-medium">
                Attendance %
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-900">{percentage}%</div>
                  <p className="text-xs text-blue-700 mt-1">of {statistics.total || 0} days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Present */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Present</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.present || 0}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Absent */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Absent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {statistics.absent || 0}
                </div>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        {/* Late */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Late</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {statistics.late || 0}
                </div>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        {/* Half Day */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Half Day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.half_day || 0}
                </div>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics Row */}
      <div className="grid gap-4 md:grid-cols-3 mt-4">
        {/* Sick Leave */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sick Leave</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.sick_leave || 0}
              </div>
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        {/* Other Leave */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Other Leave</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-600">
                {statistics.other_leave || 0}
              </div>
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        {/* Total Records */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {statistics.total || 0}
              </div>
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
