"use client";

import { useState } from "react";
import { Modal, Button, Upload, message, Table, Tag, Space, Popconfirm, notification } from "antd";
import { UploadOutlined, UserAddOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { saleAccountAPI } from "@/lib/api";
import type { BlindBox } from "@/app/types";
import AccountSelector from "./AccountSelector";
import AccountDetailsModal from "./AccountDetailsModal";

interface BlindBoxAccountsManagerProps {
  blindBox: BlindBox;
  visible: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function BlindBoxAccountsManager({
  blindBox,
  visible,
  onClose,
  onRefresh
}: BlindBoxAccountsManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [accountSelectorVisible, setAccountSelectorVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  // Handle adding selected accounts (new improved method)
  const handleAddSelectedAccounts = async (accountIds: string[]) => {
    try {
      await saleAccountAPI.addAccountToBlindBox({
        blindBoxId: blindBox.id,
        accountId: accountIds
      });
      notification.success({
        message: 'Thành công',
        description: `Thêm ${accountIds.length} tài khoản thành công!`
      });
      onRefresh();
    } catch (err: any) {
      notification.error({
        message: 'Lỗi',
        description: err.message || 'Failed to add accounts'
      });
      console.error(err);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      await saleAccountAPI.uploadBlindBoxFile(blindBox.id, file);
      notification.success({
        message: 'Thành công',
        description: 'Upload file thành công!'
      });
      onRefresh();
    } catch (err: any) {
      notification.error({
        message: 'Lỗi',
        description: err.message || 'Failed to upload file'
      });
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Handle view account details
  const handleViewDetails = (accountId: string) => {
    setSelectedAccountId(accountId);
    setDetailModalVisible(true);
  };

  // Handle remove account from blind box (placeholder for now)
  const handleRemoveAccount = async (accountId: string) => {
    // This would be the implementation for removing an account from a blind box
    // For now, we'll just show a message
    notification.info({
      message: 'Thông báo',
      description: "Chức năng xóa tài khoản khỏi túi mù sẽ được triển khai trong tương lai"
    });
    console.log("Remove account", accountId, "from blind box", blindBox.id);
  };

  // Columns for accounts table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: { id: string }) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
          >
            Xem chi tiết
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa tài khoản này khỏi túi mù?"
            onConfirm={() => handleRemoveAccount(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <>
      <Modal
        title={`Quản lý tài khoản trong túi mù: ${blindBox.name}`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <div className="space-y-6">
          {/* Add accounts section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Thêm tài khoản</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                icon={<UserAddOutlined />} 
                onClick={() => setAccountSelectorVisible(true)}
              >
                Chọn từ danh sách tài khoản
              </Button>
              <Upload
                beforeUpload={(file) => {
                  handleFileUpload(file);
                  return false;
                }}
                showUploadList={false}
                accept=".xlsx,.xls,.csv"
              >
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploading}
                  disabled={uploading}
                >
                  {uploading ? "Đang upload..." : "Upload file"}
                </Button>
              </Upload>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Chọn tài khoản từ danh sách để xem thông tin chi tiết trước khi thêm vào túi mù
            </p>
          </div>

          {/* Accounts list */}
          <div>
            <h3 className="text-lg font-medium mb-3">Danh sách tài khoản ({blindBox.saleAccounts?.length || 0})</h3>
            {blindBox.saleAccounts && blindBox.saleAccounts.length > 0 ? (
              <Table
                dataSource={blindBox.saleAccounts.map((id, index) => ({ id, key: index }))}
                columns={columns}
                pagination={false}
                size="small"
              />
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có tài khoản nào trong túi mù này</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Account Selector Modal */}
      <AccountSelector
        visible={accountSelectorVisible}
        onClose={() => setAccountSelectorVisible(false)}
        onAddAccounts={handleAddSelectedAccounts}
        existingAccountIds={blindBox.saleAccounts || []}
      />

      {/* Account Details Modal */}
      <AccountDetailsModal
        accountId={selectedAccountId}
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
      />
    </>
  );
}