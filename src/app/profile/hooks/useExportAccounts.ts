'use client';

import { useState } from 'react';

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

export default function useExportAccounts() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToText = (
    orders: Order[], 
    formatCurrency: (amount: number) => string,
    formatDate: (date: Date | string) => string
  ) => {
    setIsExporting(true);
    
    let content = '=== THÔNG TIN TÀI KHOẢN ĐÃ MUA ===\n\n';
    content += `Ngày xuất: ${formatDate(new Date())}\n`;
    content += `Tổng số tài khoản: ${orders.length}\n\n`;

    orders.forEach((order, index) => {
      const { account } = order;
      content += `--- TÀI KHOẢN ${index + 1} ---\n`;
      content += `Số đơn hàng: ${order.orderNumber}\n`;
      content += `Ngày mua: ${formatDate(order.createdAt)}\n`;
      content += `Giá: ${formatCurrency(account.price)}\n`;
      content += `Rank: ${account.rank || 'N/A'}\n`;
      content += `Số tướng: ${account.heroesCount}\n`;
      content += `Số skin: ${account.skinsCount}\n`;
      
      if (account.gameUsername) {
        content += `Tên đăng nhập: ${account.gameUsername}\n`;
      }
      if (account.gamePassword) {
        content += `Mật khẩu: ${account.gamePassword}\n`;
      }
      if (account.loginMethod) {
        content += `Phương thức đăng nhập: ${account.loginMethod}\n`;
      }
      if (account.additionalInfo) {
        content += `Thông tin bổ sung: ${account.additionalInfo}\n`;
      }
      
      content += `Mô tả: ${account.description || 'N/A'}\n`;
      content += '\n';
    });

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tai-khoan-da-mua-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const exportToJSON = (
    orders: Order[],
    formatCurrency: (amount: number) => string,
    formatDate: (date: Date | string) => string
  ) => {
    setIsExporting(true);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      totalAccounts: orders.length,
      accounts: orders.map(order => ({
        orderNumber: order.orderNumber,
        purchaseDate: order.createdAt,
        price: order.order.amount,
        account: {
          rank: order.account.rank,
          heroesCount: order.account.heroesCount,
          skinsCount: order.account.skinsCount,
          level: order.account.level,
          winRate: order.account.winRate,
          matches: order.account.matches,
          reputation: order.account.reputation,
          gameUsername: order.account.gameUsername,
          loginMethod: order.account.loginMethod,
          additionalInfo: order.account.additionalInfo,
          description: order.account.description,
        }
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tai-khoan-da-mua-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  return {
    isExporting,
    exportToText,
    exportToJSON
  };
}