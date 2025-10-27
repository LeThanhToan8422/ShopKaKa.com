"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Spin, Alert, Card, Space, Tag, Popconfirm, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { saleAccountAPI } from "@/lib/api";
import type { BlindBox } from "@/app/types";
import BlindBoxAccountsManager from "./components/BlindBoxAccountsManager";
import BlindBoxAccountSelector from "./components/BlindBoxAccountSelector";

export default function AdminBlindBoxPage() {
  const [blindBoxes, setBlindBoxes] = useState<BlindBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBlindBox, setEditingBlindBox] = useState<BlindBox | null>(null);
  const [accountsManagerVisible, setAccountsManagerVisible] = useState(false);
  const [accountSelectorVisible, setAccountSelectorVisible] = useState(false);
  const [selectedBlindBox, setSelectedBlindBox] = useState<BlindBox | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Fetch blind boxes
  const fetchBlindBoxes = async (pageNum: number = 0, size: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await saleAccountAPI.getBlindBoxes({
        page: pageNum,
        size: size
      });
      
      const data = response.data?.content || [];
      setBlindBoxes(data);
      setTotal(response.data?.totalElements || data.length);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || "Failed to fetch blind boxes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlindBoxes();
  }, []);

  // Handle table pagination
  const handleTableChange = (pagination: any) => {
    fetchBlindBoxes(pagination.current - 1, pagination.pageSize);
  };

  // Handle create/edit blind box
  const handleCreateEdit = async (values: any) => {
    try {
      // Convert price to number if provided
      const priceValue = values.price ? parseFloat(values.price) : undefined;
      
      // Prepare data with selected accounts
      const blindBoxData = {
        ...values,
        price: priceValue,
        saleAccounts: selectedAccountIds
      };
      
      if (editingBlindBox) {
        // Update existing blind box
        await saleAccountAPI.updateBlindBox({
          ...blindBoxData,
          id: editingBlindBox.id
        });
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật túi mù thành công!'
        });
      } else {
        // Create new blind box
        await saleAccountAPI.createBlindBox(blindBoxData);
        notification.success({
          message: 'Thành công',
          description: 'Tạo túi mù thành công!'
        });
      }
      
      setModalVisible(false);
      form.resetFields();
      setEditingBlindBox(null);
      setSelectedAccountIds([]);
      fetchBlindBoxes();
    } catch (err: any) {
      notification.error({
        message: 'Lỗi',
        description: err.message || 'Failed to save blind box'
      });
      console.error(err);
    }
  };

  // Handle delete blind box
  const handleDelete = async (id: string) => {
    try {
      await saleAccountAPI.deleteBlindBox(id);
      notification.success({
        message: 'Thành công',
        description: 'Xóa túi mù thành công!'
      });
      fetchBlindBoxes();
    } catch (err: any) {
      notification.error({
        message: 'Lỗi',
        description: err.message || 'Failed to delete blind box'
      });
      console.error(err);
    }
  };

  // Handle edit button click
  const handleEdit = (blindBox: BlindBox) => {
    setEditingBlindBox(blindBox);
    form.setFieldsValue({
      ...blindBox,
      price: blindBox.price?.toString() || undefined
    });
    // Set selected account IDs for editing
    setSelectedAccountIds(blindBox.saleAccounts || []);
    setModalVisible(true);
  };

  // Handle manage accounts button click
  const handleManageAccounts = (blindBox: BlindBox) => {
    setSelectedBlindBox(blindBox);
    setAccountsManagerVisible(true);
  };

  // Handle select accounts for blind box
  const handleSelectAccounts = (accountIds: string[]) => {
    setSelectedAccountIds(accountIds);
    setAccountSelectorVisible(false);
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
      title: "Tên túi mù",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price ? `${price.toLocaleString("vi-VN")}đ` : "Chưa đặt giá"
    },
    {
      title: "Số tài khoản",
      dataIndex: "saleAccounts",
      key: "saleAccounts",
      render: (saleAccounts: string[]) => (
        <Tag color="blue">{saleAccounts?.length || 0}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 300,
      render: (_: any, record: BlindBox) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Button 
            icon={<EyeOutlined />}
            onClick={() => handleManageAccounts(record)}
            size="small"
          >
            Quản lý TK
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa túi mù này? Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Túi Mù</h1>
        <p className="text-gray-600">Quản lý các túi mù và tài khoản liên quan</p>
      </div>

      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Danh sách Túi Mù</h2>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBlindBox(null);
              form.resetFields();
              setSelectedAccountIds([]);
              setModalVisible(true);
            }}
          >
            Thêm Túi Mù
          </Button>
        </div>
      </Card>

      {error && (
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
          className="mb-6"
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={blindBoxes}
          columns={columns}
          rowKey="id"
          pagination={{
            current: page + 1,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        title={editingBlindBox ? "Sửa Túi Mù" : "Thêm Túi Mù"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingBlindBox(null);
          setSelectedAccountIds([]);
        }}
        onOk={() => form.submit()}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateEdit}
        >
          <Form.Item
            name="name"
            label="Tên túi mù"
            rules={[{ required: true, message: "Vui lòng nhập tên túi mù" }]}
          >
            <Input placeholder="Nhập tên túi mù" />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Giá tiền (VND)"
            rules={[{ required: false }]}
          >
            <Input type="number" placeholder="Nhập giá tiền" addonAfter="VND" />
          </Form.Item>
          
          <Form.Item
            label="Tài khoản trong túi mù"
          >
            <div className="border rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <span>Đã chọn {selectedAccountIds.length} tài khoản</span>
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => setAccountSelectorVisible(true)}
                >
                  Chọn tài khoản
                </Button>
              </div>
              {selectedAccountIds.length > 0 ? (
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {selectedAccountIds.map((id, index) => (
                      <Tag 
                        key={index} 
                        closable
                        onClose={() => {
                          const newIds = selectedAccountIds.filter(accountId => accountId !== id);
                          setSelectedAccountIds(newIds);
                        }}
                      >
                        {id.substring(0, 8)}...
                      </Tag>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có tài khoản nào được chọn</p>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Accounts Manager Modal */}
      {selectedBlindBox && (
        <BlindBoxAccountsManager
          blindBox={selectedBlindBox}
          visible={accountsManagerVisible}
          onClose={() => {
            setAccountsManagerVisible(false);
            setSelectedBlindBox(null);
          }}
          onRefresh={fetchBlindBoxes}
        />
      )}

      {/* Account Selector Modal */}
      <BlindBoxAccountSelector
        visible={accountSelectorVisible}
        onClose={() => setAccountSelectorVisible(false)}
        onSelectAccounts={handleSelectAccounts}
        existingAccountIds={selectedAccountIds} // Pass existing account IDs
      />
    </div>
  );
}