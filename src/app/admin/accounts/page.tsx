"use client";

import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Select,
  Table,
  Space,
  Typography,
  Badge,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import useAdminAccounts from "./hooks/useAdminAccounts";
import AdminAccountModal from "./components/modal/page";
import { AdminAccount } from "./types";
import { formatCurrency, formatDate } from "@/app/utils";
import { RANK_OPTIONS, getRankLabel } from "@/lib/ranks";

/**
 * Admin Accounts Management Page
 * Displays a table of accounts with search, filter, and CRUD operations
 * @returns JSX element
 */
export default function AdminAccountsPage() {
  // Get page functionality from custom hook
  const {
    form,
    data,
    total,
    page,
    pageSize,
    loading,
    detailLoading,
    setPage,
    setPageSize,
    onSearch,
    modalOpen,
    openCreate,
    openEdit,
    closeModal,
    editing,
    handleDelete,
    onModalSuccess,
    modalMode, // Modal mode
    openView, // Open view modal
  } = useAdminAccounts();

  /**
   * Table column definitions
   * Defines how each column is displayed and rendered
   */
  const columns: ColumnsType<AdminAccount> = [
    {
      title: "ID",
      dataIndex: "saleAccountId",
      key: "saleAccountId",
      width: 120,
      render: (id: string) => (
        <Typography.Text code className="text-xs">
          {id ? id.slice(0, 8) : "N/A"}... {/* Show first 8 characters */}
        </Typography.Text>
      ),
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: 120,
      render: (rank: string) => (
        <span className="font-semibold text-blue-600">
          {getRankLabel(rank) || "N/A"} {/* Show N/A if no rank */}
        </span>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => (
        <span className="font-semibold text-red-600">
          {formatCurrency(price)}
        </span>
      ),
    },
    {
      title: "Tướng",
      dataIndex: "heroesCount",
      key: "heroesCount",
      width: 80,
      render: (count: number) => (
        <span className="text-green-600 font-semibold">{count}</span>
      ),
    },
    {
      title: "Skin",
      dataIndex: "skinsCount",
      key: "skinsCount",
      width: 80,
      render: (count: number) => (
        <span className="text-purple-600 font-semibold">{count}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        // Color mapping for different statuses
        const colors = {
          available: "green",
          reserved: "orange",
          sold: "red",
          hidden: "gray",
        };
        return (
          <Badge
            color={colors[status as keyof typeof colors]}
            text={status}
            className="capitalize"
          />
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true, // Enable text truncation
      render: (desc: string) => (
        <Typography.Text ellipsis className="max-w-xs">
          {desc || "Không có mô tả"} {/* Show placeholder if no description */}
        </Typography.Text>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      width: 120,
      render: (date: string) => (
        <Typography.Text className="text-xs text-gray-500">
          {date ? formatDate(date) : "N/A"} {/* Format as Vietnamese date */}
        </Typography.Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openView(record)}>
            Xem
          </Button>
          <Button size="small" type="primary" onClick={() => openEdit(record)}>
            Sửa
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Search and Filter Form */}
      <Card className="!mb-4">
        <Form form={form} layout="vertical" onFinish={onSearch}>
          <Row gutter={[12, 0]} align="bottom">
            {/* Search Input */}
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="q" label="Từ khóa" className="!mb-0">
                <Input placeholder="Mô tả, từ khóa..." />
              </Form.Item>
            </Col>

            {/* Rank Filter */}
            <Col xs={24} sm={12} md={3}>
              <Form.Item name="rank" label="Rank" className="!mb-0">
                <Select
                  allowClear
                  placeholder="Chọn rank"
                  options={RANK_OPTIONS}
                />
              </Form.Item>
            </Col>

            {/* Price Range Filter */}
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Giá" className="!mb-0">
                <Space.Compact className="!w-full">
                  <Form.Item name="minPrice" noStyle>
                    <InputNumber className="!w-full" min={0} placeholder="Từ" />
                  </Form.Item>
                  <Form.Item name="maxPrice" noStyle>
                    <InputNumber className="!w-full" min={0} placeholder="Đến" />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            
            {/* Heroes Count Filter */}
            <Col xs={24} sm={12} md={2}>
              <Form.Item name="minHeroes" label="Tướng ≥" className="!mb-0">
                <InputNumber className="w-full" min={0} placeholder="0" />
              </Form.Item>
            </Col>
            
            {/* Skins Count Filter */}
            <Col xs={24} sm={12} md={2}>
              <Form.Item name="minSkins" label="Skin ≥" className="!mb-0">
                <InputNumber className="w-full" min={0} placeholder="0" />
              </Form.Item>
            </Col>

            {/* Action Buttons */}
            <Col xs={24} sm={12} md={5} className="flex items-end">
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Lọc
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    onSearch();
                  }}>
                  Xóa
                </Button>
                <Button onClick={openCreate}>Thêm mới</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Data Table */}
      <Card>
        <Table
          rowKey="saleAccountId"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} tài khoản`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </Card>

      {/* Account Modal */}
      <AdminAccountModal
        open={modalOpen}
        editing={editing}
        onClose={closeModal}
        onSuccess={onModalSuccess}
        mode={modalMode} // Pass mode prop
        loading={detailLoading} // Pass loading state for fetching account details
      />
    </div>
  );
}