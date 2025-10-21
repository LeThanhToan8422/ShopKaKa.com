"use client";

import { useState, useEffect } from "react";
import type { CharacterSkin } from "@/app/types";

export default function useBlindBoxOpening(account: any) {
  const [isOpening, setIsOpening] = useState(false);
  const [showSkins, setShowSkins] = useState(false);

  // Parse character skins safely
  let characterSkins: CharacterSkin[] = [];
  if (account?.characterSkins) {
    try {
      const parsed = Array.isArray(account.characterSkins)
        ? account.characterSkins
        : JSON.parse(account.characterSkins);
      if (Array.isArray(parsed)) characterSkins = parsed;
    } catch {
      characterSkins = [];
    }
  }

  // Get top 3 rarest skins
  const topSkins = characterSkins
    .sort((a, b) => {
      const rarityOrder: Record<string, number> = {
        "SS+": 1,
        SSM: 2,
        SS: 3,
        "S+": 4,
        S: 5,
        A: 6,
      };

      const rarityA = a.rarity?.toUpperCase() || "";
      const rarityB = b.rarity?.toUpperCase() || "";

      return (rarityOrder[rarityA] || 99) - (rarityOrder[rarityB] || 99);
    })
    .slice(0, 3);

  // Show skins after a delay when account is revealed
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        setShowSkins(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [account]);

  return {
    isOpening,
    setIsOpening,
    showSkins,
    setShowSkins,
    topSkins,
    characterSkins
  };
}