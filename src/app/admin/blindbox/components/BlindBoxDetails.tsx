"use client";

import { Modal, Descriptions, Tag, List, Card } from "antd";
import type { BlindBox } from "@/app/types";

interface BlindBoxDetailsProps {
  blindBox: BlindBox | null;
  visible: boolean;
  onClose: () => void;
}

export default function BlindBoxDetails({
  blindBox,
  visible,
  onClose
}: BlindBoxDetailsProps) {
  if (!blindBox) return null;

  return (
    <Modal
      title={`Chi tiết túi mù: ${blindBox.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="ID">{blindBox.id}</Descriptions.Item>
        <Descriptions.Item label="Tên túi mù">{blindBox.name}</Descriptions.Item>
        <Descriptions.Item label="Số tài khoản">
          <Tag color="blue">{blindBox.saleAccounts?.length || 0}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Card title="Danh sách tài khoản" className="mt-4">
        {blindBox.saleAccounts && blindBox.saleAccounts.length > 0 ? (
          <List
            dataSource={blindBox.saleAccounts}
            renderItem={(accountId, index) => (
              <List.Item>
                <List.Item.Meta
                  title={`Tài khoản #${index + 1}`}
                  description={accountId}
                />
              </List.Item>
            )}
          />
        ) : (
          <p className="text-gray-500 text-center py-4">Chưa có tài khoản nào trong túi mù này</p>
        )}
      </Card>
    </Modal>
  );
}