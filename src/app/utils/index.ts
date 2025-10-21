// Shared utility functions used across the application

export const formatCurrency = (amount: number) => {
  try {
    // Handle null, undefined, or invalid values
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '0₫';
    }
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', amount, error);
    return '0₫';
  }
};

export const formatDate = (date: Date | string) => {
  try {
    // Handle null, undefined, or empty values
    if (!date) {
      return 'N/A';
    }
    
    // Handle string dates
    const dateObj = new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return 'Invalid Date';
  }
};

export const getOrderStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Chờ thanh toán',
    'PROCESSING': 'Đang xử lý',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy',
    'REFUNDED': 'Đã hoàn tiền',
  };
  return statusMap[status] || status;
};

export const getOrderStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'PENDING': 'text-yellow-600 bg-yellow-100',
    'PROCESSING': 'text-blue-600 bg-blue-100',
    'COMPLETED': 'text-green-600 bg-green-100',
    'CANCELLED': 'text-red-600 bg-red-100',
    'REFUNDED': 'text-gray-600 bg-gray-100',
  };
  return colorMap[status] || 'text-gray-600 bg-gray-100';
};

export const getPaymentStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Chờ thanh toán',
    'SUCCESS': 'Thành công',
    'FAILED': 'Thất bại',
    'CANCELLED': 'Đã hủy',
    'REFUNDED': 'Đã hoàn tiền',
  };
  return statusMap[status] || status;
};

export const getPaymentMethodText = (method: string) => {
  const methodMap: Record<string, string> = {
    'VNPAY': 'VNPay',
    'ZALOPAY': 'ZaloPay',
    'BANK': 'Chuyển khoản ngân hàng',
    'MOMO': 'Ví MoMo',
  };
  return methodMap[method] || method;
};

// Rarity styling helper
// Maps item rarity to gradient tokens used across avatar ring, label, glow.
export const getRarityClasses = (rarity?: string) => {
  const r = (rarity || "").toUpperCase();
  if (r.includes("SS+")) {
    return {
      ring: "ring-2 ring-pink-400 shadow-pink-400/50",
      badge: "from-pink-500 via-rose-500 to-orange-400",
      glow: "shadow-pink-400/30",
      text: "text-pink-500",
    };
  }
  if (r.startsWith("SSM") || r.includes("SSM")) {
    return {
      ring: "ring-2 ring-violet-400 shadow-violet-400/50",
      badge: "from-violet-500 via-purple-500 to-indigo-400",
      glow: "shadow-violet-400/30",
      text: "text-violet-500",
    };
  }
  if (r.includes("SS")) {
    return {
      ring: "ring-2 ring-purple-400 shadow-purple-400/50",
      badge: "from-purple-500 via-fuchsia-500 to-pink-400",
      glow: "shadow-purple-400/30",
      text: "text-purple-500",
    };
  }
  if (r.includes("S+")) {
    return {
      ring: "ring-2 ring-blue-400 shadow-blue-400/50",
      badge: "from-sky-500 via-blue-500 to-cyan-400",
      glow: "shadow-blue-400/30",
      text: "text-blue-500",
    };
  }
  if (r.startsWith("A")) {
    return {
      ring: "ring-2 ring-teal-400 shadow-teal-400/50",
      badge: "from-teal-500 via-emerald-500 to-green-400",
      glow: "shadow-teal-400/30",
      text: "text-teal-500",
    };
  }
  return {
    ring: "ring-2 ring-slate-300 shadow-slate-300/50",
    badge: "from-slate-400 via-gray-500 to-slate-500",
    glow: "shadow-slate-400/30",
    text: "text-slate-500",
  };
};

