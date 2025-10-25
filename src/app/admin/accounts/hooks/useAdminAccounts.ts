"use client";

import { useEffect, useState } from "react";
import { Form, App } from "antd";
import { AdminAccount } from "../types";
import { saleAccountAPI } from "@/lib/api";
import { Account } from "@/app/types";

/**
 * Custom hook for managing admin accounts page functionality
 * Handles data fetching, pagination, search, modal operations, and CRUD operations
 * @returns Object containing state, handlers, and form instance
 */
export default function useAdminAccounts() {
  const [form] = Form.useForm();

  // Data state
  const [data, setData] = useState<AdminAccount[]>([]); // List of accounts
  const [total, setTotal] = useState(0); // Total number of accounts
  const [page, setPage] = useState(1); // Current page number
  const [pageSize, setPageSize] = useState(10); // Number of items per page
  const [loading, setLoading] = useState(false); // Loading state for data fetching

  // Modal state
  const [modalOpen, setModalOpen] = useState(false); // Whether modal is open
  const [editing, setEditing] = useState<AdminAccount | null>(null); // Account being edited
  const [detailLoading, setDetailLoading] = useState(false); // Loading state for fetching account details

  // Thêm state cho modal mode
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  // Hooks for displaying notifications and confirmation modals
  const { message, modal } = App.useApp();

  /**
   * Fetch accounts data from API
   * Builds query parameters from form values and fetches paginated data
   */
  const fetchData = async () => {
    setLoading(true);

    try {
      // Get form values for filtering
      const formValues = form.getFieldsValue();
      
      // Build API parameters
      const apiParams: any = {
        page: page - 1, // Convert to 0-based indexing
        size: pageSize
      };
      
      // Add filter parameters if they exist
      if (formValues.rank) {
        apiParams.rank = formValues.rank;
      }
      
      if (formValues.minPrice !== undefined && formValues.minPrice !== null) {
        apiParams.minPrice = formValues.minPrice;
      }
      
      if (formValues.maxPrice !== undefined && formValues.maxPrice !== null) {
        apiParams.maxPrice = formValues.maxPrice;
      }
      
      if (formValues.minHeroes !== undefined && formValues.minHeroes !== null) {
        apiParams.minHeroes = formValues.minHeroes;
      }
      
      if (formValues.minSkins !== undefined && formValues.minSkins !== null) {
        apiParams.minSkins = formValues.minSkins;
      }
      
      if (formValues.q) {
        apiParams.q = formValues.q;
      }

      // Fetch data from new API with all parameters
      const response = await saleAccountAPI.getAll(apiParams);
      
      // Extract content array from the response data
      const accounts = response.data?.content || [];
      setData(accounts);
      // Set total from pagination info
      setTotal(response.data?.totalElements || accounts.length);
    } catch (error: any) {
      console.error("Fetch data error:", error);
      message.error("Lỗi khi tải dữ liệu");
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect to fetch data when page or pageSize changes
   * Automatically refetches data when pagination changes
   */
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  /**
   * Handle search form submission
   * Resets to first page and fetches data with new search criteria
   */
  const onSearch = (values?: any) => {
    setPage(1); // Reset to first page
    fetchData(); // Fetch data with new search criteria
  };

  /**
   * Fetch detailed account data by ID and map it to AdminAccount format
   * @param id - Account ID to fetch
   * @returns Detailed account data in AdminAccount format
   */
  const fetchAccountDetail = async (id: string) => {
    try {
      setDetailLoading(true);
      const response = await saleAccountAPI.getById(id);
      
      // Map API response to AdminAccount format
      const accountData = response.data?.item || response.data;
      if (!accountData) {
        throw new Error("Invalid response format");
      }
      
      // Map character skins to the expected format
      const mappedCharacterSkins = accountData.characterSkins?.map((skin: any) => ({
        id: skin.id,
        character: skin.character,
        skin: skin.skin,
        rarity: skin.rarity,
        avatar: skin.avatar,
        background: skin.background
      })) || [];
      
      const mappedAccount: AdminAccount = {
        id: accountData.id,
        rank: accountData.rank,
        price: accountData.price,
        heroesCount: accountData.heroesCount,
        skinsCount: accountData.skinsCount,
        status: accountData.status,
        description: accountData.description || undefined,
        images: accountData.images || [],
        createdAt: accountData.createdAt || accountData.createAt,
        updatedAt: accountData.updatedAt || accountData.updateAt || "",
        level: accountData.level,
        matches: accountData.matches,
        winRate: accountData.winRate,
        reputation: accountData.reputation,
        characterSkins: mappedCharacterSkins,
        gameUsername: accountData.gameUsername || undefined,
        gamePassword: accountData.gamePassword || undefined,
        loginMethod: accountData.loginMethod || undefined,
        additionalInfo: accountData.additionalInfo || undefined
      };
      
      return mappedAccount;
    } catch (error) {
      console.error("Fetch account detail error:", error);
      message.error("Lỗi khi tải chi tiết tài khoản");
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  /**
   * Open modal for creating new account
   * Resets editing state and opens modal
   */
  const openCreate = () => {
    setEditing(null); // No account being edited
    setModalMode("create"); // Set modal mode to create
    setModalOpen(true); // Open modal
  };

  /**
   * Open modal for editing existing account
   * Fetches detailed account data and opens modal
   * @param record - Account to edit
   */
  const openEdit = async (record: AdminAccount) => {
    setModalMode("edit"); // Set modal mode to edit
    const detailedAccount = await fetchAccountDetail(record.id);
    if (detailedAccount) {
      setEditing(detailedAccount); // Set detailed account data
      setModalOpen(true); // Open modal
    }
  };

  /**
   * Open modal for viewing existing account
   * Fetches detailed account data and opens modal
   * @param record - Account to view
   */
  const openView = async (record: AdminAccount) => {
    setModalMode("view"); // Set modal mode to view
    const detailedAccount = await fetchAccountDetail(record.id);
    if (detailedAccount) {
      setEditing(detailedAccount); // Set detailed account data
      setModalOpen(true); // Open modal
    }
  };

  /**
   * Close modal and reset editing state
   * Clears editing state and closes modal
   */
  const closeModal = () => {
    setModalOpen(false); // Close modal
    setEditing(null); // Clear editing state
  };

  /**
   * Handle account deletion with confirmation
   * Shows confirmation modal before deleting account
   * @param record - Account to delete
   */
  const handleDelete = async (record: AdminAccount) => {
    modal.confirm({
      title: "Xác nhận xóa tài khoản",
      content: `Bạn có chắc chắn muốn xóa tài khoản ${
        record.rank || "N/A"
      } - ${new Intl.NumberFormat("vi-VN").format(record.price)} ₫?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          // Show loading message
          const loadingMessage = message.loading("Đang xóa tài khoản...", 0);

          // Send DELETE request to new API
          await saleAccountAPI.delete(record.id);

          // Hide loading message and show success
          loadingMessage();
          message.success("Xóa tài khoản thành công");

          // Refresh data list
          onSearch();
        } catch (error: any) {
          // Show error message
          message.error("Xóa tài khoản thất bại");
          console.error("Delete error:", error);
        }
      },
    });
  };

  /**
   * Handle modal success callback
   * Closes modal and refreshes data after successful operation
   */
  const onModalSuccess = () => {
    closeModal(); // Close modal
    onSearch(); // Refresh data
  };

  // Return object containing state, handlers, and form instance
  return {
    // Form and data
    form, // Form instance for search
    data, // List of accounts
    total, // Total number of accounts
    page, // Current page number
    pageSize, // Items per page
    loading, // Loading state for data fetching
    detailLoading, // Loading state for fetching account details

    // Pagination handlers
    setPage, // Set current page
    setPageSize, // Set items per page

    // Search and filter
    onSearch, // Handle search form submission

    // Modal state and handlers
    modalOpen, // Whether modal is open
    openCreate, // Open create modal
    openEdit, // Open edit modal
    openView, // Open view modal
    closeModal, // Close modal
    editing, // Account being edited
    modalMode, // Modal mode

    // CRUD operations
    handleDelete, // Handle account deletion
    onModalSuccess, // Handle modal success
  };
}