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
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-64 h-64 cursor-pointer"
            onClick={handleOpen}>
            {/* Blind Box Container */}
            <div className="relative w-full h-full">
              {/* Box Shadow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-56 h-8 bg-black/20 rounded-full blur-md"></div>

              {/* Box */}
              <motion.div
                className="relative w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-xl shadow-2xl"
                whileHover={{ y: -10 }}>
                {/* Box Lid */}
                <motion.div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-t-lg"
                  animate={isOpening ? { rotateX: -90, y: -50 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-t-lg"></div>
                </motion.div>

                {/* Box Ribbon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-40 bg-gradient-to-b from-red-400 to-red-600 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-10 bg-gradient-to-r from-red-400 to-red-600 rounded-lg"></div>

                {/* Question Mark */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-white"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}>
                  ?
                </motion.div>

                {/* Sparkle effects */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping delay-300"></div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Xé túi mù Liên Quân
          </h3>
          <p className="text-gray-300 mb-6">
            Nhấn vào hộp quà để mở túi mù và nhận tài khoản ngẫu nhiên
          </p>
          <Button
            type="primary"
            size="large"
            className="bg-gradient-to-r from-pink-500 to-purple-600 border-0 px-8 py-5 text-lg font-bold"
            onClick={handleOpen}
            loading={isOpening}>
            {isOpening ? "Đang mở..." : "MỞ TÚI MÙ NGAY"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Opened state - reveal the account
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full max-w-4xl">
        <Card className="bg-white/10 backdrop-blur-lg border-0 rounded-3xl shadow-2xl overflow-hidden">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.8,
              }}
              className="inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-30"></div>
                <span className="text-4xl relative z-10">🎉</span>
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Chúc mừng bạn!
            </h2>
            <p className="text-gray-300">
              Bạn đã chọn thành công tài khoản với mệnh giá{" "}
              {account?.price?.toLocaleString("vi-VN")}đ
            </p>
          </div>

          {account && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white/5 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Thông tin tài khoản
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rank:</span>
                      <span className="text-white font-semibold">
                        {account.rank || "Chưa xác định"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Số tướng:</span>
                      <span className="text-white font-semibold">
                        {account.heroesCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Số skin:</span>
                      <span className="text-white font-semibold">
                        {account.skinsCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mệnh giá:</span>
                      <span className="text-green-400 font-bold text-lg">
                        {account.price?.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  {/* Highlight rare skins */}
                  <AnimatePresence>
                    {showSkins && topSkins.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-6">
                        <h4 className="text-lg font-bold text-white mb-3">
                          Skin nổi bật trong tài khoản
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {topSkins.map((skin, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.2 }}
                              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-3 border border-white/10 relative overflow-hidden">
                              {/* Shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>

                              <div className="relative z-10">
                                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-2 border-yellow-400">
                                  <Image
                                    src={skin.avatar}
                                    alt={skin.skin}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Text className="text-white font-bold text-sm block text-center">
                                  {skin.skin}
                                </Text>
                                <Text className="text-yellow-400 text-xs block text-center">
                                  {skin.rarity}
                                </Text>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Hướng dẫn nhận tài khoản
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                        1
                      </span>
                      <p>Đơn hàng của bạn đã được tạo thành công</p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                        2
                      </span>
                      <p>
                        Thông tin tài khoản sẽ được gửi đến email của bạn trong
                        vòng 5 phút
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                        3
                      </span>
                      <p>
                        Liên hệ hỗ trợ nếu không nhận được thông tin sau 10 phút
                      </p>
                    </div>
                  </div>

                  {/* Confetti effect placeholder */}
                  <div className="mt-6 h-24 relative">
                    <motion.div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full"
                      animate={{
                        y: [0, -100],
                        x: [0, Math.random() * 100 - 50],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                    <motion.div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-pink-400 rounded-full"
                      animate={{
                        y: [0, -80],
                        x: [0, Math.random() * 100 - 50],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        delay: Math.random() * 2 + 0.5,
                      }}
                    />
                    <motion.div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"
                      animate={{
                        y: [0, -120],
                        x: [0, Math.random() * 100 - 50],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        delay: Math.random() * 2 + 1,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center flex gap-4 justify-center">
                <Button
                  type="primary"
                  size="large"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 px-8 py-5 text-lg font-bold"
                  onClick={() => (window.location.href = "/profile")}>
                  XEM THÔNG TIN ĐƠN HÀNG
                </Button>
                <Button
                  size="large"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-5 text-lg font-bold"
                  onClick={() => window.location.reload()}>
                  MỞ TÚI MÙ KHÁC
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
