import { $clientPrivate } from "./client";

const MEDIA_API = {
  async uploadFile(file: File, onUploadProgress: (progress: number) => void) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await $clientPrivate.post<{
      message: string;
      fileUrl: string;
      fileType: string;
    }>("/media/upload", formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        onUploadProgress(progress);
      },
    });

    return data;
  },
};

export default MEDIA_API;
