import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onApply: () => void;
  onClear: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
  className?: string;
}

/**
 * Reusable date range filter component
 * Provides date range selection with apply and clear functionality
 */
export function DateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onApply,
  onClear,
  title = "Filter by Date Range",
  description = "Select a date range to filter records",
  loading = false,
  className = ""
}: DateRangeFilterProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="from_date">From Date</Label>
            <Input
              id="from_date"
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="to_date">To Date</Label>
            <Input
              id="to_date"
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button
              onClick={onApply}
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply Filters"}
            </Button>
            <Button
              onClick={onClear}
              variant="outline"
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
