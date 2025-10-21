// Shared types used across the application

export interface CharacterSkin {
  character: string;
  skin: string;
  rarity: string;
  avatar: string;
  background: string;
}

export interface Account {
  id: string;
  rank: string | null;
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

export interface UserProfile {
  id: string;
  name: string | null;
  role: string;
  orders: Order[];
  balance?: number; // Optional balance field
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
}