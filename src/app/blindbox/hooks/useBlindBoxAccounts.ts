"use client";

import { useState } from "react";
import { saleAccountAPI } from "@/lib/api";
import { Account } from "@/app/types";

export default function useBlindBoxAccounts() {
  const [data, setData] = useState<Account[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountsByBlindBox = async (blindBoxId: string, pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch accounts filtered by blindBoxId
      const response = await saleAccountAPI.getAll({
        page: pageNum - 1, // Convert to 0-based indexing
        size: pageSize
      });

      // Filter accounts by blindBoxId
      const accounts = (response.data?.content || []).filter(
        (account: Account) => account.blindBoxId === blindBoxId
      );
      
      setData(accounts);
      setTotal(response.data?.totalElements || accounts.length);
      setPage(pageNum);
    } catch (err: any) {
      setError("Không thể tải danh sách tài khoản. Vui lòng thử lại sau.");
      console.error(err);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    total,
    page,
    pageSize,
    loading,
    error,
    fetchAccountsByBlindBox,
    setPage,
    setPageSize,
  };
}