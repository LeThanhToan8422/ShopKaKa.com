"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Image as AntImage } from "antd";
import { CloseOutlined } from "@ant-design/icons";
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
        <div className="text-[10px] sm:text-xs leading-none text-center drop-shadow">
          {textTop}
        </div>
      </div>
    </div>
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

  // Sort skins by rarity
  const sortedSkins = [...skins].sort((a, b) => {
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
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-20px);
              }
              100% {
                transform: translateY(0px);
              }
            }

            .animate-float {
              animation: float 4s ease-in-out infinite;
            }
          `}</style>

          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-50"
            onClick={onClose}>
            <CloseOutlined className="text-2xl" />
          </button>

          {/* Navigation arrows */}
          {sortedSkins.length > 1 && (
            <>
              <button
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50 disabled:opacity-30"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSkin();
                }}
                disabled={currentIndex === 0}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50 disabled:opacity-30"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSkin();
                }}
                disabled={currentIndex === sortedSkins.length - 1}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Progress indicator */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
            {sortedSkins.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Main content */}
          <div
            className="relative w-full max-w-6xl h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}>
            {/* Account info header with enhanced reveal effect */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6 relative">
              {/* Confetti burst effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      y: [-100, -200 - Math.random() * 100],
                      x: [0, (Math.random() - 0.5) * 100],
                      rotate: [0, Math.random() * 360],
                    }}
                    transition={{
                      duration: 1 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                    }}>
                    {["✨", "⭐", "🌟", "💫", "🎊"][i % 5]}
                  </motion.div>
                ))}
              </div>

              <motion.h2
                className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 drop-shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.8 }}>
                CHÚC MỪNG BẠN!
              </motion.h2>
              <motion.p
                className="text-2xl text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                Bạn đã mở thành công túi mù
              </motion.p>
              <motion.div
                className="mt-4 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}>
                <p className="text-xl text-gray-400 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
                  Tài khoản:{" "}
                  <span className="font-bold text-yellow-300">
                    #{account?.id?.slice(0, 8)}...
                  </span>
                </p>
                <p className="text-xl text-gray-400 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
                  Mệnh giá:{" "}
                  <span className="font-bold text-green-400">
                    {account?.price?.toLocaleString("vi-VN")}₫
                  </span>
                </p>
              </motion.div>
            </motion.div>

            {/* Skin display area */}
            <div className="flex-1 w-full flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                {currentSkin && (
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.5,
                    }}
                    className="relative w-full max-w-4xl">
                    {/* Background with skin image */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-20 blur-3xl animate-pulse"
                      style={{
                        backgroundImage: currentSkin.background
                          ? `url(${currentSkin.background})`
                          : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    {/* Main skin card with account detail page styling */}
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl overflow-hidden">
                      {/* Animated glow effect */}
                      <div
                        className="absolute inset-0 rounded-3xl opacity-30 animate-pulse"
                        style={{
                          background: `radial-gradient(circle at center, ${
                            rarityClasses?.badge?.split(" ")[1] || "#f472b6"
                          }, transparent 70%)`,
                        }}></div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>

                      {/* Animated background particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(30)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-white/30"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              y: [0, -20, 0],
                              opacity: [0.3, 1, 0.3],
                              scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                              duration: 3 + Math.random() * 2,
                              repeat: Infinity,
                              delay: Math.random() * 2,
                            }}
                          />
                        ))}
                      </div>

                      {/* Corner decorative elements */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-yellow-400/50"></div>
                      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-yellow-400/50"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-yellow-400/50"></div>
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-yellow-400/50"></div>

                      <div className="flex flex-col lg:flex-row gap-8 items-center">
                        {/* Skin avatar with tilt effect */}
                        <motion.div
                          className="relative w-80 h-80 rounded-3xl overflow-hidden transition-all duration-500 group-hover:scale-105 relative z-10 tilt"
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                          onMouseMove={(e) => {
                            const target =
                              e.currentTarget.querySelector<HTMLDivElement>(
                                ".tilt"
                              );
                            if (!target) return;
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const px = (e.clientX - rect.left) / rect.width; // 0..1
                            const py = (e.clientY - rect.top) / rect.height; // 0..1
                            const rx = (0.5 - py) * 15; // max 15deg tilt X
                            const ry = (px - 0.5) * 15; // max 15deg tilt Y
                            target.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
                          }}
                          onMouseLeave={(e) => {
                            const target =
                              e.currentTarget.querySelector<HTMLDivElement>(
                                ".tilt"
                              );
                            if (target)
                              target.style.transform =
                                "rotateX(0deg) rotateY(0deg)";
                          }}
                          style={{
                            backgroundImage: currentSkin.background
                              ? `url(${currentSkin.background})`
                              : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}>
                          {/* Background overlay for better contrast */}
                          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/90 pointer-events-none" />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-sm"></div>

                          {/* Avatar image with enhanced reveal effect */}
                          <motion.div
                            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full overflow-hidden ${rarityClasses?.ring} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative z-10`}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                              delay: 0.3,
                            }}>
                            <div
                              className={`absolute inset-0 rounded-full ${rarityClasses?.ring} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md`}></div>
                            <AntImage
                              src={currentSkin.avatar}
                              alt={currentSkin.skin || "Skin"}
                              width={192}
                              height={192}
                              className="w-48 h-48 rounded-full object-cover relative z-10"
                              fallback="/favicon.ico"
                            />
                            {/* Pulsing glow effect */}
                            <motion.div
                              className={`absolute inset-0 rounded-full ${rarityClasses?.ring} opacity-50 blur-md`}
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                            />
                          </motion.div>

                          {/* Shine effect on avatar */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </motion.div>

                        {/* Skin details with account detail styling */}
                        <div className="flex-1 text-center lg:text-left">
                          <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}>
                            {/* Skin name with gradient text */}
                            <h3
                              className={`text-4xl font-extrabold bg-gradient-to-r ${rarityClasses?.badge} bg-clip-text text-transparent drop-shadow-sm mb-4`}>
                              {currentSkin.skin || "Unknown Skin"}
                            </h3>

                            {/* Character name with backplate effect */}
                            <div className="relative mb-6 inline-block overflow-hidden">
                              {/* Glow halo behind text */}
                              <span className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 h-8 rounded-full bg-gradient-to-r from-amber-300/25 via-rose-300/20 to-fuchsia-300/25 blur-md -z-10" />
                              {/* Backplate for contrast */}
                              <span
                                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-[2px] ring-1 ring-white/80 shadow-lg"
                                aria-hidden></span>
                              {/* Gradient text with stronger outline */}
                              <span
                                className={`relative z-10 text-2xl font-black tracking-wide bg-gradient-to-r ${rarityClasses?.badge} bg-clip-text text-transparent [text-shadow:0_1px_0_#fff,0_0_3px_rgba(0,0,0,.6),0_2px_10px_rgba(0,0,0,.35)]`}>
                                {currentSkin.character || "Unknown Character"}
                              </span>
                              {/* Shimmer sweep on hover */}
                              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent group-hover:translate-x-full duration-700 ease-linear" />
                            </div>

                            {/* Rarity badge with wings and animation */}
                            <motion.div
                              className="mb-8 flex justify-center lg:justify-start"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}>
                              <div className="relative">
                                {/* Animated glow behind badge */}
                                <motion.div
                                  className={`absolute inset-0 rounded-full blur-xl ${rarityClasses?.badge}`}
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                />
                                <RarityBadgeWing
                                  textTop={currentSkin.rarity || "N/A"}
                                  colorFrom={wingStyle.from}
                                  colorTo={wingStyle.to}
                                />
                              </div>
                            </motion.div>

                            {/* Stats with enhanced styling */}
                            <motion.div
                              className="flex flex-wrap gap-4 justify-center lg:justify-start"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.9 }}>
                              <motion.div
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg relative overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}>
                                {/* Animated background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                <p className="text-gray-400 text-sm mb-1 relative z-10">
                                  Vị trí
                                </p>
                                <p className="text-white font-bold text-xl relative z-10">
                                  #{currentIndex + 1} trong {sortedSkins.length}{" "}
                                  skin
                                </p>
                              </motion.div>
                              <motion.div
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg relative overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}>
                                {/* Animated background */}
                                <div
                                  className={`absolute inset-0 bg-gradient-to-r ${
                                    rarityClasses?.badge ||
                                    "from-gray-500/10 to-gray-600/10"
                                  } opacity-0 hover:opacity-100 transition-opacity duration-300`}></div>
                                <p className="text-gray-400 text-sm mb-1 relative z-10">
                                  Độ hiếm
                                </p>
                                <p
                                  className={`font-bold text-xl ${rarityClasses?.text} relative z-10`}>
                                  {rarityClasses ? "Cực hiếm" : "Hiếm"}
                                </p>
                              </motion.div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons with enhanced styling */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  size="large"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg font-bold rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={onClose}>
                  Đóng
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  type="primary"
                  size="large"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 px-8 py-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}>
                  <span className="relative z-10">Xem chi tiết tài khoản</span>
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    whileHover={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced confetti effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    "#fbbf24",
                    "#f472b6",
                    "#60a5fa",
                    "#34d399",
                    "#a78bfa",
                  ][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -150 - Math.random() * 200],
                  x: [0, (Math.random() - 0.5) * 200],
                  scale: [0, 1, 0],
                  rotate: [0, Math.random() * 360],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 1, 0.3],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4 + Math.random() * 6,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}>
                {["✨", "⭐", "🌟", "💫", "🎊"][i % 5]}
              </motion.div>
            ))}
          </div>

          {/* Animated gradient background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 animate-pulse"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
