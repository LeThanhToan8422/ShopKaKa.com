'use client';

import { useState, useEffect } from 'react';
import { Button, Card, InputNumber, Typography, Radio, Space, Alert, Spin, Modal, notification } from 'antd';
import { userAPI } from '@/lib/api';
import { paymentSocketService, PaymentNotification } from '@/lib/socket';
import Link from 'next/link';

const { Title, Text } = Typography;

// Predefined recharge amounts
const RECHARGE_AMOUNTS = [
  { value: 50000, label: '50.000đ' },
  { value: 100000, label: '100.000đ' },
  { value: 200000, label: '200.000đ' },
  { value: 500000, label: '500.000đ' },
  { value: 1000000, label: '1.000.000đ' },
];

export default function RechargePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [socketConnected, setSocketConnected] = useState(false);

  // Fetch user profile to get userId
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUserId(response.data.id);
      } catch (err: any) {
        setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Initialize WebSocket connection and listen for payment notifications
  useEffect(() => {
    if (userId) {
      // Initialize the payment socket service
      paymentSocketService.init(userId);
      
      // Check connection status after a short delay
      const connectionCheck = setTimeout(() => {
        const isConnected = paymentSocketService.isConnectedStatus();
        setSocketConnected(isConnected);
        
        if (!isConnected) {
          // Show fallback notification
          api.warning({
            message: 'Cảnh báo',
            description: 'Không thể kết nối tới hệ thống thông báo thanh toán. Vui lòng kiểm tra lại số dư tài khoản sau khi thanh toán.',
            duration: 10,
          });
        }
      }, 3000);
      
      // Add payment notification handler
      const handlePaymentNotification = (data: PaymentNotification) => {
        if (data.success) {
          setPaymentSuccess(true);
          setQrCodeUrl(null);
          setSocketConnected(true);
          
          // Show success notification
          api.success({
            message: 'Nạp tiền thành công',
            description: data.message,
            duration: 10,
          });
          
          // Optionally refresh user profile to update balance
          // fetchUserProfile();
        }
      };
      
      paymentSocketService.addPaymentHandler(handlePaymentNotification);
      
      // Cleanup function
      return () => {
        clearTimeout(connectionCheck);
        paymentSocketService.removePaymentHandler(handlePaymentNotification);
        paymentSocketService.disconnect();
      };
    }
  }, [userId, api]);

  // Handle amount selection
  const handleAmountSelect = (value: number) => {
    setSelectedAmount(value);
    setUseCustomAmount(false);
  };

  // Handle custom amount input
  const handleCustomAmountChange = (value: number | null) => {
    setCustomAmount(value);
    if (value !== null) {
      setUseCustomAmount(true);
    }
  };

  // Get the final amount to use
  const getFinalAmount = () => {
    return useCustomAmount ? customAmount : selectedAmount;
  };

  // Generate recharge QR code
  const handleRecharge = async () => {
    if (!userId) {
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    const amount = getFinalAmount();
    if (!amount || amount < 10000) {
      setError('Số tiền nạp tối thiểu là 10.000đ');
      return;
    }

    setRechargeLoading(true);
    setError(null);
    setPaymentSuccess(false);

    try {
      // Generate SePay QR code URL with prefix and suffix
      const prefixSuffix = process.env.NEXT_PUBLIC_SEPAY_QR_PREFIX_SUFFIX || '';
      const qrUrl = `https://qr.sepay.vn/img?acc=VQRQAESIO3999&bank=MBBank&amount=${amount}&des=${prefixSuffix}${userId}${prefixSuffix}`;
      setQrCodeUrl(qrUrl);
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tạo mã QR nạp tiền. Vui lòng thử lại.');
      console.error('Error generating recharge QR:', err);
    } finally {
      setRechargeLoading(false);
    }
  };

  // Reset QR code
  const handleReset = () => {
    setQrCodeUrl(null);
    setError(null);
    setPaymentSuccess(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  const amount = getFinalAmount();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {contextHolder}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/profile" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Quay lại trang cá nhân
          </Link>
          <Title level={2}>Nạp tiền vào tài khoản</Title>
          <Text type="secondary">
            Nạp tiền để có thể mua tài khoản và xé túi mù
          </Text>
        </div>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            className="mb-6"
            closable
            onClose={() => setError(null)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recharge Form */}
          <div>
            <Card title="Chọn số tiền nạp" className="shadow-sm">
              <div className="space-y-6">
                <div>
                  <Text strong className="block mb-3">Chọn mệnh giá:</Text>
                  <Radio.Group 
                    onChange={(e) => handleAmountSelect(e.target.value)}
                    value={useCustomAmount ? null : selectedAmount}
                    className="w-full"
                  >
                    <Space direction="vertical" className="w-full">
                      {RECHARGE_AMOUNTS.map((option) => (
                        <Radio key={option.value} value={option.value} className="w-full py-2">
                          <div className="flex justify-between items-center w-full">
                            <span>{option.label}</span>
                            <span className="text-gray-500 text-sm">Thẻ quà tặng</span>
                          </div>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </div>

                <div>
                  <Text strong className="block mb-3">Hoặc nhập số tiền:</Text>
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Nhập số tiền muốn nạp"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                    addonAfter="₫"
                    min={10000}
                    step={10000}
                    value={useCustomAmount ? customAmount : undefined}
                    onChange={handleCustomAmountChange}
                  />
                  <Text type="secondary" className="block mt-2">
                    Số tiền tối thiểu: 10.000đ
                  </Text>
                </div>

                <Button
                  type="primary"
                  size="large"
                  className="w-full"
                  onClick={handleRecharge}
                  loading={rechargeLoading}
                  disabled={!amount || amount < 10000}
                >
                  Tạo mã QR nạp tiền
                </Button>
              </div>
            </Card>

            {/* Instructions */}
            <Card title="Hướng dẫn nạp tiền" className="mt-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                  <Text>Chọn mệnh giá hoặc nhập số tiền bạn muốn nạp</Text>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                  <Text>Nhấn &quot;Tạo mã QR nạp tiền&quot; để tạo mã thanh toán</Text>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                  <Text>Mở ứng dụng ngân hàng và quét mã QR</Text>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                  <Text>Thực hiện chuyển khoản theo số tiền hiển thị</Text>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">5</div>
                  <Text>Hệ thống sẽ tự động cập nhật số dư khi thanh toán thành công</Text>
                </div>
                {!socketConnected && (
                  <div className="flex items-start mt-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="text-yellow-500 mr-3 text-lg">⚠️</div>
                    <Text type="warning">
                      <strong>Cảnh báo:</strong> Không thể kết nối tới hệ thống thông báo thanh toán. 
                      Vui lòng kiểm tra lại số dư tài khoản sau khi thanh toán hoặc làm mới trang.
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* QR Code Display */}
          <div>
            <Card title="Mã QR thanh toán" className="shadow-sm">
              {qrCodeUrl ? (
                <div className="text-center">
                  <div className="mb-6 p-4 bg-white rounded-lg inline-block">
                    {/* <QRCode value={qrCodeUrl} size={200} /> */}
                    {qrCodeUrl && (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code thanh toán" 
                        className="w-48 h-48 object-contain"
                      />
                    )}
                  </div>
                  
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <Text strong className="block mb-2">Thông tin thanh toán:</Text>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Text>Số tiền:</Text>
                        <Text strong>{amount?.toLocaleString('vi-VN')}₫</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text>Nội dung:</Text>
                        <Text strong>{userId}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text>Ngân hàng:</Text>
                        <Text strong>MB Bank</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text>Số tài khoản:</Text>
                        <Text strong>VQRQAESIO3999</Text>
                      </div>
                    </div>
                  </div>
                  
                  <Text type="secondary" className="block mb-4">
                    Quét mã QR bằng ứng dụng ngân hàng để thực hiện thanh toán
                  </Text>
                  
                  <div className="flex gap-3">
                    <Button onClick={handleReset} className="flex-1">
                      Nạp số tiền khác
                    </Button>
                    <Button type="primary" href={qrCodeUrl} target="_blank" className="flex-1">
                      Mở trong ứng dụng
                    </Button>
                  </div>
                </div>
              ) : paymentSuccess ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🎉</div>
                  <Title level={3} className="text-green-600">Thanh toán thành công!</Title>
                  <Text className="block mb-4">Số dư tài khoản của bạn đã được cập nhật.</Text>
                  <Button type="primary" onClick={handleReset}>
                    Nạp thêm tiền
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">💳</div>
                  <Text className="block mb-2">Chọn số tiền và tạo mã QR để nạp tiền</Text>
                  <Text type="secondary">
                    Sau khi nạp tiền, bạn có thể sử dụng số dư để mua tài khoản và xé túi mù
                  </Text>
                </div>
              )}
            </Card>

            {/* Benefits */}
            <Card title="Lợi ích khi nạp tiền" className="mt-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="text-green-500 mr-3 text-lg">✓</div>
                  <Text>Mua tài khoản Liên Quân Mobile với giá tốt</Text>
                </div>
                <div className="flex items-start">
                  <div className="text-green-500 mr-3 text-lg">✓</div>
                  <Text>Trải nghiệm cảm giác hồi hộp khi xé túi mù</Text>
                </div>
                <div className="flex items-start">
                  <div className="text-green-500 mr-3 text-lg">✓</div>
                  <Text>Nhận ngẫu nhiên skin hiếm và cực hiếm</Text>
                </div>
                <div className="flex items-start">
                  <div className="text-green-500 mr-3 text-lg">✓</div>
                  <Text>Giao dịch nhanh chóng, an toàn</Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}