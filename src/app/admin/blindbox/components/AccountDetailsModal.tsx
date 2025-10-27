"use client";

import { useState, useEffect } from "react";
import { Modal, Descriptions, Spin, Alert, Tag, Card, List, Row, Col, Avatar, Typography, Image, notification } from "antd";
import { saleAccountAPI } from "@/lib/api";
import type { Account } from "@/app/types";

const { Title, Text } = Typography;

interface AccountDetailsModalProps {
  accountId: string;
  visible: boolean;
  onClose: () => void;
}

export default function AccountDetailsModal({
  accountId,
  visible,
  onClose
}: AccountDetailsModalProps) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Fetch account details
  const fetchAccountDetails = async () => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await saleAccountAPI.getById(accountId);
      // Extract the account data from the response
      setAccount(response.data?.item || response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch account details");
      notification.error({
        message: 'Lỗi',
        description: err.message || 'Failed to fetch account details'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && accountId) {
      fetchAccountDetails();
    }
  }, [visible, accountId]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Get rank label
  const getRankLabel = (rankValue?: string | null): string => {
    if (!rankValue) return "Chưa xác định";
    
    // Map backend enum values to display labels
    const rankLabels: Record<string, string> = {
      "DONG": "Đồng",
      "BAC": "Bạc",
      "VANG": "Vàng",
      "BACH_KIM": "Bạch Kim",
      "KIM_CUONG": "Kim Cương",
      "TINH_ANH": "Tinh Anh",
      "CAO_THU": "Cao Thủ",
      "CHIEN_TUONG": "Chiến Tướng",
      "CHIEN_THAN": "Chiến Thần",
      "THACH_DAU": "Thách Đấu"
    };
    
    return rankLabels[rankValue] || rankValue;
  };

  // Handle image preview
  const handlePreview = (image: string) => {
    setPreviewImage(image);
    setPreviewVisible(true);
  };

  return (
    <>
      <Modal
        title={
          <div className="flex items-center">
            <Avatar 
              size="large" 
              style={{ backgroundColor: '#1890ff' }}
              className="mr-3"
            >
              {account?.gameUsername?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            <div>
              <Title level={4} className="mb-0">Chi tiết tài khoản</Title>
              <Text type="secondary">{accountId}</Text>
            </div>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
          />
        ) : account ? (
          <div className="space-y-6">
            <Card size="small" title="Thông tin cơ bản" className="shadow-sm">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Descriptions column={1} size="small" labelStyle={{ fontWeight: 'bold' }} layout="vertical">
                    <Descriptions.Item label="Tên đăng nhập">
                      <Text strong>{account.gameUsername || "Chưa thiết lập"}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Rank">
                      <Tag color="blue">{getRankLabel(account.rank as string)}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá">
                      <Text type="success" strong>{formatCurrency(account.price)}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Level">
                      <Tag color="green">{account.level}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions column={1} size="small" labelStyle={{ fontWeight: 'bold' }} layout="vertical">
                    <Descriptions.Item label="Mật khẩu">
                      {account.gamePassword ? (
                        <Text code>••••••••</Text>
                      ) : (
                        <Text type="secondary">Chưa thiết lập</Text>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương thức đăng nhập">
                      <Tag color="orange">{account.loginMethod || "Chưa xác định"}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tỷ lệ thắng">
                      {account.winRate ? (
                        <Text strong>{(account.winRate * 100).toFixed(1)}%</Text>
                      ) : (
                        <Text type="secondary">N/A</Text>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Uy tín">
                      <Tag color="purple">{account.reputation}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            <Card size="small" title="Thống kê" className="shadow-sm">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Text className="block text-2xl font-bold text-blue-600">{account.heroesCount}</Text>
                    <Text type="secondary">Số tướng</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Text className="block text-2xl font-bold text-green-600">{account.skinsCount}</Text>
                    <Text type="secondary">Số skin</Text>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Text className="block text-2xl font-bold text-purple-600">{account.matches}</Text>
                    <Text type="secondary">Số trận</Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {account.characterSkins && account.characterSkins.length > 0 && (
              <Card size="small" title="Danh sách skin" className="shadow-sm">
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={account.characterSkins}
                  renderItem={(skin) => (
                    <List.Item>
                      <Card size="small" className="w-full hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <Avatar 
                            size="large" 
                            src={skin.avatar}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <Text strong>{skin.character}</Text>
                            <br />
                            <Text type="secondary">{skin.skin}</Text>
                          </div>
                          <Tag color={
                            skin.rarity === "SS+" ? "red" :
                            skin.rarity === "SSM" ? "purple" :
                            skin.rarity === "SS" ? "blue" :
                            skin.rarity === "S+" ? "green" :
                            "default"
                          }>
                            {skin.rarity}
                          </Tag>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {account.images && account.images.length > 0 && (
              <Card size="small" title="Hình ảnh" className="shadow-sm">
                <div className="flex flex-wrap gap-4">
                  {account.images.map((image, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <img
                        src={image}
                        alt={`Account image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border hover:shadow-lg transition-shadow"
                        onClick={() => handlePreview(image)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Text className="text-white font-bold">Xem</Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {account.description && (
              <Card size="small" title="Mô tả" className="shadow-sm">
                <Text>{account.description}</Text>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Text type="secondary">Không tìm thấy thông tin tài khoản</Text>
          </div>
        )}
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title="Xem hình ảnh"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <div className="flex justify-center">
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      </Modal>
    </>
  );
}