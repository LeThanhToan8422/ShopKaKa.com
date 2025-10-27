"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button, Card, Typography, Image } from "antd";
import useBlindBoxOpening from "../hooks/useBlindBoxOpening";

const { Title, Text } = Typography;

export default function BlindBoxOpening({
  isOpen,
  onOpen,
  account,
}: {
  isOpen: boolean;
  onOpen: () => void;
  account: any;
}) {
  const { isOpening, setIsOpening, showSkins, topSkins, characterSkins } = useBlindBoxOpening(account);

  const handleOpen = () => {
    setIsOpening(true);
    // Simulate opening animation
    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 3000);
  };

  // Show skins is now handled in the hook

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.5 
          }}
          className="relative">
          <motion.div
            whileHover={{ scale: 1.1, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="w-72 h-72 cursor-pointer"
            onClick={handleOpen}>
            {/* Blind Box Container */}
            <div className="relative w-full h-full">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              
              {/* Box Shadow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-10 bg-black/30 rounded-full blur-md"></div>

              {/* Box */}
              <motion.div
                className="relative w-full h-full bg-gradient-to-br from-purple-700 via-pink-600 to-red-600 rounded-2xl shadow-2xl overflow-hidden border-4 border-white/30"
                whileHover={{ y: -15 }}>
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                
                {/* Box Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-1/4 bg-white/20"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1/4 bg-white/20"></div>
                  <div className="absolute top-1/4 left-0 w-full h-px bg-white/30"></div>
                  <div className="absolute top-2/4 left-0 w-full h-px bg-white/30"></div>
                  <div className="absolute top-3/4 left-0 w-full h-px bg-white/30"></div>
                </div>
                
                {/* Box Lid */}
                <motion.div
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-48 h-10 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-t-xl shadow-lg border-2 border-yellow-300"
                  animate={isOpening ? { rotateX: -90, y: -60 } : {}}
                  transition={{ duration: 1.2, delay: 0.5 }}>
                  <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-300 to-yellow-200 rounded-t-xl"></div>
                  {/* Ribbon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-1.5 bg-red-500 rounded-full"></div>
                </motion.div>

                {/* Box Ribbon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-48 bg-gradient-to-b from-red-400 to-red-600 rounded-lg shadow-inner"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-lg shadow-inner"></div>

                {/* Question Mark */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl font-bold text-white drop-shadow-lg"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}>
                  ?
                </motion.div>

                {/* Sparkle effects */}
                <div className="absolute top-6 left-6 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                <div className="absolute bottom-8 right-8 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
                <div className="absolute top-1/3 right-10 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center">
          <motion.h3 
            className="text-3xl font-bold text-white mb-3"
            animate={{ 
              textShadow: [
                "0 0 5px rgba(255,255,255,0.5)",
                "0 0 20px rgba(255,215,0,0.8)",
                "0 0 5px rgba(255,255,255,0.5)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}>
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500"
              style={{
                backgroundImage: "linear-gradient(90deg, #fbbf24, #f97316, #ec4899, #f97316, #fbbf24)",
                backgroundSize: "300% 300%"
              }}>
              Xé túi mù Liên Quân
            </motion.span>
          </motion.h3>
          <motion.p 
            className="text-gray-200 text-lg mb-8"
            animate={{ 
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}>
            Nhấn vào hộp quà để mở túi mù và nhận tài khoản ngẫu nhiên
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 border-0 px-10 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] transition-all duration-300"
              onClick={handleOpen}
              loading={isOpening}>
              {isOpening ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">🌀</span>
                  Đang mở...
                </div>
              ) : (
                "MỞ TÚI MÙ NGAY"
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Opened state - reveal the account
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.8 
      }}
      className="flex flex-col items-center justify-center min-h-[500px]">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full max-w-5xl">
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg border-0 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.8,
              }}
              className="inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center relative shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-40"></div>
                <motion.span 
                  className="text-5xl relative z-10"
                  animate={{ 
                    rotate: [0, 20, -20, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}>
                  🎉
                </motion.span>
              </div>
            </motion.div>
            <motion.h2 
              className="text-4xl font-bold text-white mb-3"
              animate={{ 
                textShadow: [
                  "0 0 5px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,215,0,0.8)",
                  "0 0 5px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity
              }}>
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500"
                style={{
                  backgroundImage: "linear-gradient(90deg, #fbbf24, #f97316, #ec4899, #f97316, #fbbf24)",
                  backgroundSize: "300% 300%"
                }}>
                Chúc mừng bạn!
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-gray-200 text-xl"
              animate={{ 
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}>
              Bạn đã chọn thành công tài khoản với mệnh giá{" "}
              <motion.span 
                className="text-yellow-400 font-bold"
                animate={{ 
                  textShadow: [
                    "0 0 2px rgba(255,255,255,0.3)",
                    "0 0 10px rgba(255,215,0,0.8)",
                    "0 0 2px rgba(255,255,255,0.3)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}>
                {account?.price?.toLocaleString("vi-VN")}đ
              </motion.span>
            </motion.p>
          </div>

          {account && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <motion.h3 
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-2xl font-bold mb-6 pb-2 border-b border-white/20">
                Thông tin tài khoản
              </motion.h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <motion.span 
                    className="text-gray-300 flex items-center"
                    animate={{ 
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity
                    }}>
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
                    Rank:
                  </motion.span>
                  <motion.span 
                    className="text-white font-semibold text-lg"
                    animate={{ 
                      textShadow: [
                        "0 0 2px rgba(255,255,255,0.3)",
                        "0 0 8px rgba(192,132,252,0.6)",
                        "0 0 2px rgba(255,255,255,0.3)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}>
                    {account.rank || "Chưa xác định"}
                  </motion.span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <motion.span 
                    className="text-gray-300 flex items-center"
                    animate={{ 
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity
                    }}>
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                    Số tướng:
                  </motion.span>
                  <motion.span 
                    className="text-white font-semibold text-lg"
                    animate={{ 
                      textShadow: [
                        "0 0 2px rgba(255,255,255,0.3)",
                        "0 0 8px rgba(96,165,250,0.6)",
                        "0 0 2px rgba(255,255,255,0.3)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}>
                    {account.heroesCount || 0}
                  </motion.span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <motion.span 
                    className="text-gray-300 flex items-center"
                    animate={{ 
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity
                    }}>
                    <span className="w-3 h-3 bg-pink-500 rounded-full mr-3 animate-pulse"></span>
                    Số skin:
                  </motion.span>
                  <motion.span 
                    className="text-white font-semibold text-lg"
                    animate={{ 
                      textShadow: [
                        "0 0 2px rgba(255,255,255,0.3)",
                        "0 0 8px rgba(244,114,182,0.6)",
                        "0 0 2px rgba(255,255,255,0.3)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}>
                    {account.skinsCount || 0}
                  </motion.span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                  <motion.span 
                    className="text-gray-300 flex items-center"
                    animate={{ 
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity
                    }}>
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></span>
                    Mệnh giá:
                  </motion.span>
                  <motion.span 
                    className="text-yellow-400 font-bold text-2xl"
                    animate={{ 
                      textShadow: [
                        "0 0 2px rgba(255,255,255,0.3)",
                        "0 0 12px rgba(255,215,0,0.8)",
                        "0 0 2px rgba(255,255,255,0.3)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}>
                    {account.price ? `${account.price?.toLocaleString("vi-VN")}đ` : "Chưa xác định"}
                  </motion.span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <motion.span 
                    className="text-gray-300 flex items-center"
                    animate={{ 
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity
                    }}>
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                    Tên đăng nhập:
                  </motion.span>
                  <motion.span 
                    className="text-white font-semibold text-lg"
                    animate={{ 
                      textShadow: [
                        "0 0 2px rgba(255,255,255,0.3)",
                        "0 0 8px rgba(72,187,120,0.6)",
                        "0 0 2px rgba(255,255,255,0.3)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}>
                    {account.gameUsername || "Chưa xác định"}
                  </motion.span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <motion.span 
                    className="text-gray-300 flex items-center"
                    animate={{ 
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity
                    }}>
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
                    Mật khẩu:
                  </motion.span>
                  <motion.span 
                    className="text-white font-semibold text-lg"
                    animate={{ 
                      textShadow: [
                        "0 0 2px rgba(255,255,255,0.3)",
                        "0 0 8px rgba(239,68,68,0.6)",
                        "0 0 2px rgba(255,255,255,0.3)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}>
                    {account.gamePassword ? "••••••••" : "Chưa xác định"}
                  </motion.span>
                </div>
              </div>

              {/* Highlight rare skins */}
              <AnimatePresence>
                {characterSkins && characterSkins.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-8">
                    <h4 className="text-xl font-bold text-white mb-4 pb-2 border-b border-white/20">
                      Skin nổi bật trong tài khoản
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {characterSkins.map((skin: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.2 }}
                          whileHover={{ y: -5, scale: 1.03 }}
                          className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-xl p-4 border border-white/10 backdrop-blur-sm hover:shadow-lg hover:border-yellow-400/50 transition-all duration-300">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold mr-3">
                              {skin.rarity?.charAt(0) || "?"}
                            </div>
                            <div>
                              <div className="text-white font-semibold">{skin.character}</div>
                              <div className="text-gray-400 text-sm">{skin.skin}</div>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              skin.rarity === "SS+" ? "bg-gradient-to-r from-red-500 to-pink-500" :
                              skin.rarity === "SSM" ? "bg-gradient-to-r from-purple-500 to-indigo-500" :
                              skin.rarity === "SS" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                              skin.rarity === "S+" ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                              "bg-gradient-to-r from-gray-500 to-gray-600"
                            } text-white`}>
                              {skin.rarity || "N/A"}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          <div className="mt-8 text-center flex gap-6 justify-center flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300"
                onClick={() => (window.location.href = "/profile")}>
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
                  XEM TÀI KHOẢN CỦA TÔI
                </motion.span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="large"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300"
                onClick={() => (window.location.href = "/")}>
                <motion.span
                  animate={{ 
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}>
                  TIẾP TỤC MUA HÀNG
                </motion.span>
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );

}
