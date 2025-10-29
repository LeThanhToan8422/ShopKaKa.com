'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useProfile from './hooks/useProfile';
import ProfileForm from './components/ProfileForm';
import StatsCards from './components/StatsCards';
import ExportAccounts from './components/ExportAccounts';
import EmptyState from './components/EmptyState';
import { Button, notification, Tabs, Spin, Alert } from 'antd';
import { WalletOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { paymentSocketService, PaymentNotification } from '@/lib/socket';
import { saleAccountAPI } from '@/lib/api';
import PurchasedAccountCard from '@/app/profile/components/PurchasedAccountCard';
import OrderCard from '@/app/profile/components/OrderCard';

export default function ProfilePage() {
  const router = useRouter();
  const {
    profile,
    orders,
    loading,
    error,
    updating,
    updateProfile,
    formatCurrency,
    formatDate,
    fetchProfile,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'accounts'>('profile');
  const [api, contextHolder] = notification.useNotification();
  const [purchasedAccounts, setPurchasedAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  // Check URL parameters for tab selection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'accounts') {
        setActiveTab('accounts');
      } else if (tabParam === 'orders') {
        setActiveTab('orders');
      }
    }
  }, []);

  // Fetch purchased accounts when accounts tab is selected
  useEffect(() => {
    const fetchPurchasedAccounts = async () => {
      if (activeTab === 'accounts' && profile?.id && purchasedAccounts.length === 0) {
        setAccountsLoading(true);
        setAccountsError(null);
        
        try {
          const response = await saleAccountAPI.getByUserId(profile.id, 0, 100); // Get first 100 accounts
          setPurchasedAccounts(response.data.content || []);
        } catch (err: any) {
          console.error('Error fetching purchased accounts:', err);
          setAccountsError('Không thể tải danh sách tài khoản đã mua. Vui lòng thử lại sau.');
        } finally {
          setAccountsLoading(false);
        }
      }
    };

    fetchPurchasedAccounts();
  }, [activeTab, profile?.id, purchasedAccounts.length]);

  // Initialize WebSocket connection and listen for payment notifications
  useEffect(() => {
    if (profile?.id) {
      // Initialize the payment socket service
      paymentSocketService.init(profile.id);
      
      // Add payment notification handler
      const handlePaymentNotification = (data: PaymentNotification) => {
        if (data.success) {
          // Show success notification
          api.success({
            message: 'Nạp tiền thành công',
            description: data.message,
            duration: 10,
          });
          
          // Refresh user profile to update balance
          fetchProfile();
        }
      };
      
      paymentSocketService.addPaymentHandler(handlePaymentNotification);
      
      // Cleanup function
      return () => {
        paymentSocketService.removePaymentHandler(handlePaymentNotification);
        paymentSocketService.disconnect();
      };
    }
  }, [profile?.id, api, fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy thông tin</h2>
          <p className="text-gray-600 dark:text-gray-300">Không thể tải thông tin người dùng</p>
        </div>
      </div>
    );
  }

  // For the new API, we use the actual balance from the profile
  const statistics = {
    totalOrders: orders.length,
    completedOrders: orders.filter((order: any) => order.orderDetails?.active).length,
    totalSpent: orders.reduce((sum: number, order: any) => sum + (order.orderDetails?.amount || 0), 0),
    pendingOrders: 0, // Not available in new API
    cancelledOrders: 0, // Not available in new API
    balance: profile.balance || 0, // Use the actual balance from the profile
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key as 'profile' | 'orders' | 'accounts');
    
    // Update URL without reloading the page
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', key);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Generate unique key for each order
  const getOrderKey = (order: any, index: number): string => {
    // Try to use orderNumber first, then orderDetails.id, then fallback to index
    const baseKey = order.orderNumber || order.orderDetails?.id || index.toString();
    // Add index to ensure uniqueness
    return `${baseKey}-${index}`;
  };

  return (
    <div className="min-h-screen">
      {contextHolder}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Thông tin cá nhân</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Quản lý thông tin cá nhân và xem lịch sử đơn hàng của bạn
              </p>
            </div>
            <Link href="/recharge">
              <Button type="primary" size="large" icon={<WalletOutlined />}>
                Nạp tiền
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: 'profile',
              label: (
                <span>
                  <UserOutlined />
                  Thông tin cá nhân
                </span>
              ),
              children: (
                <div>
                  {/* Stats Cards */}
                  <StatsCards 
                    statistics={statistics} 
                    formatCurrency={formatCurrency} 
                  />

                  {/* Profile Form */}
                  <ProfileForm 
                    profile={profile}
                    updating={updating}
                    onUpdate={updateProfile}
                  />
                </div>
              ),
            },
            {
              key: 'orders',
              label: (
                <span>
                  <ShoppingOutlined />
                  Đơn hàng
                </span>
              ),
              children: (
                <div>
                  {/* Orders List */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.length > 0 ? (
                      orders.map((order: any, index: number) => (
                        <OrderCard
                          key={getOrderKey(order, index)}
                          order={order}
                          formatCurrency={formatCurrency}
                          formatDate={formatDate}
                        />
                      ))
                    ) : (
                      <div className="col-span-full">
                        <EmptyState 
                          title="Không tìm thấy đơn hàng nào" 
                          description="Bạn chưa có đơn hàng nào trong lịch sử."
                        />
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: 'accounts',
              label: (
                <span>
                  <ShoppingOutlined />
                  Tài khoản đã mua
                </span>
              ),
              children: (
                <div>
                  {accountsLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Spin size="large" />
                      <span className="ml-4 text-gray-600 dark:text-gray-300">Đang tải tài khoản...</span>
                    </div>
                  ) : accountsError ? (
                    <Alert
                      message="Lỗi"
                      description={accountsError}
                      type="error"
                      showIcon
                    />
                  ) : purchasedAccounts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {purchasedAccounts.map((account: any) => (
                        <PurchasedAccountCard
                          key={account.id}
                          account={account}
                          formatCurrency={formatCurrency}
                          formatDate={formatDate}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-gray-500 dark:text-gray-400 text-lg block mb-2">
                        Bạn chưa mua tài khoản nào
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 mb-6">
                        Hãy quay lại cửa hàng để mua tài khoản
                      </p>
                      <Link href="/accounts">
                        <Button type="primary">Mua tài khoản</Button>
                      </Link>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}