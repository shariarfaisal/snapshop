import { DockIcon, ImageIcon, Minus, VideoIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import MEDIA_API from "@/services/media";
import Image from "next/image";

interface UploadedFile {
  url: string;
  type: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const MediaUpload = ({
  error,
  index,
  setFileUrl,
  removeMedia,
}: {
  error?: string;
  index: number;
  setFileUrl: (fileUrl: string, fileType: string) => void;
  removeMedia: (index: number) => void;
}) => {
  const [file, setFile] = useState<File>();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>();
  const [progress, setProgress] = useState(0);
  const { mutate } = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async (file: File) => {
      const { fileUrl, fileType } = await MEDIA_API.uploadFile(
        file,
        (progress: number) => {
          setProgress(progress);
        }
      );
      setFileUrl(fileUrl, fileType);
      setUploadedFile({ url: fileUrl, type: fileType });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    const file = newFiles.pop();
    if (file) {
      mutate(file);
      setFile(file);
    }
  };

  // Handle manual file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const file = newFiles.pop();
    if (file) {
      mutate(file);
      setFile(file);
    }
  };

  return (
    <div>
      <div className="w-full flex items-center justify-between gap-3">
        {!file && (
          <div
            className="w-full border-2 border-dashed border-gray-300 p-8 rounded-md text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p className="text-gray-500">Drag and drop files here</p>
            <p className="text-gray-500">or</p>
            <label className="cursor-pointer text-blue-600 underline">
              Browse file
              <Input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple={false}
                accept=".jpg,.png,.jpeg,.mp4"
              />
            </label>
          </div>
        )}

        {file && (
          <div className="w-full flex gap-3 items-center border p-2 rounded-md">
            <div className="w-[100px] h-[100px]">
              {file.type.startsWith("image") ? (
                uploadedFile ? (
                  <div className="relative w-[100px] h-[100px]">
                    <Image
                      src={uploadedFile.url}
                      alt="Uploaded image"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <ImageIcon className="w-[100px] h-[100px]" />
                )
              ) : file.type.startsWith("video") ? (
                <VideoIcon className="w-[100px] h-[100px]" />
              ) : (
                <DockIcon className="w-[100px] h-[100px]" />
              )}
            </div>
            <div>
              <p className="text-sm w-full text-gray-600 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-400">
                {formatFileSize(file.size)}
              </p>
              <span className="text-xs text-gray-400">
                {progress === 100 ? "Uploaded" : `upload: ${progress}%`}
              </span>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          type="button"
          onClick={() => removeMedia(index)}
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MediaUpload;
