'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useProfile from './hooks/useProfile';
import ProfileForm from './components/ProfileForm';
import StatsCards from './components/StatsCards';
import OrderFilters from './components/OrderFilters';
import AccountCard from './components/AccountCard';
import ExportAccounts from './components/ExportAccounts';
import EmptyState from './components/EmptyState';
import { Button, notification } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { paymentSocketService, PaymentNotification } from '@/lib/socket';

// Transform API order to component order format
const transformOrder = (apiOrder: any) => {
  return {
    userId: apiOrder.userId,
    success: apiOrder.success,
    message: apiOrder.message,
    order: apiOrder.order,
    sepay: apiOrder.sepay,
    account: {
      id: 'unknown', // Not available in API response
      rank: 'unknown',
      price: apiOrder.order?.amount || 0,
      heroesCount: 0,
      skinsCount: 0,
      status: apiOrder.success ? 'completed' : 'pending',
      description: 'Tài khoản Liên Quân Mobile',
      images: [],
      level: 0,
      matches: 0,
      winRate: 0,
      reputation: 0,
      characterSkins: '[]',
      gameUsername: '',
      gamePassword: '',
      loginMethod: '',
      additionalInfo: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    customerName: 'Unknown',
    customerEmail: 'unknown@example.com',
    status: apiOrder.success ? 'completed' : 'pending',
    createdAt: new Date().toISOString(),
    orderNumber: apiOrder.order?.orderNumber || '',
  };
};

export default function ProfilePage() {
  const router = useRouter();
  const {
    profile,
    loading,
    error,
    updating,
    updateProfile,
    getOrderStatusText,
    getOrderStatusColor,
    getPaymentStatusText,
    getPaymentMethodText,
    formatCurrency,
    formatDate,
  } = useProfile();

  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [transformedOrders, setTransformedOrders] = useState<any[]>([]);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    if (profile) {
      // Transform API orders to component format
      const transformed = profile.orders.map(transformOrder);
      setTransformedOrders(transformed);
      setFilteredOrders(transformed);
    }
  }, [profile]);

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
          
          // Optionally refresh user profile to update balance
          // fetchProfile();
        }
      };
      
      paymentSocketService.addPaymentHandler(handlePaymentNotification);
      
      // Cleanup function
      return () => {
        paymentSocketService.removePaymentHandler(handlePaymentNotification);
        paymentSocketService.disconnect();
      };
    }
  }, [profile?.id, api]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy thông tin</h2>
          <p className="text-gray-600">Không thể tải thông tin người dùng</p>
        </div>
      </div>
    );
  }

  // For the new API, we don't have statistics, so we'll calculate them from orders
  const statistics = {
    totalOrders: profile.orders.length,
    completedOrders: profile.orders.filter(order => order.success).length,
    totalSpent: profile.orders.reduce((sum, order) => sum + (order.order?.amount || 0), 0),
    pendingOrders: 0, // Not available in new API
    cancelledOrders: 0, // Not available in new API
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {contextHolder}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
              <p className="mt-2 text-gray-600">
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

        {/* Stats Cards */}
        <StatsCards 
          statistics={statistics} 
          formatCurrency={formatCurrency} 
        />

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tài khoản đã mua ({profile.orders.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <ProfileForm
            profile={profile}
            onUpdate={updateProfile}
            updating={updating}
          />
        )}

        {activeTab === 'orders' && (
          <div>
            {/* Export Accounts */}
            <ExportAccounts
              orders={transformedOrders}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />

            {/* Filters */}
            <OrderFilters
              orders={transformedOrders}
              onFilteredOrders={setFilteredOrders}
              getOrderStatusText={getOrderStatusText}
            />

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <EmptyState
                title={profile.orders.length === 0 ? 'Chưa có tài khoản nào đã mua thành công' : 'Không tìm thấy tài khoản phù hợp'}
                description={profile.orders.length === 0 
                  ? 'Chỉ hiển thị các tài khoản đã thanh toán thành công. Hãy mua tài khoản đầu tiên của bạn!' 
                  : 'Thử thay đổi bộ lọc để tìm tài khoản khác'
                }
                showButton={profile.orders.length === 0}
                buttonText="Xem tài khoản có sẵn"
              />
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order: any) => (
                  <AccountCard
                    key={order.userId}
                    order={order}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    getOrderStatusText={getOrderStatusText}
                    getOrderStatusColor={getOrderStatusColor}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}