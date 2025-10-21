'use client';

import { useState } from 'react';
import useExportAccounts from '../hooks/useExportAccounts';

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
  characterSkins?: string;
  gameUsername?: string;
  gamePassword?: string;
  loginMethod?: string;
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  userId: string;
  success: boolean;
  message: string;
  order: {
    orderNumber: string;
    amount: number;
  };
  sepay: {
    qrUrl: string;
  };
  account: Account;
  customerName: string;
  customerEmail: string;
  status: string;
  createdAt: string;
  orderNumber: string;
}

interface ExportAccountsProps {
  orders: Order[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
}

export default function ExportAccounts({ orders, formatCurrency, formatDate }: ExportAccountsProps) {
  const { isExporting, exportToText, exportToJSON } = useExportAccounts();

  // Chỉ lấy đơn hàng đã hoàn thành (orders đã được filter từ API)
  const completedOrders = orders;

  if (completedOrders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Xuất thông tin tài khoản</h3>
          <p className="text-sm text-gray-600 mt-1">
            Xuất thông tin {completedOrders.length} tài khoản đã mua thành công
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToText(orders, formatCurrency, formatDate)}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Đang xuất...' : 'Xuất TXT'}
          </button>
          <button
            onClick={() => exportToJSON(orders, formatCurrency, formatDate)}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Đang xuất...' : 'Xuất JSON'}
          </button>
        </div>
      </div>
    </div>
  );
}
