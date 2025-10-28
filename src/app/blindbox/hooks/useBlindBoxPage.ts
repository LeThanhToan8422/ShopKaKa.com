"use client";

import { useState } from "react";
import { saleAccountAPI, userAPI } from '@/lib/api';

export default function useBlindBoxPage() {
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isBoxOpened, setIsBoxOpened] = useState(false);
  const [openedAccount, setOpenedAccount] = useState<any>(null);
  const [showSkinReveal, setShowSkinReveal] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{accountId: string, blindBoxId: string} | null>(null);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
  const [flipSequenceIndex, setFlipSequenceIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [revealComplete, setRevealComplete] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  };

  // Handle account selection - initiate tear process
  const handleAccountSelection = async (accountId: string, blindBoxId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login page with callback URL
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`;
      }
      return;
    }
    
    // Set the pending selection and show confirmation modal
    setPendingSelection({ accountId, blindBoxId });
    setShowConfirmModal(true);
  };

  // Handle confirmation of account selection
  const confirmAccountSelection = async () => {
    if (!pendingSelection) return;
    
    const { accountId, blindBoxId } = pendingSelection;
    setShowConfirmModal(false);
    setPendingSelection(null);
    
    // Add a dramatic "tearing" animation effect
    const selectedElement = document.getElementById(`account-${accountId}`);
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

    // Process tear using the new API endpoint
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

      // Call the new API endpoint for blind box tear
      const response = await saleAccountAPI.tearBlindBox({
        owner: userId,
        accountId: accountId,
        blindBoxId
      });

      if (response.data.success) {
        // Update the selected account with the revealed account data
        const revealedAccount = response.data.item;
        setSelectedAccount(revealedAccount);
        
        // After successful blind box tear, show the skin reveal modal
        setTimeout(() => {
          setShowSkinReveal(true);
        }, 100);
      } else {
        alert(response.data.message || "Failed to process tear");
      }
    } catch (error: any) {
      console.error("Error processing tear:", error);
      alert(error.response?.data?.message || "Failed to process tear. Please try again.");
    }
  };

  // Start the card flipping sequence
  const startCardFlipping = () => {
    if (!selectedAccount || !selectedAccount.characterSkins) return;
    
    const skinsData = selectedAccount.characterSkins;
    if (!Array.isArray(skinsData)) return;
    
    setIsFlipping(true);
  };

  // Handle sequential flipping
  const handleFlipSequence = () => {
    if (!isFlipping || flipSequenceIndex >= flippedCards.length) {
      if (flipSequenceIndex >= flippedCards.length && flippedCards.length > 0) {
        setRevealComplete(true);
      }
      return;
    }
    
    setTimeout(() => {
      setFlippedCards(prev => {
        const newFlipped = [...prev];
        newFlipped[flipSequenceIndex] = true;
        return newFlipped;
      });
      setFlipSequenceIndex(prev => prev + 1);
    }, 800); // Flip each card with 800ms delay
  };

  // Reset card flipping state
  const resetCardFlipping = () => {
    setFlippedCards([]);
    setFlipSequenceIndex(0);
    setIsFlipping(false);
    setRevealComplete(false);
  };

  // Cancel account selection
  const cancelAccountSelection = () => {
    setShowConfirmModal(false);
    setPendingSelection(null);
  };

  // Set accounts when a blind box is selected
  const setAccountsFromBlindBox = (saleAccountIds: string[]) => {
    // Convert the array of IDs to account objects with just the ID for now
    // In a real implementation, you might want to fetch the full account details
    const accountObjects = saleAccountIds.map(id => ({ id }));
    setAccounts(accountObjects);
  };

  // Handle purchase confirmation from skin reveal
  const handlePurchaseConfirm = async () => {
    // Close the skin reveal modal
    setShowSkinReveal(false);
    resetCardFlipping();
    
    // Redirect to profile page with accounts tab selected
    if (typeof window !== 'undefined') {
      window.location.href = '/profile?tab=accounts';
    }
  };

  // Function to refresh blind box data from API after purchase
  const refreshBlindBoxData = async (blindBoxId: string) => {
    try {
      setLoading(true);
      const response = await saleAccountAPI.getBlindBoxById(blindBoxId);
      if (response.data && response.data.item) {
        return response.data.item;
      }
    } catch (err: any) {
      console.error("Error refreshing blind box data:", err);
      setError("Không thể làm mới dữ liệu túi mù. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
    return null;
  };

  return {
    // State
    selectedAccount,
    isBoxOpened,
    openedAccount,
    showSkinReveal,
    accounts,
    loading,
    error,
    showConfirmModal,
    pendingSelection,
    flippedCards,
    flipSequenceIndex,
    isFlipping,
    revealComplete,
    
    // Functions
    setSelectedAccount,
    setIsBoxOpened,
    setOpenedAccount,
    setShowSkinReveal,
    setAccountsFromBlindBox,
    handleAccountSelection,
    confirmAccountSelection,
    cancelAccountSelection,
    handlePurchaseConfirm,
    refreshBlindBoxData,
    setLoading,
    startCardFlipping,
    handleFlipSequence,
    resetCardFlipping,
  };
}