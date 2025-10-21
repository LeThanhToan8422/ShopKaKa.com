"use client";

import { Image as AntImage } from "antd";
import { motion } from "framer-motion";
import type { CharacterSkin } from "@/app/types";
import { getWingStyleByRarity, getRarityClasses } from "@/app/utils";

export default function SkinDisplay({
  skins,
  position = "center",
}: {
  skins: CharacterSkin[];
  position?:
    | "center"
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";
}) {
  if (!skins?.length) return null;

  // Get top 3 rarest skins
  const topSkins = [...skins]
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

  // Position classes
  const positionClasses = {
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div className={`absolute z-20 ${positionClasses[position]}`}>
      {/* Carousel-like display for multiple skins */}
      <div className="relative">
        {topSkins.map((skin, index) => {
          const rc = getRarityClasses(skin.rarity);

          // Calculate position based on index to avoid overlap
          const positionStyle = {
            transform: `translate(${index * 10}px, ${index * 10}px)`,
            zIndex: 30 - index,
          };

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="absolute"
              style={positionStyle}>
              {/* Glow effect */}
              <div
                className={`absolute -inset-1 rounded-2xl ${rc.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md`}></div>

              {/* Main card */}
              <div
                className={`relative rounded-2xl p-3 backdrop-blur-sm border border-white/40 shadow-lg min-w-[120px] bg-gradient-to-br from-white/80 via-white/70 to-white/90 ${rc.ring}`}
                style={{
                  backgroundImage: skin.background
                    ? `url(${skin.background})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "120px",
                }}>
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-sm"></div>

                <div className="relative z-10">
                  {/* Avatar */}
                  <div
                    className={`mx-auto mb-2 w-12 h-12 rounded-full overflow-hidden ${rc.ring} transition-all duration-500 group-hover:scale-110 relative`}>
                    <div
                      className={`absolute inset-0 rounded-full ${rc.ring} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md`}></div>
                    <AntImage
                      src={skin.avatar}
                      alt={skin.character || "avatar"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover relative z-10"
                      fallback="/favicon.ico"
                      preview={false}
                    />
                  </div>

                  {/* Skin name */}
                  <div
                    className={`text-xs font-extrabold bg-gradient-to-r ${rc.badge} bg-clip-text text-transparent drop-shadow-sm mb-1 text-center truncate`}>
                    {skin.skin || "Default"}
                  </div>

                  {/* Character name */}
                  <div className="text-[10px] font-bold text-gray-700 text-center truncate">
                    {skin.character || "Unknown"}
                  </div>

                  {/* Rarity badge */}
                  <div className="mt-1 flex justify-center">
                    <div
                      className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${rc.badge} text-white`}>
                      {skin.rarity || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Counter for total skins if more than 3 */}
      {skins.length > 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
          +{skins.length - 3} skins khác
        </motion.div>
      )}
    </div>
  );
}
