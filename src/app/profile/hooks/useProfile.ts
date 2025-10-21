import { useState, useEffect } from 'react';
import { userAPI } from '@/lib/api';
import { UserProfile, Order, UpdateProfileData } from '@/app/types';
import { getOrderStatusText, getOrderStatusColor, getPaymentStatusText, getPaymentMethodText, formatCurrency, formatDate } from '@/app/utils';

export default function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Có lỗi xảy ra khi tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setUpdating(true);
    setError(null);
    
    try {
      const response = await userAPI.updateProfile(data.name);
      setProfile(response.data);
      return { success: true, message: 'Cập nhật thông tin thành công' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Có lỗi xảy ra khi cập nhật';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updating,
    fetchProfile,
    updateProfile,
    getOrderStatusText,
    getOrderStatusColor,
    getPaymentStatusText,
    getPaymentMethodText,
    formatCurrency,
    formatDate,
  };
}