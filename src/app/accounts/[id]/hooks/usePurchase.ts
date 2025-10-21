"use client";

import { useState, useEffect } from "react";
import { App } from "antd";
import { useRouter } from "next/navigation";
import { orderAPI } from "@/lib/api";

type FormValues = {
  customerName: string;
  customerEmail: string;
};

export default function usePurchase(accountId?: string, price?: number) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { message } = App.useApp();
  const [checkingPending, setCheckingPending] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false;
  const userName = typeof window !== 'undefined' ? localStorage.getItem('name') || '' : '';
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('username') || '' : '';
  
  const handlePurchase = () => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để mua tài khoản');
      router.push('/auth/login');
      return;
    }
    
    setIsModalOpen(true);
    // Try to reuse pending order automatically; show spinner to avoid form flash
    if (accountId && price) {
      setCheckingPending(true);
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, customerName: userName, customerEmail: userEmail }),
      })
        .then(async (res) => res.json())
        .then((data: { success: boolean; sepay?: { qrUrl: string }; order?: { orderNumber?: string } }) => {
          if (data?.success && data.sepay?.qrUrl) {
            setQrUrl(data.sepay.qrUrl);
            if (data.order?.orderNumber) setOrderNumber(data.order.orderNumber);
            setStatus('pending');
          }
        })
        .catch(() => {})
        .finally(() => setCheckingPending(false));
    }
  };

  const handleSubmit = async (_values: FormValues) => {};

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'completed'>('idle');

  // Poll order status when QR is shown
  useEffect(() => {
    if (!isModalOpen || !orderNumber || status !== 'pending') return;
    let cancelled = false;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/status?orderNumber=${orderNumber}`);
        const data = await res.json() as { success: boolean; found?: boolean; status?: string };
        if (!cancelled && data.success && data.found && data.status === 'COMPLETED') {
          setStatus('completed');
          message.success('Thanh toán thành công! Thông tin tài khoản sẽ được gửi qua email.');
          setIsModalOpen(false);
          clearInterval(interval);
        }
      } catch {}
    }, 3000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [isModalOpen, orderNumber, status, message]);

  return {
    isModalOpen,
    setIsModalOpen,
    loading,
    checkingPending,
    handlePurchase,
    handleSubmit,
    qrUrl,
    setQrUrl,
    orderNumber,
    setOrderNumber,
    status,
    setStatus,
    price,
    isAuthenticated,
    userName,
    userEmail
  };
}