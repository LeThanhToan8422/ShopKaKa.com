"use client";

import { useState, useEffect } from "react";
import { Modal, Table, Button, Input, Select, Spin, Alert, Space, Tag, Image, notification } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { saleAccountAPI } from "@/lib/api";
import type { Account } from "@/app/types";
import AccountDetailsModal from "./AccountDetailsModal";

interface AccountSelectorProps {
  visible: boolean;
  onClose: () => void;
  onAddAccounts: (accountIds: string[]) => void;
  existingAccountIds: string[];
}

export default function AccountSelector({
  visible,
  onClose,
  onAddAccounts,
  existingAccountIds
}: AccountSelectorProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(existingAccountIds);
  const [searchTerm, setSearchTerm] = useState("");
  const [rankFilter, setRankFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Update selected row keys when existingAccountIds change
  useEffect(() => {
    setSelectedRowKeys(existingAccountIds);
  }, [existingAccountIds]);

  // Fetch accounts
  const fetchAccounts = async (pageNum: number = 0, size: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await saleAccountAPI.getAll({
        page: pageNum,
        size: size,
        ...(searchTerm && { search: searchTerm }),
        ...(rankFilter && { rank: rankFilter })
      });
      
      const data = response.data?.content || [];
      setAccounts(data);
      setTotal(response.data?.totalElements || data.length);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || "Failed to fetch accounts");
      notification.error({
        message: 'Lỗi',
        description: err.message || 'Failed to fetch accounts'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchAccounts();
    }
  }, [visible, searchTerm, rankFilter]);

  // Handle table pagination
  const handleTableChange = (pagination: any) => {
    fetchAccounts(pagination.current - 1, pagination.pageSize);
  };

  // Handle add selected accounts
  const handleAddSelected = () => {
    if (selectedRowKeys.length > 0) {
      onAddAccounts(selectedRowKeys as string[]);
      notification.success({
        message: 'Thành công',
        description: `Đã chọn ${selectedRowKeys.length} tài khoản!`
      });
      setSelectedRowKeys([]);
      onClose();
    }
  };

  // Handle view account details
  const handleViewDetails = (accountId: string) => {
    setSelectedAccountId(accountId);
    setDetailModalVisible(true);
  };

  // Handle image preview
  const handleImagePreview = (image: string) => {
    setPreviewImage(image);
    setPreviewVisible(true);
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: (record: Account) => ({
      disabled: existingAccountIds.includes(record.id),
    }),
  };

  // Columns for the table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 200,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "gameUsername",
      key: "gameUsername",
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (rank: string) => <Tag color="blue">{rank}</Tag>
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price?.toLocaleString("vi-VN")}đ`
    },
    {
      title: "Số tướng",
      dataIndex: "heroesCount",
      key: "heroesCount",
    },
    {
      title: "Số skin",
      dataIndex: "skinsCount",
      key: "skinsCount",
    },
    {
      title: "Hình ảnh",
      key: "images",
      render: (_: any, record: Account) => (
        record.images && record.images.length > 0 ? (
          <div className="flex gap-1">
            <Image
              src={record.images[0]}
              alt="Preview"
              width={40}
              height={40}
              className="object-cover rounded cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleImagePreview(record.images[0]);
              }}
              preview={false}
            />
            {record.images.length > 1 && (
              <span className="text-xs text-gray-500">+{record.images.length - 1}</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">Không có</span>
        )
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Account) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDetails(record.id)}
          >
            Xem
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <>
      <Modal
        title="Chọn tài khoản"
        open={visible}
        onCancel={onClose}
        width={1200}
        footer={[
          <Button key="back" onClick={onClose}>
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleAddSelected}
            disabled={selectedRowKeys.length === 0}
          >
            Thêm {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ""} tài khoản
          </Button>
        ]}
      >
        <div className="mb-4 flex gap-2 flex-wrap">
          <Input
            placeholder="Tìm kiếm theo ID, tên đăng nhập..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo rank"
            style={{ width: 200 }}
            allowClear
            onChange={setRankFilter}
            options={[
              { value: "Đồng", label: "Đồng" },
              { value: "Bạc", label: "Bạc" },
              { value: "Vàng", label: "Vàng" },
              { value: "Bạch Kim", label: "Bạch Kim" },
              { value: "Kim Cương", label: "Kim Cương" },
              { value: "Cao Thủ", label: "Cao Thủ" },
              { value: "Thách Đấu", label: "Thách Đấu" }
            ]}
          />
        </div>

        {error && (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
            className="mb-4"
          />
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={accounts}
            columns={columns}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={{
              current: page + 1,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        )}
      </Modal>

      {/* Account Details Modal */}
      <AccountDetailsModal
        accountId={selectedAccountId}
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
      />

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