import { App } from "antd";
import { useCallback } from "react";
import { UploadResult } from "../../../types";
import { MESSAGES } from "../../../constants";
import { getCloudinaryUploadUrl } from "@/lib/cloudinaryConfig";

/**
 * Custom hook for handling direct Cloudinary image uploads
 * Manages file upload process with loading states and error handling
 * @returns Object containing upload function
 */
export default function useCloudinaryUpload() {
  // Hook for displaying notifications
  const { message } = App.useApp();

  /**
   * Upload multiple files directly to Cloudinary
   * @param fileList - Array of files to upload
   * @returns Promise resolving to array of upload results
   */
  const uploadFiles = useCallback(
    async (fileList: File[]): Promise<UploadResult[]> => {
      // Return empty array if no files
      if (!fileList.length) return [];

      try {
        // Show loading message
        const loadingMessage = message.loading(
          "Đang tải ảnh lên Cloudinary...",
          0
        );

        // Get Cloudinary config from environment variables
        const uploadUrl = getCloudinaryUploadUrl();
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        // Validate Cloudinary configuration
        if (!uploadPreset) {
          throw new Error("Cloudinary upload preset is not configured");
        }

        // Upload each file to Cloudinary
        const uploadPromises = fileList.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);
          formData.append("folder", "lq-shop");

          const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}`);
          }

          const data = await response.json();
          return {
            url: data.secure_url,
            name: data.original_filename,
          };
        });

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);

        // Hide loading message and show success
        loadingMessage();
        message.success(`${MESSAGES.UPLOAD_SUCCESS} ${fileList.length} ảnh`);

        // Return upload results
        return results;
      } catch (error: any) {
        // Show error message and re-throw error
        message.error(MESSAGES.UPLOAD_ERROR);
        console.error("Upload error:", error);
        throw error;
      }
    },
    [message]
  );

  // Return upload function
  return { uploadFiles };
}