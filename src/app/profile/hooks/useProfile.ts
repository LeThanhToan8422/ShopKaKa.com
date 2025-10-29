import { useState, useEffect } from 'react';
import { userAPI, orderAPI } from '@/lib/api';
import { UserProfile, UserOrder, UpdateProfileData } from '@/app/types';
import { getOrderStatusText, getOrderStatusColor, getPaymentStatusText, getPaymentMethodText, formatCurrency, formatDate } from '@/app/utils';

export default function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [orders, setOrders] = useState<UserOrder[]>([]);

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

  const fetchUserOrders = async (userId: string) => {
    try {
      // Fetch all types of orders for the user
      const orderTypes = ["Nạp tiền", "Mua blind box", "Mua account"];
      const allOrders: UserOrder[] = [];
      
      for (const type of orderTypes) {
        const response = await orderAPI.getUserOrders({
          type,
          userId,
          page: 0,
          size: 100 // Get first 100 orders of each type
        });
        
        // Add the orders to our array
        allOrders.push(...response.data.content);
      }
      
      setOrders(allOrders);
    } catch (err: any) {
      console.error('Error fetching user orders:', err);
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

  // Fetch user orders when profile is loaded
  useEffect(() => {
    if (profile?.id) {
      fetchUserOrders(profile.id);
    }
  }, [profile?.id]);

  return {
    profile,
    orders,
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