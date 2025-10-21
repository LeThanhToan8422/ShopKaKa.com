'use client';

import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Table,
  Space,
  Typography,
  Badge,
  Tag,
  Tooltip,
  Dropdown,
  MenuProps,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import useAdminOrders from './hooks/useAdminOrders';
import OrderDetailModal from './components/OrderDetailModal';
import OrderStatusModal from './components/OrderStatusModal';
import { ORDER_STATUS_OPTIONS } from '@/app/utils';

const { Title, Text } = Typography;

export default function AdminOrdersPage() {
  const {
    form,
    orders,
    stats,
    pagination,
    loading,
    modalOpen,
    selectedOrder,
    modalMode,
    openViewModal,
    openEditModal,
    closeModal,
    handleDelete,
    getStatusText,
    getStatusColor,
    getPaymentMethodText,
    formatCurrency,
    formatDate,
    onSearch,
    onReset,
    onTableChange,
  } = useAdminOrders();
  const router = useRouter();

  const columns: ColumnsType<any> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
      render: (text: string) => (
        <Text code className="text-xs">
          {text}
        </Text>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customerName}</div>
          <div className="text-xs text-gray-500">{record.customerEmail}</div>
        </div>
      ),
    },
    {
      title: 'Tài khoản',
      key: 'account',
      width: 180,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.account.rank || 'N/A'}</div>
          <div className="text-xs text-gray-500">
            {record.account.heroesCount} tướng • {record.account.skinsCount} skin
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <Text strong className="text-green-600">
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Badge
          color={getStatusColor(status)}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 150,
      render: (_, record) => {
        const payment = record.payments?.[0];
        if (!payment) return <Text type="secondary">Chưa có</Text>;
        
        return (
          <div>
            <div className="text-xs">{getPaymentMethodText(payment.method)}</div>
            <div className="text-xs text-gray-500">
              {payment.status === 'SUCCESS' ? 'Thành công' : 'Chờ xử lý'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: Date) => (
        <Text className="text-xs">{formatDate(date)}</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => {
        const items: MenuProps['items'] = [
          {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
            onClick: () => openViewModal(record),
          },
          {
            key: 'edit',
            label: 'Cập nhật trạng thái',
            icon: <EditOutlined />,
            onClick: () => openEditModal(record),
          },
        ];

        if (record.status === 'PENDING') {
          items.push({
            key: 'delete',
            label: 'Xóa đơn hàng',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record),
          });
        }

        return (
          <Space>
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => router.push('/admin/orders/create')}
        >
          Tạo đơn hàng
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Form form={form} layout="vertical" onFinish={onSearch}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="orderNumber" className="!mb-0">
                <Input placeholder="Mã đơn hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="customerName" className="!mb-0">
                <Input placeholder="Tên khách hàng" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item name="status" className="!mb-0">
                <Select placeholder="Trạng thái" allowClear>
                  <Select.Option value="ALL">Tất cả</Select.Option>
                  {ORDER_STATUS_OPTIONS.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item name="sortBy" className="!mb-0">
                <Select placeholder="Sắp xếp theo">
                  <Select.Option value="createdAt">Ngày tạo</Select.Option>
                  <Select.Option value="amount">Giá trị</Select.Option>
                  <Select.Option value="status">Trạng thái</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Form.Item name="sortOrder" className="!mb-0">
                <Select placeholder="Thứ tự">
                  <Select.Option value="desc">Mới nhất</Select.Option>
                  <Select.Option value="asc">Cũ nhất</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  Tìm kiếm
                </Button>
                <Button onClick={onReset} icon={<ReloadOutlined />}>
                  Làm mới
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
          onChange={onTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modals */}
      <OrderDetailModal
        open={modalOpen && modalMode === 'view'}
        order={selectedOrder}
        onClose={closeModal}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getStatusText={getStatusText}
        getStatusColor={getStatusColor}
        getPaymentMethodText={getPaymentMethodText}
      />

      <OrderStatusModal
        open={modalOpen && modalMode === 'edit'}
        order={selectedOrder}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          // Refresh data will be handled by the hook
        }}
      />
    </div>
  );
}
