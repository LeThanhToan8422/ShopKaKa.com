'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button, Modal, Descriptions, Tag, Card, Row, Col, Space, Typography, Divider } from 'antd';
import { EyeOutlined, CopyOutlined, LockOutlined, UserOutlined, StarOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';
import { decryptRSAText } from '@/lib/rsa';

const { Title, Text } = Typography;

interface CharacterSkin {
  id: string;
  character: string;
  skin: string;
  rarity: string;
  avatar: string;
  background: string;
}

interface Account {
  id: string;
  rank?: string;
  price: number;
  heroesCount: number;
  skinsCount: number;
  status: string;
  description?: string;
  images: string[];
  level?: number;
  matches?: number;
  winRate?: number;
  reputation?: number;
  characterSkins?: CharacterSkin[];
  gameUsername?: string;
  gamePassword?: string;
  loginMethod?: string;
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  blindBoxId?: string;
}

interface PurchasedAccountCardProps {
  account: Account;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
}

export default function PurchasedAccountCard({ 
  account, 
  formatCurrency, 
  formatDate 
}: PurchasedAccountCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState({
    username: account.gameUsername || '',
    password: account.gamePassword || ''
  });

  const mainImage = account.images?.[0] || '/placeholder-account.jpg';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getRarityColor = (rarity: string): string => {
    if (rarity.includes("SS+")) return "purple";
    if (rarity.includes("SS")) return "purple";
    if (rarity.includes("S+")) return "blue";
    if (rarity.includes("S")) return "cyan";
    if (rarity.includes("A")) return "green";
    return "default";
  };

  const getRarityGradient = (rarity: string): string => {
    if (rarity.includes("SS+")) return "linear-gradient(135deg, #8a2be2, #9400d3)";
    if (rarity.includes("SS")) return "linear-gradient(135deg, #9370db, #8a2be2)";
    if (rarity.includes("S+")) return "linear-gradient(135deg, #1e90ff, #00bfff)";
    if (rarity.includes("S")) return "linear-gradient(135deg, #87cefa, #1e90ff)";
    if (rarity.includes("A")) return "linear-gradient(135deg, #32cd32, #00ff7f)";
    return "linear-gradient(135deg, #d3d3d3, #a9a9a9)";
  };

  return (
    <>
      <Card 
        className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        cover={
          <div className="relative h-48">
            <Image
              src={mainImage}
              alt="Account preview"
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-account.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-white text-xl font-bold truncate">
                    Tài khoản #{account.id.slice(0, 8)}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Mua ngày {formatDate(account.updatedAt)}
                  </p>
                </div>
                <Tag color="green" className="font-bold">
                  ĐÃ MUA
                </Tag>
              </div>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Price and Rank */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {account.rank && (
                <Tag color="blue" className="font-bold">
                  {account.rank}
                </Tag>
              )}
            </div>
            <Title level={3} className="m-0 text-green-600">
              {formatCurrency(account.price)}
            </Title>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <FireOutlined className="text-blue-500" />
                <Text className="font-medium">Tướng</Text>
              </div>
              <Title level={4} className="m-0 text-blue-600">
                {account.heroesCount}
              </Title>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <StarOutlined className="text-purple-500" />
                <Text className="font-medium">Skin</Text>
              </div>
              <Title level={4} className="m-0 text-purple-600">
                {account.skinsCount}
              </Title>
            </div>
            {account.level && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrophyOutlined className="text-green-500" />
                  <Text className="font-medium">Cấp độ</Text>
                </div>
                <Title level={4} className="m-0 text-green-600">
                  {account.level}
                </Title>
              </div>
            )}
            {account.winRate && (
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FireOutlined className="text-orange-500" />
                  <Text className="font-medium">Tỷ lệ thắng</Text>
                </div>
                <Title level={4} className="m-0 text-orange-600">
                  {account.winRate.toFixed(1)}%
                </Title>
              </div>
            )}
          </div>

          {/* Description */}
          {account.description && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <Text className="text-gray-600 line-clamp-2">
                {account.description}
              </Text>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              icon={<EyeOutlined />}
              onClick={() => setShowDetails(true)}
              className="flex-1"
              size="large"
            >
              Xem chi tiết
            </Button>
            
            {account.gameUsername && account.gamePassword && (
              <Button
                icon={<LockOutlined />}
                onClick={() => {
                  // Decrypt only the password before showing the modal
                  const decryptedPassword = decryptRSAText(account.gamePassword || '');
                  setCredentials({
                    username: account.gameUsername || '',
                    password: decryptedPassword
                  });
                  setShowCredentials(true);
                }}
                className="flex-1"
                size="large"
                type="primary"
              >
                Thông tin
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={mainImage}
                alt="Account preview"
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-account.jpg';
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Chi tiết tài khoản</h2>
              <p className="text-gray-500">#{account.id.slice(0, 8)}</p>
            </div>
          </div>
        }
        open={showDetails}
        onCancel={() => setShowDetails(false)}
        footer={[
          <Button key="close" onClick={() => setShowDetails(false)} size="large">
            Đóng
          </Button>
        ]}
        width={800}
      >
        <div className="space-y-6">
          {/* Main Stats */}
          <Card size="small">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="ID" span={2}>
                {account.id}
              </Descriptions.Item>
              <Descriptions.Item label="Rank">
                {account.rank || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                {formatCurrency(account.price)}
              </Descriptions.Item>
              <Descriptions.Item label="Số tướng">
                {account.heroesCount}
              </Descriptions.Item>
              <Descriptions.Item label="Số skin">
                {account.skinsCount}
              </Descriptions.Item>
              <Descriptions.Item label="Cấp độ">
                {account.level || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Số trận">
                {account.matches || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Tỷ lệ thắng">
                {account.winRate ? `${account.winRate.toFixed(1)}%` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Danh tiếng">
                {account.reputation || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày mua">
                {formatDate(account.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức đăng nhập" span={2}>
                {account.loginMethod || 'N/A'}
              </Descriptions.Item>
              {account.additionalInfo && (
                <Descriptions.Item label="Thông tin bổ sung" span={2}>
                  {account.additionalInfo}
                </Descriptions.Item>
              )}
              {account.description && (
                <Descriptions.Item label="Mô tả" span={2}>
                  {account.description}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Character Skins */}
          {account.characterSkins && account.characterSkins.length > 0 && (
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <StarOutlined className="text-yellow-500" />
                  <span>Skins đặc biệt</span>
                </div>
              }
              size="small"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {account.characterSkins.map((skin) => (
                  <div 
                    key={`${skin.character}-${skin.skin}`} 
                    className="border rounded-lg p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
                    style={{
                      background: getRarityGradient(skin.rarity)
                    }}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={skin.avatar}
                        alt={skin.skin}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-skin.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">{skin.character}</div>
                      <div className="text-xs text-white/90">{skin.skin}</div>
                      <Tag color={getRarityColor(skin.rarity)} className="text-xs mt-1">
                        {skin.rarity}
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Images */}
          {account.images && account.images.length > 1 && (
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <EyeOutlined className="text-blue-500" />
                  <span>Hình ảnh tài khoản</span>
                </div>
              }
              size="small"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {account.images.slice(1).map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                      src={image}
                      alt={`Account image ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-account.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </Modal>

      {/* Credentials Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <LockOutlined className="text-red-500" />
            <span>Thông tin đăng nhập</span>
          </div>
        }
        open={showCredentials}
        onCancel={() => {
          setShowCredentials(false);
          // Reset only the password to encrypted version when closing modal
          setCredentials(prev => ({
            ...prev,
            password: account.gamePassword || ''
          }));
        }}
        footer={[
          <Button key="close" onClick={() => {
            setShowCredentials(false);
            // Reset only the password to encrypted version when closing modal
            setCredentials(prev => ({
              ...prev,
              password: account.gamePassword || ''
            }));
          }} size="large">
            Đóng
          </Button>
        ]}
        width={600}
      >
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Lưu ý:</strong> Vui lòng lưu thông tin này ở nơi an toàn. 
                  Thông tin đăng nhập chỉ hiển thị một lần và không thể khôi phục.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <UserOutlined className="mr-2" />
                Tên đăng nhập
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={credentials.username}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
                />
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={() => copyToClipboard(credentials.username)}
                  type="primary"
                >
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <LockOutlined className="mr-2" />
                Mật khẩu
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={credentials.password}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 font-mono"
                />
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={() => copyToClipboard(credentials.password)}
                  type="primary"
                >
                  Copy
                </Button>
              </div>
            </div>

            {account.loginMethod && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <StarOutlined className="mr-2" />
                  Phương thức đăng nhập
                </label>
                <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md">
                  <Text className="font-medium text-blue-700">{account.loginMethod}</Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}