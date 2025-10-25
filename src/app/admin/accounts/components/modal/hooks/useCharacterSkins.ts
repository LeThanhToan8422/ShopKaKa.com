import { useState, useEffect } from "react";
import { characterSkinAPI } from "@/lib/api";
import { message } from "antd";
import { CharacterWithSkins, Skin } from "../../../types";

interface CharacterSkin {
  id: string;
  character: string;
  skin: string;
  rarity: string;
  avatar: string;
  background: string;
}

interface PaginatedResponse {
  content: CharacterSkin[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

const useCharacterSkins = (page: number = 0, size: number = 100) => {
  const [characterSkins, setCharacterSkins] = useState<CharacterWithSkins[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState<number>(0);

  useEffect(() => {
    const fetchCharacterSkins = async () => {
      try {
        setLoading(true);
        const response = await characterSkinAPI.getAll({ page, size });
        const data: PaginatedResponse = response.data;
        
        // Transform the data to group by character
        const groupedSkins: Record<string, Skin[]> = {};
        
        data.content.forEach(skin => {
          if (!groupedSkins[skin.character]) {
            groupedSkins[skin.character] = [];
          }
          // Transform CharacterSkin to Skin type
          groupedSkins[skin.character].push({
            id: skin.id,
            name: skin.skin,
            rarity: skin.rarity,
            avatar: skin.avatar,
            background: skin.background
          });
        });
        
        // Convert to the format expected by the existing code
        const transformedData: CharacterWithSkins[] = Object.entries(groupedSkins).map(([character, skins]) => ({
          name: character,
          skins: skins
        }));
        
        setCharacterSkins(transformedData);
        setTotalElements(data.totalElements);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching character skins:", err);
        setError("Failed to fetch character skins");
        message.error("Không thể tải danh sách character skins");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterSkins();
  }, [page, size]);

  return { characterSkins, loading, error, totalElements };
};

export default useCharacterSkins;