// Rarity styling helper for modal with larger rings
export const getModalRarityClasses = (rarity?: string) => {
  const r = (rarity || "").toUpperCase();
  if (r.includes("SS+")) {
    return {
      ring: "ring-4 ring-pink-500 shadow-pink-500/50",
      badge: "from-pink-500 via-rose-500 to-orange-400",
      glow: "shadow-pink-500/30",
      text: "text-pink-500",
    };
  }
  if (r.startsWith("SSM") || r.includes("SSM")) {
    return {
      ring: "ring-4 ring-violet-500 shadow-violet-500/50",
      badge: "from-violet-500 via-purple-500 to-indigo-400",
      glow: "shadow-violet-500/30",
      text: "text-violet-500",
    };
  }
  if (r.includes("SS")) {
    return {
      ring: "ring-4 ring-purple-500 shadow-purple-500/50",
      badge: "from-purple-500 via-fuchsia-500 to-pink-400",
      glow: "shadow-purple-500/30",
      text: "text-purple-500",
    };
  }
  if (r.includes("S+")) {
    return {
      ring: "ring-4 ring-blue-500 shadow-blue-500/50",
      badge: "from-sky-500 via-blue-500 to-cyan-400",
      glow: "shadow-blue-500/30",
      text: "text-blue-500",
    };
  }
  if (r.startsWith("A")) {
    return {
      ring: "ring-4 ring-teal-500 shadow-teal-500/50",
      badge: "from-teal-500 via-emerald-500 to-green-400",
      glow: "shadow-teal-500/30",
      text: "text-teal-500",
    };
  }
  return {
    ring: "ring-4 ring-slate-400 shadow-slate-400/50",
    badge: "from-slate-400 via-gray-500 to-slate-500",
    glow: "shadow-slate-400/30",
    text: "text-slate-500",
  };
};

// Wing style helper for rarity badges
export const getWingStyleByRarity = (rarity?: string): {
  from: string;
  to: string;
} => {
  const r = (rarity || "").toUpperCase();
  if (r.includes("SSM")) {
    return { from: "from-violet-600", to: "to-fuchsia-500" };
  }
  if (r.includes("SS")) {
    return { from: "from-rose-600", to: "to-amber-500" };
  }
  if (r.includes("S+")) {
    return { from: "from-sky-600", to: "to-cyan-400" };
  }
  if (r.startsWith("A")) {
    return { from: "from-emerald-600", to: "to-green-400" };
  }
  return { from: "from-slate-600", to: "to-slate-400" };
};

// Account status helper
export const getAccountStatusInfo = (status: string) => {
  const statusInfo = {
    available: {
      color: "green",
      text: "✅ Có sẵn",
      tip: "Có thể mua ngay"
    },
    reserved: {
      color: "orange",
      text: "⏳ Đã đặt",
      tip: "Tài khoản đang được giữ chỗ"
    },
    sold: {
      color: "red",
      text: "❌ Đã bán",
      tip: "Tài khoản đã được bán"
    },
    hidden: {
      color: "default",
      text: "❌ Không khả dụng",
      tip: "Chưa mở bán"
    }
  };
  
  return statusInfo[status as keyof typeof statusInfo] || statusInfo.hidden;
};

// Order status options
export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Chờ thanh toán', color: 'orange' },
  { value: 'PROCESSING', label: 'Đang xử lý', color: 'blue' },
  { value: 'COMPLETED', label: 'Hoàn thành', color: 'green' },
  { value: 'CANCELLED', label: 'Đã hủy', color: 'red' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền', color: 'gray' },
];

// Payment status options
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Chờ thanh toán', color: 'orange' },
  { value: 'SUCCESS', label: 'Thành công', color: 'green' },
  { value: 'FAILED', label: 'Thất bại', color: 'red' },
  { value: 'CANCELLED', label: 'Đã hủy', color: 'gray' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền', color: 'blue' },
];

// Profile order filter status options
export const PROFILE_ORDER_STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả tài khoản' },
  { value: 'COMPLETED', label: 'Đã mua thành công' },
];

// Profile order sort options
export const PROFILE_ORDER_SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'price-high', label: 'Giá cao nhất' },
  { value: 'price-low', label: 'Giá thấp nhất' },
  { value: 'status', label: 'Theo trạng thái' },
];
