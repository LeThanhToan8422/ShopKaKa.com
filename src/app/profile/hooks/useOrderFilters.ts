'use client';

import { useState, useEffect } from 'react';

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

export default function useOrderFilters(orders: Order[], onFilteredOrders: (orders: Order[]) => void) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  const applyFilters = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(term) ||
        order.account.rank?.toLowerCase().includes(term) ||
        order.account.description?.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term)
      );
    }

    // Status filter (tất cả đều là COMPLETED nên không cần filter)
    // if (statusFilter !== 'ALL') {
    //   filtered = filtered.filter(order => order.status === statusFilter);
    // }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-high':
        filtered.sort((a, b) => b.account.price - a.account.price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.account.price - b.account.price);
        break;
      case 'status':
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }

    onFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setSortBy('newest');
    onFilteredOrders(orders);
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, sortBy, orders]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    applyFilters,
    clearFilters
  };
}