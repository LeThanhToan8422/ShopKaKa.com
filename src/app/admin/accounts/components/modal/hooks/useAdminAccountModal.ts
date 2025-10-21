"use client";

import { useState, useEffect, useCallback } from "react";
import { Form, App } from "antd";
import { AdminAccount, ModalValues } from "../../../types";
import useImageManagement from "./useImageManagement";
import useCloudinaryUpload from "./useCloudinaryUpload";
import useFormValidation from "./useFormValidation";
import { createPayload } from "../../../helpers";
import { MESSAGES } from "../../../constants";
import { saleAccountAPI } from "@/lib/api";

/**
 * Main hook for managing admin account modal functionality
 * Orchestrates image management, form validation, API submission, and Cloudinary upload
 * @param editing - Account being edited (null for create mode)
 * @param onSuccess - Callback function called after successful operation
 * @returns Object containing form instance, handlers, and state
 */
export default function useAdminAccountModal(
  editing: AdminAccount | null,
  onSuccess: () => void
) {
  // Form instance for modal form management
  const [formModal] = Form.useForm();

  // Loading state for submit operations
  const [loading, setLoading] = useState(false);

  // Hook for displaying notifications
  const { message } = App.useApp();

  // Custom hooks for specific functionality
  const imageManagement = useImageManagement();
  const cloudinaryUpload = useCloudinaryUpload();
  const formValidation = useFormValidation();

  /**
   * Auto-load data when editing changes
   * Populates form fields and loads existing images when editing an account
   */
  useEffect(() => {
    if (editing && formModal) {
      // Parse character skins first
      let characterSkins = [];
      if (editing.characterSkins) {
        try {
          const parsed =
            typeof editing.characterSkins === "string"
              ? JSON.parse(editing.characterSkins)
              : editing.characterSkins;

          if (Array.isArray(parsed) && parsed.length > 0) {
            characterSkins = parsed;
          }
        } catch (error) {
          console.error("Error parsing characterSkins:", error);
          characterSkins = [];
        }
      }

      // Load all fields at once to avoid multiple setFieldValue calls
      formModal.setFieldsValue({
        rank: editing.rank,
        price: editing.price,
        heroesCount: editing.heroesCount,
        skinsCount: editing.skinsCount,
        status: editing.status,
        description: editing.description,
        level: editing.level,
        matches: editing.matches,
        winRate: editing.winRate,
        reputation: editing.reputation,
        gameUsername: editing.gameUsername,
        gamePassword: editing.gamePassword,
        loginMethod: editing.loginMethod,
        additionalInfo: editing.additionalInfo,
        // Character skins
        characterSkins: characterSkins,
      });

      // Load images - for the new API, we'll use the images field directly
      if (editing.images && Array.isArray(editing.images)) {
        imageManagement.loadImages(editing.images, formModal);
      }
    } else if (!editing && formModal) {
      // Reset form for new account
      formModal.resetFields();
      imageManagement.clearImages();
    }
  }, [editing, formModal]);

  /**
   * Handle file upload from Upload component
   * Processes selected files and adds them to image management
   * @param file - File object from Upload component
   */
  const handleFileUpload = useCallback(
    ({ file }: { file: { originFileObj?: File } }) => {
      if (!file) return;
      imageManagement.addImage(file as File, formModal);
    },
    [imageManagement, formModal]
  );

  /**
   * Reset modal to initial state
   * Clears images and resets form fields
   */
  const resetModal = useCallback(() => {
    imageManagement.clearImages();
    formModal.resetFields();
  }, [imageManagement, formModal]);

  /**
   * Submit modal form with validation and API call
   * Handles image upload, payload creation, validation, and API submission
   * @param values - Form values from modal
   */
  const onSubmitModal = useCallback(
    async (values: ModalValues) => {
      try {
        setLoading(true);
        const loadingMessage = message.loading("Đang xử lý...", 0);

        // Upload new images to Cloudinary first
        let uploadedUrls: string[] = [];
        if (imageManagement.newFiles.length > 0) {
          const uploaded = await cloudinaryUpload.uploadFiles(
            imageManagement.newFiles
          );
          uploadedUrls = uploaded.map((u) => u.url);
        }

        // Get existing image URLs (non-blob URLs)
        const existingUrls = imageManagement.images
          .filter((img) => !img.isNew && !img.url.startsWith("blob:"))
          .map((img) => img.url);

        // Combine existing and new URLs
        const allImageUrls = [...existingUrls, ...uploadedUrls];

        // Create payload with proper image URLs
        // We need to create a payload that matches the SubmitPayload type
        const payload = {
          ...values,
          images: allImageUrls, // Use images array directly
          // Convert characterSkins to JSON string if it exists
          characterSkins: values.characterSkins ? JSON.stringify(values.characterSkins) : null
        };

        // Validate payload before submission
        if (!formValidation.validateForm(values).isValid) {
          loadingMessage();
          return;
        }

        // Submit to new API
        if (editing) {
          // Update existing account
          await saleAccountAPI.update(editing.id, payload);
        } else {
          // Create new account
          await saleAccountAPI.create(payload);
        }

        // Show success message and reset modal
        loadingMessage();
        message.success(
          editing
            ? MESSAGES.SUBMIT_SUCCESS_UPDATE
            : MESSAGES.SUBMIT_SUCCESS_CREATE
        );

        resetModal();
        onSuccess();
      } catch (error: any) {
        message.error(
          editing ? MESSAGES.SUBMIT_ERROR_UPDATE : MESSAGES.SUBMIT_ERROR_CREATE
        );
        console.error("Submit error:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      editing,
      imageManagement,
      cloudinaryUpload,
      formValidation,
      message,
      onSuccess,
      resetModal,
    ]
  );

  // Return object containing form instance, handlers, and state
  return {
    formModal, // Form instance for modal
    previewUrls: imageManagement.previewUrls, // URLs for image preview
    newFiles: imageManagement.newFiles, // New files to upload
    loading, // Loading state for submit button
    setCover: (url: string) => imageManagement.setCover(url, formModal), // Set cover image
    moveImage: (index: number, dir: -1 | 1) =>
      imageManagement.moveImage(index, dir, formModal), // Move image position
    removeImage: (url: string) => imageManagement.removeImage(url, formModal), // Remove image
    handleFileUpload, // Handle file upload
    onSubmitModal, // Submit form handler
    resetModal, // Reset modal handler
  };
}