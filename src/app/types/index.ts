// Shared types used across the application

import { RankValue } from "@/lib/ranks";

export interface CharacterSkin {
  character: string;
  skin: string;
  rarity: string;
  avatar: string;
  background: string;
}

export interface Account {
  id: string;
  rank: RankValue | null;
  price: number;
  heroesCount: number;
  skinsCount: number;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  characterSkins?: CharacterSkin[];
  gameUsername: string | null;
  gamePassword: string | null;
  loginMethod: string | null;
  additionalInfo: string | null;
  images: string[]; // New field for account images
  owner: string;
  blindBoxId: string;
  level: number;
  matches: number;
  winRate: number;
  reputation: number;
  // Add other fields as needed
}

// New type for blind box
export interface BlindBox {
  id: string;
  name: string;
  price?: number; // Add price field
  saleAccounts: string[]; // Array of account IDs
}

export interface UserProfile {
  id: string;
  name: string | null;
  role: string;
  orders: Order[];
  balance: number;
}

export interface Order {
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
}

export interface UpdateProfileData {
  name: string;
}

export interface ProfileStatistics {
  totalOrders: number;
  completedOrders: number;
  totalSpent: number;
  pendingOrders: number;
  cancelledOrders: number;
  balance: number;
}