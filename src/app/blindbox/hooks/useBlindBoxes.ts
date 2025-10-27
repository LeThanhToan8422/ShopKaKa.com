"use client";

import { useState, useEffect } from "react";
import { saleAccountAPI } from "@/lib/api";
import { BlindBox } from "@/app/types";

export default function useBlindBoxes() {
  const [data, setData] = useState<BlindBox[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlindBoxes = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await saleAccountAPI.getBlindBoxes({
        page: pageNum - 1, // Convert to 0-based indexing
        size: pageSize
      });

      const blindBoxes = response.data?.content || [];
      setData(blindBoxes);
      setTotal(response.data?.totalElements || blindBoxes.length);
      setPage(pageNum);
    } catch (err: any) {
      setError("Không thể tải danh sách túi mù. Vui lòng thử lại sau.");
      console.error(err);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blind boxes on initial load
  useEffect(() => {
    fetchBlindBoxes();
  }, []);

  return {
    data,
    total,
    page,
    pageSize,
    loading,
    error,
    fetchBlindBoxes,
    setPage,
    setPageSize,
  };
}