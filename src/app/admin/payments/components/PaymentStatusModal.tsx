'use client';

import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Button, Select, Alert, Typography } from 'antd';
import { PAYMENT_STATUS_OPTIONS } from '@/app/utils';

const { TextArea } = Input;
const { Title, Text } = Typography;

// Updated Payment interface to match the one in page.tsx and PaymentDetailModal.tsx
interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  gatewayTransactionId: string | null;
  paidAt: Date | null;
  failureReason: string | null;
  refundedAt: Date | null;
  refundAmount: number | null;
  createdAt: Date;
  updatedAt: Date;
  order: {
    id: string;
    orderNumber: string;
    amount: number;
    status: string;
    customerName: string;
    customerEmail: string;
    createdAt: Date;
    account: {
      id: string;
      rank: string | null;
      price: number;
    };
  };
}

interface PaymentStatusModalProps {
  open: boolean;
  payment: Payment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentStatusModal({
  open,
  payment,
  onClose,
  onSuccess,
}: PaymentStatusModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!payment) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: payment.id,
          status: values.status,
          failureReason: values.failureReason || null,
          refundAmount: values.refundAmount || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi cập nhật thanh toán');
      }

      // Show success message
      setError(null);
      setSuccess(true);
      // Show success state
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setError(null);
    setSuccess(false);
    onClose();
  };

  // Initialize form when payment changes
  useEffect(() => {
    if (payment) {
      form.setFieldsValue({
        status: payment.status,
        failureReason: payment.failureReason || '',
        refundAmount: payment.refundAmount || undefined,
      });
    }
  }, [payment, form]);

  if (!payment) return null;

  return (
    <Modal
      title={`Cập nhật trạng thái thanh toán`}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <div className="space-y-4">
        {/* Payment Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <Title level={5} className="!mb-2">Thông tin giao dịch</Title>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Text strong>Mã giao dịch:</Text>
              <div className="text-xs">{payment.gatewayTransactionId || payment.id}</div>
            </div>
            <div>
              <Text strong>Số tiền:</Text>
              <div className="text-green-600 font-medium">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(payment.amount)}
              </div>
            </div>
            <div>
              <Text strong>Phương thức:</Text>
              <div>{payment.method}</div>
            </div>
            <div>
              <Text strong>Trạng thái hiện tại:</Text>
              <div>
                <span className={`px-2 py-1 rounded text-xs ${
                  payment.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                  payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                  payment.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                  payment.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {PAYMENT_STATUS_OPTIONS.find(s => s.value === payment.status)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <Alert
            message="Thành công"
            description="Cập nhật trạng thái thanh toán thành công!"
            type="success"
            showIcon
          />
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        )}

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item
            name="status"
            label="Trạng thái mới"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              placeholder="Chọn trạng thái mới"
              size="large"
            >
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${option.color}-500`} />
                    {option.label}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="failureReason"
            label="Lý do thất bại (nếu có)"
          >
            <TextArea
              rows={3}
              placeholder="Nhập lý do thất bại nếu trạng thái là FAILED..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="refundAmount"
            label="Số tiền hoàn (nếu có)"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập số tiền hoàn nếu trạng thái là REFUNDED..."
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
              min={0}
            />
          </Form.Item>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <Text className="text-yellow-800 text-sm">
              <strong>Lưu ý:</strong> Khi chuyển thanh toán sang trạng thái &quot;Thành công&quot;, 
              đơn hàng sẽ được cập nhật trạng thái thành &quot;Đang xử lý&quot;.
            </Text>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={handleClose}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}