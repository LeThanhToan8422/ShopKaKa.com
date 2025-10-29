"use client";

import { useState } from "react";
import { App } from "antd";
import { useRouter } from "next/navigation";
import { saleAccountAPI, userAPI } from "@/lib/api";

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
  
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để mua tài khoản');
      router.push('/auth/login');
      return;
    }
    
    if (!accountId) {
      message.error('Không tìm thấy thông tin tài khoản');
      return;
    }
    
    setIsModalOpen(true);
    setCheckingPending(true);
    
    try {
      // Fetch user profile to get user ID
      const profileResponse = await userAPI.getProfile();
      const userId = profileResponse.data.id;
      
      if (!userId) {
        message.error('Không thể lấy thông tin người dùng');
        return;
      }
      
      // Call the new buy endpoint
      const response = await saleAccountAPI.buy({ userId, accountId });
      
      if (response.data.success) {
        message.success('Mua tài khoản thành công!');
        // Close the modal
        setIsModalOpen(false);
        // Redirect to profile page to show purchased account
        router.push('/profile');
      } else {
        message.error(response.data.message || 'Mua tài khoản thất bại');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      message.error('Có lỗi xảy ra khi mua tài khoản');
    } finally {
      setCheckingPending(false);
    }
  };

  const handleSubmit = async (_values: FormValues) => {
    // Implementation can be added later
  };

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'completed'>('idle');

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
    setStatus
  };
}