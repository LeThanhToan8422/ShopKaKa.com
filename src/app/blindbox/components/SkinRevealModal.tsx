"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Image as AntImage } from "antd";
import { CloseOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { CharacterSkin } from "@/app/types";
import { getWingStyleByRarity, getModalRarityClasses as getRarityClasses } from "@/app/utils";

// RarityBadgeWing component adapted from the account detail page
function RarityBadgeWing({
  textTop,
  colorFrom = "from-rose-600",
  colorTo = "to-amber-500",
}: {
  textTop: string;
  colorFrom?: string;
  colorTo?: string;
}) {
  return (
    <div className="relative inline-flex items-center justify-center select-none">
      {/* Halo ring */}
      <div className="absolute -z-10 h-10 w-10 rounded-full border-2 border-white/40 shadow-[0_0_24px_rgba(255,255,255,0.25)]" />

      {/* Wings - layered */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2">
        <div className="relative h-8 w-10">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-8 bg-gradient-to-tr from-yellow-200 to-white rounded-l-full shadow-[inset_0_0_2px_rgba(0,0,0,0.2)]" />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-2 bg-yellow-300 rounded-full rotate-12" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-2 bg-yellow-200 rounded-full rotate-[18deg]" />
        </div>
      </div>
      <div className="absolute -right-10 top-1/2 -translate-y-1/2">
        <div className="relative h-8 w-10">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-8 bg-gradient-to-tl from-yellow-200 to-white rounded-r-full shadow-[inset_0_0_2px_rgba(0,0,0,0.2)]" />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-2 bg-yellow-300 rounded-full -rotate-12" />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-2 bg-yellow-200 rounded-full -rotate-[18deg]" />
        </div>
      </div>

      {/* Core badge with gold frame and inner pattern */}
      <div
        className={`relative px-5 py-2.5 text-white font-extrabold tracking-wide uppercase shadow-[0_8px_22px_rgba(0,0,0,0.25)] bg-gradient-to-r ${colorFrom} ${colorTo}`}>
        <div className="absolute -inset-1 rounded-md bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500 opacity-95 -z-10" />
        <div className="absolute inset-0.5 rounded-[6px] bg-gradient-to-r from-rose-700/90 to-amber-600/90 -z-10" />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-amber-300 shadow-[0_0_0_2px_rgba(255,255,255,0.5)]" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-amber-300 shadow-[0_0_0_2px_rgba(255,255,255,0.5)]" />
        <div className="absolute inset-0 rounded-[6px] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_2px,transparent_2px,transparent_6px)] pointer-events-none" />
        <motion.div 
          className="text-[10px] sm:text-xs leading-none text-center drop-shadow"
          animate={{ 
            textShadow: [
              "0 0 1px rgba(0,0,0,0.5)",
              "0 0 3px rgba(255,215,0,0.8)",
              "0 0 1px rgba(0,0,0,0.5)"
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity
          }}>
          {textTop}
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced SkinCard component with better animations and hover effects
function EnhancedSkinCard({ skin, isActive }: { skin: CharacterSkin; isActive: boolean }) {
  const rarityClasses = getRarityClasses(skin.rarity);
  const wingStyle = getWingStyleByRarity(skin.rarity);

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden border-4 transition-all duration-500 ${
        isActive 
          ? "border-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.6)] scale-105" 
          : "border-white/20 hover:border-white/40"
      }`}
      whileHover={{ 
        y: -10, 
        scale: 1.03,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}
      whileTap={{ scale: 0.98 }}
      layout
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}>
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${skin.background ? '' : rarityClasses?.badge} opacity-80`} />
      
      {/* Skin image */}
      <div className="relative z-10 p-6">
        <div className="flex flex-col items-center">
          {/* Character avatar */}
          <motion.div 
            className="relative mb-4"
            animate={isActive ? { 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut"
            }}>
            {skin.avatar ? (
              <AntImage
                src={skin.avatar}
                alt={`${skin.character} avatar`}
                className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg"
                preview={false}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-white/30 shadow-lg">
                <span className="text-white text-2xl font-bold">{skin.character?.charAt(0) || "?"}</span>
              </div>
            )}
            
            {/* Glow effect for active skin */}
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-30"></div>
            )}
          </motion.div>
          
          {/* Character name */}
          <motion.h3 
            className="text-xl font-bold text-white mb-1 text-center drop-shadow-lg"
            animate={isActive ? { 
              textShadow: [
                "0 0 5px rgba(255,255,255,0.5)",
                "0 0 20px rgba(255,215,0,0.8)",
                "0 0 5px rgba(255,255,255,0.5)"
              ]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: isActive ? Infinity : 0
            }}>
            {skin.character}
          </motion.h3>
          
          {/* Skin name */}
          <p className="text-gray-200 mb-3 text-center">{skin.skin}</p>
          
          {/* Rarity badge */}
          <div className="mb-4">
            <RarityBadgeWing
              textTop={skin.rarity || "N/A"}
              colorFrom={wingStyle.from}
              colorTo={wingStyle.to}
            />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-black/30 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-300">Nhân vật</div>
              <div className="text-white font-semibold truncate">{skin.character}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-300">Skin</div>
              <div className="text-white font-semibold truncate">{skin.skin}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:-translate-x-full transition-transform duration-1000 pointer-events-none" />
    </motion.div>
  );
}

export default function SkinRevealModal({
  isOpen,
  onClose,
  skins,
  account,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  skins: CharacterSkin[];
  account: any;
  onConfirm: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Process skins from account data - handle both array and string formats
  const processedSkins = useMemo(() => {
    if (!account) return [];
    
    // Handle characterSkins which might be a string or array
    let skinsData = account.characterSkins;
    
    if (typeof skinsData === 'string') {
      try {
        skinsData = JSON.parse(skinsData);
      } catch (e) {
        console.error("Error parsing characterSkins:", e);
        skinsData = [];
      }
    }
    
    if (!Array.isArray(skinsData)) {
      return [];
    }
    
    return skinsData;
  }, [account]);

  // Sort skins by rarity
  const sortedSkins = useMemo(() => {
    return [...processedSkins].sort((a, b) => {
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
    });
  }, [processedSkins]);

  // Reset index when account changes or modal closes
  useEffect(() => {
    if (!isOpen || sortedSkins.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= sortedSkins.length) {
      // If current index is out of bounds, reset to first skin
      setCurrentIndex(0);
    }
  }, [isOpen, sortedSkins.length, account?.id]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        nextSkin();
      } else if (e.key === "ArrowLeft") {
        prevSkin();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  const nextSkin = () => {
    if (isAnimating || currentIndex >= sortedSkins.length - 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSkin = () => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Reset index when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen || sortedSkins.length === 0) return null;

  const currentSkin = sortedSkins[currentIndex];
  const rarityClasses = currentSkin
    ? getRarityClasses(currentSkin.rarity)
    : null;
  const wingStyle = currentSkin
    ? getWingStyleByRarity(currentSkin.rarity)
    : { from: "from-rose-600", to: "to-amber-500" };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={onClose}>
          {/* Custom styles */}
          <style jsx>{`
            @keyframes float {
              0% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-20px) rotate(5deg);
              }
              100% {
                transform: translateY(0px) rotate(0deg);
              }
            }

            @keyframes pulse-glow {
              0% {
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
              }
              50% {
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
              }
              100% {
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
              }
            }

            .animate-float {
              animation: float 4s ease-in-out infinite;
            }
            
            .animate-pulse-glow {
              animation: pulse-glow 2s ease-in-out infinite;
            }
          `}</style>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-50 bg-black/30 rounded-full p-3 backdrop-blur-sm"
            onClick={onClose}>
            <motion.div
              animate={{ 
                rotate: [0, 20, -20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}>
              <CloseOutlined className="text-2xl" />
            </motion.div>
          </motion.button>

          {/* Navigation arrows */}
          {sortedSkins.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50 disabled:opacity-30 bg-black/30 rounded-full p-4 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSkin();
                }}
                disabled={currentIndex === 0}>
                <motion.div
                  animate={{ 
                    x: [-2, 2, -2]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity
                  }}>
                  <LeftOutlined className="text-2xl" />
                </motion.div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50 disabled:opacity-30 bg-black/30 rounded-full p-4 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSkin();
                }}
                disabled={currentIndex === sortedSkins.length - 1}>
                <motion.div
                  animate={{ 
                    x: [2, -2, 2]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity
                  }}>
                  <RightOutlined className="text-2xl" />
                </motion.div>
              </motion.button>
            </>
          )}

          {/* Main content */}
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-800/30 to-blue-800/30 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            
            {/* Header with animated badge */}
            <div className="p-6 text-center border-b border-white/10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4">
                <RarityBadgeWing
                  textTop={`${currentIndex + 1}/${sortedSkins.length}`}
                  colorFrom={wingStyle.from}
                  colorTo={wingStyle.to}
                />
              </motion.div>
              
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2">
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #a78bfa, #f472b6, #60a5fa, #f472b6, #a78bfa)",
                    backgroundSize: "300% 300%"
                  }}>
                  Skin đặc biệt trong tài khoản
                </motion.span>
              </motion.h2>
              
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  delay: 0.4,
                  duration: 3,
                  repeat: Infinity
                }}
                className="text-gray-300">
                Khám phá những skin hiếm có trong tài khoản bạn vừa mở
              </motion.p>
            </div>

            {/* Skin display */}
            <div className="p-6">
              {/* Current skin details */}
              <div className="flex flex-col lg:flex-row gap-8 items-center mb-8">
                {/* Skin image */}
                <motion.div
                  key={currentSkin?.character + currentSkin?.skin}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 flex justify-center">
                  <div className="relative">
                    <motion.div
                      className="w-64 h-64 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl animate-pulse-glow"
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}>
                      {currentSkin?.background ? (
                        <AntImage
                          src={currentSkin.background}
                          alt={`${currentSkin.character} - ${currentSkin.skin}`}
                          className="w-full h-full object-cover"
                          preview={false}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-6xl">?</span>
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Floating sparkle effects */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>
                  </div>
                </motion.div>

                {/* Skin details */}
                <motion.div
                  key={currentSkin?.character + currentSkin?.skin}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex-1">
                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        <motion.span
                          animate={{ 
                            textShadow: [
                              "0 0 2px rgba(255,255,255,0.3)",
                              "0 0 8px rgba(255,215,0,0.6)",
                              "0 0 2px rgba(255,255,255,0.3)"
                            ]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity
                          }}>
                          {currentSkin?.character}
                        </motion.span>
                      </h3>
                      <p className="text-xl text-gray-200">
                        <motion.span
                          animate={{ 
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity
                          }}>
                          {currentSkin?.skin}
                        </motion.span>
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <motion.span 
                          className="text-gray-300"
                          animate={{ 
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity
                          }}>
                          Độ hiếm:
                        </motion.span>
                        <motion.span 
                          className={`px-4 py-2 rounded-full font-bold text-white bg-gradient-to-r ${rarityClasses?.badge}`}
                          animate={{ 
                            textShadow: [
                              "0 0 2px rgba(255,255,255,0.3)",
                              "0 0 10px rgba(255,255,255,0.6)",
                              "0 0 2px rgba(255,255,255,0.3)"
                            ]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity
                          }}>
                          {currentSkin?.rarity || "N/A"}
                        </motion.span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4">
                        <motion.div 
                          className="text-gray-400 text-sm mb-1"
                          animate={{ 
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity
                          }}>
                          Nhân vật
                        </motion.div>
                        <motion.div 
                          className="text-white font-semibold"
                          animate={{ 
                            textShadow: [
                              "0 0 1px rgba(255,255,255,0.3)",
                              "0 0 4px rgba(255,255,255,0.6)",
                              "0 0 1px rgba(255,255,255,0.3)"
                            ]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity
                          }}>
                          {currentSkin?.character || "N/A"}
                        </motion.div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <motion.div 
                          className="text-gray-400 text-sm mb-1"
                          animate={{ 
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity
                          }}>
                          Skin
                        </motion.div>
                        <motion.div 
                          className="text-white font-semibold truncate"
                          animate={{ 
                            textShadow: [
                              "0 0 1px rgba(255,255,255,0.3)",
                              "0 0 4px rgba(255,255,255,0.6)",
                              "0 0 1px rgba(255,255,255,0.3)"
                            ]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity
                          }}>
                          {currentSkin?.skin || "N/A"}
                        </motion.div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-700/30 to-pink-700/30 rounded-xl p-4 border border-purple-500/30">
                      <div className="flex items-center">
                        <div className="mr-3 text-yellow-400">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                        </div>
                        <div>
                          <motion.div 
                            className="text-gray-300 text-sm"
                            animate={{ 
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity
                            }}>
                            Độ hiếm
                          </motion.div>
                          <motion.div 
                            className="text-white font-semibold"
                            animate={{ 
                              textShadow: [
                                "0 0 1px rgba(255,255,255,0.3)",
                                "0 0 4px rgba(255,215,0,0.6)",
                                "0 0 1px rgba(255,255,255,0.3)"
                              ]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity
                            }}>
                            {currentSkin?.rarity || "N/A"}
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* All skins grid - horizontal scrollable */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-white/20">
                  Tất cả skin trong tài khoản
                </h3>
                <div className="relative">
                  <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {sortedSkins.map((skin, index) => (
                      <div key={`${skin.character}-${skin.skin}`} className="flex-shrink-0 w-64">
                        <EnhancedSkinCard 
                          skin={skin} 
                          isActive={index === currentIndex} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="large"
                    className="bg-gradient-to-r from-green-600 to-emerald-700 border-0 px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 w-full sm:w-auto"
                    onClick={onConfirm}>
                    <span className="text-white">
                      <motion.span
                        animate={{ 
                          textShadow: [
                            "0 0 2px rgba(255,255,255,0.3)",
                            "0 0 10px rgba(16,185,129,0.8)",
                            "0 0 2px rgba(255,255,255,0.3)"
                          ]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity
                        }}>
                        TIẾP TỤC
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="large"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 w-full sm:w-auto"
                    onClick={onClose}>
                    <span className="text-white">
                      <motion.span
                        animate={{ 
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity
                        }}>
                        ĐÓNG
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}