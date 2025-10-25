import { ModalValues, SubmitPayload } from "../types";

/**
 * Creates the payload for API submission
 * @param values - Form values from the modal
 * @returns Formatted payload for API
 */
export const createPayload = (values: any): SubmitPayload => {
  return {
    rank: values.rank || undefined,
    price: Number(values.price),
    heroesCount: Number(values.heroesCount),
    skinsCount: Number(values.skinsCount),
    status: values.status,
    description: values.description || undefined,
    images: values.images || [],
    level: values.level ? Number(values.level) : 0,
    matches: values.matches ? Number(values.matches) : 0,
    winRate: values.winRate ? Number(values.winRate) : 0,
    reputation: values.reputation ? Number(values.reputation) : 0,
    gameUsername: values.gameUsername || undefined,
    gamePassword: values.gamePassword || undefined,
    loginMethod: values.loginMethod || undefined,
    additionalInfo: values.additionalInfo || undefined,
    characterSkins: values.characterSkins 
      ? values.characterSkins
          .filter((skin: any) => skin.id) // Only include skins that have an ID
          .map((skin: any) => skin.id) // Send only the ID
      : [],
  };
};