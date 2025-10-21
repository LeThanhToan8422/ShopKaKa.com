// Shared rank constants and utilities for the whole project

export type RankValue =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Conqueror"
  | "Grandmaster"
  | "Great Grandmaster"
  | "Commander"
  | "Warlord Supreme"
  | "Legendary";

export const RANK_LABELS: Record<RankValue, string> = {
  Bronze: "Đồng",
  Silver: "Bạc",
  Gold: "Vàng",
  Platinum: "Bạch Kim",
  Diamond: "Kim Cương",
  Conqueror: "Tinh Anh",
  Grandmaster: "Cao Thủ",
  "Great Grandmaster": "Đại Cao Thủ",
  Commander: "Chiến Tướng",
  "Warlord Supreme": "Chiến Thần",
  Legendary: "Thách Đấu",
};

export const RANK_VALUES: RankValue[] = Object.keys(RANK_LABELS) as RankValue[];

export const RANK_OPTIONS = RANK_VALUES.map((value) => ({
  value : RANK_LABELS[value],
  label: RANK_LABELS[value],
}));

export function getRankLabel(value?: string | null): string {
  if (!value) return "Chưa xác định";
  return (RANK_LABELS as Record<string, string>)[value] || value;
}
