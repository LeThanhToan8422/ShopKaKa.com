"use client";

import { Button, Modal, Spin, Popconfirm } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saleAccountAPI, userAPI } from "@/lib/api";
import { App } from "antd";

type Props = {
  accountId: string;
  price: number;
  onPurchaseSuccess?: () => void;
};

export default function QuickPurchaseButton({ accountId, price, onPurchaseSuccess }: Props) {
  const router = useRouter();
  const { message } = App.useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false;

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để mua tài khoản');
      router.push('/auth/login');
      return;
    }
    
    // Show confirmation dialog
    setIsConfirmModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    setIsConfirmModalOpen(false);
    setIsProcessing(true);
    
    try {
      // Fetch user profile to get user ID
      const profileResponse = await userAPI.getProfile();
      const userId = profileResponse.data.id;
      
      if (!userId) {
        message.error('Không thể lấy thông tin người dùng');
        return;
      }
      
      // Call the buy endpoint
      const response = await saleAccountAPI.buy({ userId, accountId });
      
      if (response.data.success) {
        message.success('Mua tài khoản thành công!');
        // Redirect to profile page to show purchased account
        router.push('/profile?tab=accounts');
        if (onPurchaseSuccess) {
          onPurchaseSuccess();
        }
      } else {
        message.error(response.data.message || 'Mua tài khoản thất bại');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      message.error('Có lỗi xảy ra khi mua tài khoản');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        className="flex-1 rounded-xl shadow-md transition-all duration-300 ease-out group-hover:shadow-xl group-hover:scale-105 relative overflow-hidden py-2.5 font-bold text-sm flex items-center justify-center text-white"
        style={{
          background:
            "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
        }}
        icon={<span className="mr-1.5">🛒</span>}
        onClick={handlePurchaseClick}
        loading={isProcessing}>
        Mua ngay
      </Button>

      {/* Confirmation Modal */}
      <Modal
        open={isConfirmModalOpen}
        onOk={handleConfirmPurchase}
        onCancel={() => setIsConfirmModalOpen(false)}
        okText="Xác nhận mua"
        cancelText="Hủy bỏ"
        okButtonProps={{
          className: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none rounded-xl h-12 font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300",
        }}
        cancelButtonProps={{
          className: "bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 border-none rounded-xl h-12 font-bold text-gray-700 shadow hover:shadow-md transition-all duration-300",
        }}
        centered
        closable={false}
        width={480}
        styles={{
          body: {
            borderRadius: '16px',
          }
        }}
      >
        <div className="text-center py-6">
          {/* Animated icon */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl transform rotate-12 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 rounded-2xl transform -rotate-12 animate-pulse animation-delay-200"></div>
            <div className="relative w-full h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">🛒</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác nhận mua tài khoản</h2>
          <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn thực hiện giao dịch này?</p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Số tiền thanh toán:</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                {price ? new Intl.NumberFormat('vi-VN').format(price) : 0}₫
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 italic">
            Sau khi xác nhận, bạn sẽ được chuyển hướng đến trang tài khoản đã mua
          </div>
        </div>
      </Modal>

      {/* Processing Modal */}
      <Modal
        title="Đang xử lý đơn hàng"
        open={isProcessing}
        onCancel={() => setIsProcessing(false)}
        footer={null}
        width={400}
        centered
      >
        <div className="mt-6">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
            <p className="text-gray-600 text-center">Đang xử lý yêu cầu mua tài khoản...</p>
            <p className="text-gray-500 text-sm mt-2">Vui lòng không đóng trình duyệt</p>
          </div>
        </div>
      </Modal>
    </>
  );
}