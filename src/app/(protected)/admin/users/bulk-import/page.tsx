"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { BulkUserImport } from "@/types/user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BulkImportPage() {
  const router = useRouter();
  const { bulkCreateUsers } = useUser();
  
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const downloadTemplate = () => {
    const template = "username,email,firstName,lastName,roleId,phone\nuser1,user1@example.com,John,Doe,2,9876543210";
    
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      if (row.username && row.email) {
        rows.push(row);
      }
    }

    return rows;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCsvData([]);
      setResult(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = parseCSV(text);
          if (parsed.length === 0) {
            toast.error("No valid data found in CSV file");
            return;
          }
          setCsvData(parsed);
        } catch (error: any) {
          toast.error(`Error parsing CSV: ${error.message}`);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (csvData.length === 0) {
      toast.error("No data to import");
      return;
    }

    setIsLoading(true);
    try {
      const usersToCreate: BulkUserImport[] = csvData.map(row => ({
        username: row.username,
        email: row.email,
        firstName: row.firstName || "",
        lastName: row.lastName || "",
        roleId: parseInt(row.roleId) || 3,
        phone: row.phone || "",
      }));

      const response = await bulkCreateUsers.mutateAsync(usersToCreate);
      
      setResult({
        success: response.success || 0,
        total: response.total || csvData.length,
        errors: response.errors || [],
      });

      if (response.errors?.length > 0) {
        toast.warning(`${response.success} users created, ${response.errors.length} failed`);
      } else {
        toast.success("All users imported successfully!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to import users");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Bulk Import Users</h1>
          <p className="text-muted-foreground mt-1">Import multiple users from a CSV file</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Import CSV File</CardTitle>
            <CardDescription>Upload a CSV file with user data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File *</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  required
                />
              </div>

              {csvData.length > 0 && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Preview</AlertTitle>
                  <AlertDescription className="text-sm mt-2">
                    {csvData.length} rows ready to import
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={isLoading || csvData.length === 0}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isLoading ? "Importing..." : "Import Users"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push("/admin/users")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Format</CardTitle>
            <CardDescription>Required columns for import</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded text-sm font-mono">
              <div className="text-muted-foreground mb-2">username,email,firstName,lastName,roleId,phone</div>
              <div className="text-xs">user1,user1@example.com,John,Doe,2,9876543210</div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Column Details:</p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li><strong>username</strong> - Unique username (required)</li>
                <li><strong>email</strong> - Valid email address (required)</li>
                <li><strong>firstName</strong> - User's first name</li>
                <li><strong>lastName</strong> - User's last name</li>
                <li><strong>roleId</strong> - Role ID (required)</li>
                <li><strong>phone</strong> - Phone number</li>
              </ul>
            </div>

            <Button 
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card className={result.errors?.length > 0 ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Import Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-green-600">{result.success}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{result.total}</p>
              </div>
            </div>

            {result.errors?.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium">Errors ({result.errors.length}):</p>
                <div className="max-h-60 overflow-y-auto space-y-1 text-sm">
                  {result.errors.map((error: any, idx: number) => (
                    <div key={idx} className="text-red-600">
                      Row {error.row}: {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={() => router.push("/admin/users")}
              className="w-full"
            >
              Back to Users
            </Button>
          </CardContent>
        </Card>
      )}

      {csvData.length > 0 && !result && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>First few rows of your CSV file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(csvData[0] || {}).map(key => (
                      <th key={key} className="text-left p-2 font-medium">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-b">
                      {Object.values(row).map((val: any, idx: number) => (
                        <td key={idx} className="p-2">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvData.length > 5 && (
                <p className="text-xs text-muted-foreground mt-2">
                  ... and {csvData.length - 5} more rows
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
