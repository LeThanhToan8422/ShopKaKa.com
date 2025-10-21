'use client';

import { useState, useEffect } from 'react';
import useOrderFilters from '../hooks/useOrderFilters';
import { PROFILE_ORDER_STATUS_OPTIONS, PROFILE_ORDER_SORT_OPTIONS } from '@/app/utils';

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

interface OrderFiltersProps {
  orders: Order[];
  onFilteredOrders: (orders: Order[]) => void;
  getOrderStatusText: (status: string) => string;
}

export default function OrderFilters({ orders, onFilteredOrders, getOrderStatusText }: OrderFiltersProps) {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    applyFilters,
    clearFilters
  } = useOrderFilters(orders as any, onFilteredOrders);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lọc và tìm kiếm tài khoản</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              applyFilters();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Số đơn hàng, rank, mô tả..."
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              applyFilters();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {PROFILE_ORDER_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Sắp xếp
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              applyFilters();
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {PROFILE_ORDER_SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Button */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-600">
        Hiển thị {orders.length} tài khoản đã mua thành công
      </div>
    </div>
  );
}