"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { saleAccountAPI } from "@/lib/api";
import { Account } from "@/app/types";

export default function useAccounts() {
  const [form] = Form.useForm();
  const [data, setData] = useState<Account[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(false);

  const fetchData = async (searchParams: any = {}) => {
    setLoading(true);
    try {
      const params = {
        page: page - 1, // Convert to 0-based indexing
        size: pageSize,
        ...searchParams
      };
      
      const response = await saleAccountAPI.getAll(params);
      const accounts = response.data?.content || [];
      setData(accounts);
      setTotal(response.data?.totalElements || accounts.length);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const onSearch = (values: any = {}) => {
    setPage(1);
    fetchData(values);
  };

  return {
    form,
    data,
    total,
    page,
    pageSize,
    loading,
    setPage,
    setPageSize,
    onSearch,
  };
}