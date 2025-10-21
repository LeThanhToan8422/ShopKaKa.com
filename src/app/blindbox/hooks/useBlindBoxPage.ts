"use client";

import { useState } from "react";
import useBlindBoxAccounts from "./useBlindBoxAccounts";
import { saleAccountAPI, userAPI } from '@/lib/api';

// Mock data for price options
const PRICE_OPTIONS = [
  { value: 10000, label: "10.000đ" },
  { value: 20000, label: "20.000đ" },
  { value: 50000, label: "50.000đ" },
  { value: 100000, label: "100.000đ" },
  { value: 200000, label: "200.000đ" },
  { value: 500000, label: "500.000đ" },
];

export default function useBlindBoxPage() {
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isBoxOpened, setIsBoxOpened] = useState(false);
  const [openedAccount, setOpenedAccount] = useState<any>(null);
  const [showSkinReveal, setShowSkinReveal] = useState(false);

  const {
    data: accounts,
    total,
    page,
    pageSize,
    loading,
    error,
    fetchAccountsByPrice,
    setPage,
    setPageSize,
  } = useBlindBoxAccounts();

  // Fetch accounts based on selected price
  const fetchAccounts = async () => {
    const price = useCustomPrice ? customPrice : selectedPrice;
    if (!price) return;
    await fetchAccountsByPrice(price, 1); // Reset to first page
  };

  // Handle price selection
  const handlePriceSelect = (value: number) => {
    setSelectedPrice(value);
    setUseCustomPrice(false);
  };

  // Handle custom price input
  const handleCustomPriceChange = (value: number | null) => {
    setCustomPrice(value);
    if (value !== null) {
      setUseCustomPrice(true);
    }
  };

  // Handle account selection - initiate purchase process
  const handleAccountSelection = async (account: any) => {
    const price = useCustomPrice ? customPrice : selectedPrice;
    if (!price) return;

    // Set selected account
    setSelectedAccount(account);

    // Add a dramatic "tearing" animation effect
    const selectedElement = document.getElementById(`account-${account.id}`);
    if (selectedElement) {
      // Add initial selection effect
      selectedElement.classList.add("scale-95", "opacity-75");

      // Create the tearing effect container
      const container = document.createElement("div");
      container.className = "absolute inset-0 pointer-events-none z-30";
      container.innerHTML = `
        <!-- Main glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl opacity-0 animate-ping" style="animation-duration: 1.5s;"></div>
        
        <!-- Expanding shockwave circles -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full opacity-0 animate-ping" style="animation-delay: 0.1s; animation-duration: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-0 animate-ping" style="animation-delay: 0.2s; animation-duration: 1.2s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 animate-ping" style="animation-delay: 0.3s; animation-duration: 1.4s;"></div>
        
        <!-- Tearing effect - diagonal lines -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transform -rotate-45 translate-x-full animate-tear-line" style="animation-delay: 0.2s;"></div>
          <div class="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent transform -rotate-45 translate-x-full animate-tear-line" style="animation-delay: 0.3s;"></div>
          <div class="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent transform -rotate-45 translate-x-full animate-tear-line" style="animation-delay: 0.4s;"></div>
          <div class="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent transform -rotate-45 translate-x-full animate-tear-line" style="animation-delay: 0.5s;"></div>
          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent transform -rotate-45 translate-x-full animate-tear-line" style="animation-delay: 0.6s;"></div>
        </div>
        
        <!-- Sparkles and particles -->
        <div class="absolute top-1/4 left-1/4 w-6 h-6 bg-yellow-400 rounded-full animate-sparkle"></div>
        <div class="absolute bottom-1/4 right-1/4 w-5 h-5 bg-pink-400 rounded-full animate-sparkle" style="animation-delay: 0.2s;"></div>
        <div class="absolute top-3/4 left-3/4 w-4 h-4 bg-blue-400 rounded-full animate-sparkle" style="animation-delay: 0.4s;"></div>
        <div class="absolute top-1/3 right-3/4 w-3 h-3 bg-purple-400 rounded-full animate-sparkle" style="animation-delay: 0.6s;"></div>
        <div class="absolute bottom-1/3 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-sparkle" style="animation-delay: 0.8s;"></div>
        
        <!-- Explosion particles -->
        <div class="absolute top-1/2 left-1/4 text-2xl animate-explode">⭐</div>
        <div class="absolute top-1/3 right-1/3 text-xl animate-explode" style="animation-delay: 0.3s;">✨</div>
        <div class="absolute bottom-1/4 left-2/3 text-lg animate-explode" style="animation-delay: 0.6s;">🌟</div>
        <div class="absolute top-2/3 left-1/3 text-base animate-explode" style="animation-delay: 0.9s;">💫</div>
        <div class="absolute bottom-1/3 right-1/4 text-sm animate-explode" style="animation-delay: 1.2s;">🎊</div>
      `;
      selectedElement.appendChild(container);

      // Add floating effect to the mystery element
      const mysteryElement = selectedElement.querySelector(".w-24.h-24");
      if (mysteryElement) {
        mysteryElement.classList.add("animate-bounce");
        mysteryElement.classList.add("scale-125");
      }

      // Add rotation and tearing effect to the entire card
      selectedElement.classList.add("rotate-3", "animate-tear");

      // Remove effects after animation
      setTimeout(() => {
        selectedElement.classList.remove(
          "scale-95",
          "opacity-75",
          "rotate-3",
          "animate-tear"
        );
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
        if (mysteryElement) {
          mysteryElement.classList.remove("animate-bounce", "scale-125");
        }
      }, 2500);
    }

    // Add a delay for visual effect
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Process purchase using the proper API endpoint
    try {
      // First, we need to get the user ID by fetching the user profile
      let userId: string | null = null;
      try {
        const profileResponse = await userAPI.getProfile();
        userId = profileResponse.data.id;
      } catch (profileError) {
        console.error("Error fetching user profile:", profileError);
        alert("Bạn cần đăng nhập để thực hiện mua tài khoản");
        return;
      }

      if (!userId) {
        alert("Bạn cần đăng nhập để thực hiện mua tài khoản");
        return;
      }

      // Call the proper API endpoint for blind bag purchase
      const response = await saleAccountAPI.getBlindBag(userId, account.id);

      if (response.data.success) {
        // Update the selected account with the revealed account data
        const revealedAccount = response.data.item;
        setSelectedAccount(revealedAccount);
        
        // After successful blind bag selection, show the skin reveal modal
        setTimeout(() => {
          setShowSkinReveal(true);
        }, 100);
      } else {
        alert(response.data.message || "Failed to process purchase");
      }
    } catch (error: any) {
      console.error("Error processing purchase:", error);
      alert(error.response?.data?.message || "Failed to process purchase. Please try again.");
    }
  };

  // Handle purchase confirmation from skin reveal modal
  const handlePurchaseConfirm = async () => {
    const price = useCustomPrice ? customPrice : selectedPrice;
    if (!price || !selectedAccount) return;

    // Show the selected account details (in a real implementation, this would redirect to order page)
    setOpenedAccount(selectedAccount);
    setIsBoxOpened(true);
    setShowSkinReveal(false);
  };

  return {
    // State
    selectedPrice,
    customPrice,
    useCustomPrice,
    selectedAccount,
    isBoxOpened,
    openedAccount,
    showSkinReveal,
    accounts,
    total,
    page,
    pageSize,
    loading,
    error,
    
    // Functions
    setSelectedPrice,
    setCustomPrice,
    setUseCustomPrice,
    setSelectedAccount,
    setIsBoxOpened,
    setOpenedAccount,
    setShowSkinReveal,
    fetchAccountsByPrice,
    setPage,
    setPageSize,
    fetchAccounts,
    handlePriceSelect,
    handleCustomPriceChange,
    handleAccountSelection,
    handlePurchaseConfirm,
    PRICE_OPTIONS
  };
}