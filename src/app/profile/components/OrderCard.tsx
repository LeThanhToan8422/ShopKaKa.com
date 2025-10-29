'use client';

import { Tag } from 'antd';
import { UserOrder } from '@/app/types';
import { useState, useEffect } from 'react';

interface OrderCardProps {
  order: UserOrder;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
}

export default function OrderCard({ 
  order, 
  formatCurrency, 
  formatDate 
}: OrderCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
  }, []);

  // Get order type color
  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'Nạp tiền':
        return 'green';
      case 'Mua blind box':
        return 'orange';
      case 'Mua account':
        return 'blue';
      default:
        return 'default';
    }
  };

  // Get payment gateway color
  const getGatewayColor = (gateway: string) => {
    switch (gateway) {
      case 'SEPAY':
        return 'blue';
      case 'BANK':
        return 'purple';
      default:
        return 'default';
    }
  };

  // Animation classes
  const animationClasses = isVisible 
    ? 'opacity-100 translate-y-0 scale-100' 
    : 'opacity-0 translate-y-4 scale-95';

  return (
    <div className={`
      group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden 
      hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1
      ${animationClasses}
    `}>
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 animate-shimmer"></div>
      </div>
      
      {/* Header with animated background */}
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 -translate-y-12 translate-x-12 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 translate-y-8 -translate-x-8 animate-pulse"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                Đơn hàng #{order.orderNumber?.slice(0, 8) || 'N/A'}
              </span>
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(order.orderDetails?.createdAt || new Date())}
            </p>
          </div>
          <Tag 
            color={getOrderTypeColor(order.type)} 
            className="font-medium px-3 py-1 text-sm rounded-full shadow-sm"
          >
            {order.type}
          </Tag>
        </div>
      </div>

      {/* Order Details with hover effects */}
      <div className="p-5 relative">
        {/* Animated accent element */}
        <div className="absolute top-0 left-5 right-5 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transform scale-x-0 transition-transform duration-1000 group-hover:scale-x-100"></div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
            <p className="text-xs text-gray-600 mb-1">Số tiền</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(order.orderDetails?.amount || 0)}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300">
            <p className="text-xs text-gray-600 mb-1">Phương thức</p>
            <Tag 
              color={getGatewayColor(order.orderDetails?.payment?.gateway)} 
              className="font-medium px-2 py-1 text-xs rounded-full"
            >
              {order.orderDetails?.payment?.gateway || 'N/A'}
            </Tag>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg group-hover:bg-gray-50 transition-colors duration-200">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Mã giao dịch</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {order.orderDetails?.payment?.code || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg group-hover:bg-gray-50 transition-colors duration-200">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Nội dung</p>
              <p className="text-sm text-gray-900 truncate">
                {order.orderDetails?.payment?.content || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-gray-100 transition-colors duration-200">
              <p className="text-xs text-gray-500 mb-1">Ngày thanh toán</p>
              <p className="text-sm text-gray-900">
                {formatDate(order.orderDetails?.payment?.transactionDate || new Date())}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-gray-100 transition-colors duration-200">
              <p className="text-xs text-gray-500 mb-1">Tài khoản</p>
              <p className="text-sm text-gray-900 truncate">
                {order.orderDetails?.payment?.accountNumber || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating action button */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
}