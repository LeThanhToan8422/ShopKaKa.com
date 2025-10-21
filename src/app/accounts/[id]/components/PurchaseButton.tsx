"use client";

import { Button, Modal, Spin } from "antd";
import usePurchase from "../hooks/usePurchase";

type Props = {
  accountId?: string;
  price?: number;
  onClick?: () => void;
};

export default function PurchaseButton({ accountId, price, onClick }: Props) {
  const {
    isModalOpen,
    setIsModalOpen,
    checkingPending,
    handlePurchase: handlePurchaseLogic,
    qrUrl,
    setQrUrl,
    orderNumber,
    status,
    setStatus,
    isAuthenticated
  } = usePurchase(accountId, price);
  
  const handlePurchase = () => {
    if (onClick) {
      onClick();
    } else {
      handlePurchaseLogic();
    }
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        className="w-full h-14 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden group"
        style={{
          background:
            "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)",
          border: "none",
          boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
        }}
        icon={
          <span className="text-xl group-hover:scale-110 transition-transform duration-300">
            🛒
          </span>
        }
        onClick={handlePurchase}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative z-10 drop-shadow-sm">Mua ngay</span>
      </Button>

      <Modal
        title="Thông tin thanh toán"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={500}
      >
        {checkingPending && (
          <div className="mt-6 flex items-center justify-center">
            <Spin />
          </div>
        )}
        {!checkingPending && !qrUrl && (
          <div className="mt-6">
            {price && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tổng thanh toán:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat('vi-VN').format(price || 0)}₫
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center text-gray-600">
              Đang chuẩn bị mã QR...
            </div>
            <div className="mt-4">
              <Button onClick={() => setIsModalOpen(false)} className="w-full">Đóng</Button>
            </div>
          </div>
        )}
        {!checkingPending && qrUrl && (
          <div className="mt-2">
            <p className="mb-2">Vui lòng quét mã QR để thanh toán. Đơn hàng sẽ tự động xác nhận sau khi nhận được giao dịch.</p>
            <div className="flex justify-center">
              <img src={qrUrl} alt="SePay QR" className="rounded-lg border" />
            </div>
            {orderNumber && (
              <div className="text-center text-sm text-gray-500 mt-2">Mã đơn: {orderNumber}</div>
            )}
            <div className="mt-4">
              <Button onClick={() => { setQrUrl(null); setIsModalOpen(false); }} className="w-full">Đóng</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}