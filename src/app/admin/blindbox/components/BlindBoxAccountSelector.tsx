"use client";

import { useState, useEffect } from "react";
import { Modal, Table, Button, Input, Select, Spin, Alert, Space, Tag, notification } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { saleAccountAPI } from "@/lib/api";
import type { Account } from "@/app/types";

interface BlindBoxAccountSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectAccounts: (accountIds: string[]) => void;
  existingAccountIds?: string[]; // Add prop for existing account IDs
}

export default function BlindBoxAccountSelector({
  visible,
  onClose,
  onSelectAccounts,
  existingAccountIds = [] // Default to empty array
}: BlindBoxAccountSelectorProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(existingAccountIds);
  const [searchTerm, setSearchTerm] = useState("");
  const [rankFilter, setRankFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Update selected row keys when existingAccountIds change
  useEffect(() => {
    if (visible) {
      setSelectedRowKeys(existingAccountIds);
    }
  }, [existingAccountIds, visible]);

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

  // Handle select accounts
  const handleSelectAccounts = () => {
    if (selectedRowKeys.length > 0) {
      onSelectAccounts(selectedRowKeys as string[]);
      notification.success({
        message: 'Thành công',
        description: `Đã chọn ${selectedRowKeys.length} tài khoản!`
      });
      onClose();
    }
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
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
    }
  ];

  return (
    <Modal
      title="Chọn tài khoản cho túi mù"
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
          onClick={handleSelectAccounts}
          disabled={selectedRowKeys.length === 0}
          icon={<PlusOutlined />}
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
  );
}