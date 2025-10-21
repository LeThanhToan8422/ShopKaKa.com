"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRankLabel } from "@/lib/ranks";
import { saleAccountAPI } from "@/lib/api";
import { Account, CharacterSkin } from "@/app/types";
import { getRarityClasses } from "@/app/utils";

export default function useAccountDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [acc, setAcc] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await saleAccountAPI.getById(id);
        // Extract account data from the response
        const accountData = response.data?.item || response.data;
        if (mounted) setAcc(accountData);
      } catch {
        if (mounted) setAcc(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  
  useEffect(() => {
    if (!loading && acc) {
      setIsVisible(true);
    }
  }, [loading, acc]);

  const images: string[] = acc?.images || [];

  const characterSkins: CharacterSkin[] = acc?.characterSkins || [];

  const rankDisplay = getRankLabel(acc?.rank || undefined);

  const accountStats = {
    level: acc?.level || 1,
    skins: acc?.skinsCount,
    heroes: acc?.heroesCount,
    matches: acc?.matches || 0,
    winRate: acc?.winRate || 0,
    reputation: acc?.reputation || 0,
  };

  return {
    id,
    acc,
    loading,
    router,
    isVisible,
    images,
    characterSkins,
    rankDisplay,
    accountStats,
    getRarityClasses,
  };
}