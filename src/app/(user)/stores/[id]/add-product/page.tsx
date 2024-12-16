"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function AddProduct() {
  const [files, setFiles] = useState<File[]>([]);

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Handle manual file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Remove a specific file
  const removeFile = (fileIndex: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== fileIndex));
  };

  // Handle upload
  const handleUpload = () => {
    // Process the files for uploading
    console.log("Files to upload:", files);
    alert("Files uploaded successfully!");
  };

  return (
    <div className="p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Upload Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 p-8 rounded-md text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p className="text-gray-500">Drag and drop files here</p>
            <p className="text-gray-500">or</p>
            <label className="cursor-pointer text-blue-600 underline">
              Browse files
              <Input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
                accept=".jpg,.png,.jpeg,.csv"
              />
            </label>
          </div>

          {/* Preview Uploaded Files */}
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Uploaded Files</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-3 rounded-md"
                  >
                    <span className="truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="w-full"
          >
            Upload Files
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
