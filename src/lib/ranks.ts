// Shared rank constants and utilities for the whole project
// Updated to match backend enum values

export type RankValue =
  | "DONG"
  | "BAC"
  | "VANG"
  | "BACH_KIM"
  | "KIM_CUONG"
  | "TINH_ANH"
  | "CAO_THU"
  | "CHIEN_TUONG"
  | "CHIEN_THAN"
  | "THACH_DAU";

export const RANK_LABELS: Record<RankValue, string> = {
  DONG: "Đồng",
  BAC: "Bạc",
  VANG: "Vàng",
  BACH_KIM: "Bạch Kim",
  KIM_CUONG: "Kim Cương",
  TINH_ANH: "Tinh Anh",
  CAO_THU: "Cao Thủ",
  CHIEN_TUONG: "Chiến Tướng",
  CHIEN_THAN: "Chiến Thần",
  THACH_DAU: "Thách Đấu",
};

export const RANK_VALUES: RankValue[] = Object.keys(RANK_LABELS) as RankValue[];

export const RANK_OPTIONS = RANK_VALUES.map((value) => ({
  value: RANK_LABELS[value],
  label: RANK_LABELS[value],
}));

export function getRankLabel(value?: string | null): string {
  if (!value) return "Chưa xác định";
  // First try to find by enum value
  if (value in RANK_LABELS) {
    return RANK_LABELS[value as RankValue];
  }
  // If not found, try to find by label (backward compatibility)
  const entry = Object.entries(RANK_LABELS).find(([_, label]) => label === value);
  if (entry) {
    return entry[1];
  }
  return value;
}