"use client";

import React from "react";
import {
  Card,
  Button,
  Typography,
  Spin,
  Alert,
  Select,
  InputNumber,
  Row,
  Col,
  Empty,
  Space,
} from "antd";
import { motion } from "framer-motion";
import Image from "next/image";
import useBlindBoxPage from "./hooks/useBlindBoxPage";
import BlindBoxOpening from "./components/BlindBoxOpening";
import SkinDisplay from "./components/SkinDisplay";
import SkinRevealModal from "./components/SkinRevealModal";

const { Title, Text } = Typography;
const { Option } = Select;

export default function BlindBoxPage() {
  const {
    // State
    selectedPrice,
    customPrice,
    useCustomPrice,
    selectedAccount,
    isBoxOpened,
    openedAccount,
    showSkinReveal,
    accounts,
    total,
    page,
    pageSize,
    loading,
    error,
    PRICE_OPTIONS,
    
    // Functions
    setSelectedPrice,
    setCustomPrice,
    setUseCustomPrice,
    setSelectedAccount,
    setIsBoxOpened,
    setOpenedAccount,
    setShowSkinReveal,
    fetchAccountsByPrice,
    setPage,
    setPageSize,
    fetchAccounts,
    handlePriceSelect,
    handleCustomPriceChange,
    handleAccountSelection,
    handlePurchaseConfirm,
  } = useBlindBoxPage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced visual effects */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative">
          {/* Animated background elements */ }
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}></div>
          </div>

          <Title
            level={1}
            className="text-4xl md:text-6xl font-bold text-white mb-6 relative z-10">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 drop-shadow-lg">
              XÉ TÚI MÙ LIÊN QUÂN
            </span>
            <motion.div
              className="inline-block ml-4"
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}>
              🎁
            </motion.div>
          </Title>
          <Text className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto relative z-10">
            Trải nghiệm cảm giác hồi hộp khi mở túi mù! Chọn mệnh giá và nhận
            ngẫu nhiên một tài khoản chất lượng cao.
          </Text>

          {/* Decorative elements */ }
          <div className="flex justify-center mt-6 space-x-4">
            <motion.div
              className="text-3xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}>
              ⭐
            </motion.div>
            <motion.div
              className="text-3xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
              🌟
            </motion.div>
            <motion.div
              className="text-3xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
              ✨
            </motion.div>
          </div>
        </motion.div>

        {/* Selection Panel */ }
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-0 rounded-3xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 w-full">
                <Text className="text-white text-lg font-semibold block mb-3">
                  Chọn mệnh giá:
                </Text>
                <Space direction="vertical" className="w-full">
                  <Select
                    size="large"
                    placeholder="Chọn mệnh giá tài khoản"
                    className="w-full custom-select"
                    onChange={handlePriceSelect}
                    value={useCustomPrice ? undefined : selectedPrice}
                    allowClear
                    onClear={() => {
                      setSelectedPrice(null);
                      setUseCustomPrice(false);
                    }}>
                    {PRICE_OPTIONS.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                  
                  <div className="flex items-center gap-2">
                    <Text className="text-white">Hoặc nhập giá trị:</Text>
                    <InputNumber
                      size="large"
                      placeholder="Nhập mệnh giá"
                      className="flex-1 custom-input"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                      addonAfter="₫"
                      min={1000}
                      step={1000}
                      value={useCustomPrice ? customPrice : undefined}
                      onChange={handleCustomPriceChange}
                    />
                  </div>
                </Space>
              </div>

              <div className="w-full md:w-auto">
                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 border-0 h-12 text-lg font-bold mt-6 md:mt-0"
                  onClick={fetchAccounts}
                  disabled={!(selectedPrice || customPrice)}>
                  TÌM TÀI KHOẢN
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Blind Box Opening */ }
        {selectedPrice && isBoxOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12">
            <BlindBoxOpening
              isOpen={isBoxOpened}
              onOpen={() => {}}
              account={openedAccount}
            />
          </motion.div>
        )}

        {/* Purchase Panel */ }
        {(selectedPrice || customPrice) && accounts.length > 0 && !isBoxOpened && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12">
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-0 rounded-3xl shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <Title level={3} className="text-white mb-2">
                    Sẵn sàng xé túi mù!
                  </Title>
                  <Text className="text-gray-200">
                    Bạn sẽ nhận ngẫu nhiên 1 tài khoản mệnh giá{" "}
                    {(useCustomPrice ? customPrice : selectedPrice)?.toLocaleString("vi-VN")}đ
                  </Text>
                </div>
                <Text className="text-gray-200 text-lg">
                  Chọn một tài khoản từ danh sách dưới đây để mua
                </Text>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Error Message */ }
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8">
            <Alert
              message="Lỗi"
              description={error}
              type="error"
              showIcon
              className="rounded-2xl"
            />
          </motion.div>
        )}

        {/* Loading Spinner */ }
        {loading && (
          <div className="flex justify-center my-12">
            <Spin size="large" className="text-white" />
          </div>
        )}

        {/* Accounts Grid */ }
        {!loading && accounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <Title level={2} className="text-2xl font-bold text-white mb-6">
              Chọn tài khoản bạn muốn mua
            </Title>
            <Text className="text-gray-300 mb-6 block">
              Tất cả tài khoản dưới đây đều có cùng mệnh giá. Hãy chọn một tài
              khoản để xem chi tiết và mua ngay!
            </Text>
            <Row gutter={[24, 24]}>
              {accounts.map((acc, index) => {
                return (
                  <Col key={acc.id} xs={24} sm={12} lg={8} xl={6}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="relative cursor-pointer"
                      id={`account-${acc.id}`}
                      onClick={() => handleAccountSelection(acc)}>
                      <div className="group bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/10 transition-all duration-500 hover:shadow-2xl hover:border-yellow-400/50 hover:scale-105 relative z-0">
                        {/* Sparkle effect container */ }
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse delay-300"></div>
                          <div className="absolute top-1/2 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse delay-500"></div>
                        </div>

                        {/* Mysterious Card Front */ }
                        <div className="relative h-80 overflow-hidden">
                          {/* Animated background */ }
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-pulse"></div>

                          {/* Floating particles */ }
                          <div className="absolute inset-0">
                            <div
                              className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float"
                              style={{ animationDelay: "0s" }}></div>
                            <div
                              className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-white/30 rounded-full animate-float"
                              style={{ animationDelay: "0.5s" }}></div>
                            <div
                              className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/25 rounded-full animate-float"
                              style={{ animationDelay: "1s" }}></div>
                            <div
                              className="absolute top-1/3 right-3/4 w-2 h-2 bg-white/15 rounded-full animate-float"
                              style={{ animationDelay: "1.5s" }}></div>
                          </div>

                          {/* Question Mark Pattern */ }
                          <div className="absolute inset-0 opacity-20">
                            {[...Array(20)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute text-4xl text-white/30 animate-pulse-grow"
                                style={{
                                  left: `${Math.random() * 100}%`,
                                  top: `${Math.random() * 100}%`,
                                  animationDelay: `${Math.random() * 2}s`,
                                }}>
                                ?
                              </div>
                            ))}
                          </div>

                          {/* Central Mystery Element - Enhanced Box Design */ }
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              className="relative w-32 h-32 flex items-center justify-center"
                              animate={{
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                              }}>
                              {/* Outer glow */ }
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 opacity-70 blur-md animate-pulse"></div>

                              {/* Main box */ }
                              <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/30">
                                {/* Box pattern */ }
                                <div className="absolute inset-0 opacity-20">
                                  <div className="absolute top-0 left-0 w-full h-1/3 bg-white/30"></div>
                                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white/30"></div>
                                  <div className="absolute top-1/3 left-0 w-full h-px bg-white/50"></div>
                                  <div className="absolute top-2/3 left-0 w-full h-px bg-white/50"></div>
                                </div>

                                {/* Box lid with ribbon */ }
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-t-md flex items-center justify-center">
                                  <div className="w-12 h-1 bg-yellow-300 rounded-full"></div>
                                </div>

                                {/* Shine effect */ }
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                {/* Question mark */ }
                                <span className="text-4xl text-white font-bold relative z-10 drop-shadow-lg">
                                  ?
                                </span>
                              </div>
                            </motion.div>
                          </div>

                          {/* Shine Effect */ }
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                        </div>

                        {/* Content */ }
                        <div className="p-4 bg-black/20 relative z-10">
                          <div className="flex justify-between items-center mb-2">
                            <Text className="text-white font-bold text-xl">
                              {new Intl.NumberFormat("vi-VN").format(acc.price)}
                              ₫
                            </Text>
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                          </div>

                          <Text className="text-gray-300 text-sm block mb-3">
                            Tài khoản Liên Quân Mobile
                          </Text>

                          <div className="flex justify-between items-center">
                            <Text className="text-gray-400 text-xs">
                              Click để xem chi tiết
                            </Text>
                            <motion.div
                              className="text-yellow-400"
                              animate={{ x: [0, 5, 0] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}>
                              👉
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Col>
                );
              })}
            </Row>

            {/* Pagination */ }
            {total > pageSize && (
              <div className="flex justify-center mt-8">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full p-1">
                  <Button
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage(page - 1);
                      const price = useCustomPrice ? customPrice : selectedPrice;
                      if (price) fetchAccountsByPrice(price, page - 1);
                    }}>
                    ←
                  </Button>

                  <Text className="text-white px-3">
                    Trang {page} / {Math.ceil(total / pageSize)}
                  </Text>

                  <Button
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    disabled={page >= Math.ceil(total / pageSize)}
                    onClick={() => {
                      setPage(page + 1);
                      const price = useCustomPrice ? customPrice : selectedPrice;
                      if (price) fetchAccountsByPrice(price, page + 1);
                    }}>
                    →
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */ }
        {!loading && (selectedPrice || customPrice) && accounts.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12">
            <Empty
              description={
                <Text className="text-gray-300 text-lg">
                  Không tìm thấy tài khoản nào với mệnh giá{" "}
                  {(useCustomPrice ? customPrice : selectedPrice)?.toLocaleString("vi-VN")}đ
                </Text>
              }>
              <Text className="text-gray-400">
                Vui lòng chọn mệnh giá khác hoặc quay lại sau
              </Text>
            </Empty>
          </motion.div>
        )}
      </div>

      {/* Skin Reveal Modal */ }
      <SkinRevealModal
        isOpen={showSkinReveal}
        onClose={() => setShowSkinReveal(false)}
        skins={
          selectedAccount?.characterSkins
            ? Array.isArray(selectedAccount.characterSkins)
              ? selectedAccount.characterSkins
              : typeof selectedAccount.characterSkins === 'string'
              ? JSON.parse(selectedAccount.characterSkins || "[]")
              : []
            : []
        }
        account={selectedAccount}
        onConfirm={handlePurchaseConfirm}
      />

      {/* Custom Styles */ }
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .custom-select .ant-select-selector {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: white !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .custom-select .ant-select-arrow {
          color: white !important;
        }

        .custom-select .ant-select-selection-placeholder {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .custom-select .ant-select-selection-item {
          color: white !important;
          font-weight: 500;
        }

        .custom-select:hover .ant-select-selector {
          border-color: rgba(255, 255, 255, 0.6) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .custom-input .ant-input-number {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: white !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .custom-input .ant-input-number-input {
          color: white !important;
          font-weight: 500;
        }

        .custom-input .ant-input-number-input::placeholder {
          color: white !important;
          opacity: 0.9 !important;
        }

        /* Add vendor prefixes for better browser compatibility */
        .custom-input .ant-input-number-input::-webkit-input-placeholder {
          color: white !important;
          opacity: 0.9 !important;
        }

        .custom-input .ant-input-number-input::-moz-placeholder {
          color: white !important;
          opacity: 0.9 !important;
        }

        .custom-input .ant-input-number-input:-ms-input-placeholder {
          color: white !important;
          opacity: 0.9 !important;
        }

        .custom-input .ant-input-number-input:-moz-placeholder {
          color: white !important;
          opacity: 0.9 !important;
        }

        /* Style the addonAfter element to match the input design */
        .custom-input .ant-input-number-group-addon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: white !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          font-weight: 500;
          padding: 0 12px;
        }

        .custom-input:hover .ant-input-number-group-addon {
          border-color: rgba(255, 255, 255, 0.6) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .custom-input .ant-input-number-handler {
          background: rgba(255, 255, 255, 0.1) !important;
          border-left: 1px solid rgba(255, 255, 255, 0.3) !important;
        }

        .custom-input .ant-input-number-handler-up {
          border-top-right-radius: 12px !important;
        }

        .custom-input .ant-input-number-handler-down {
          border-bottom-right-radius: 12px !important;
        }

        .custom-input .ant-input-number-handler-up-inner,
        .custom-input .ant-input-number-handler-down-inner {
          color: white !important;
        }

        .custom-input:hover .ant-input-number {
          border-color: rgba(255, 255, 255, 0.6) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .ant-input-number-handler-up-inner,
        .ant-input-number-handler-down-inner {
          color: white !important;
        }

        .ant-empty-description {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        @keyframes sparkle {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.7;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulse-grow {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes explode {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes tear-line {
          0% {
            transform: translateX(-100%) rotate(-45deg);
          }
          100% {
            transform: translateX(100%) rotate(-45deg);
          }
        }

        @keyframes tear {
          0% {
            transform: rotate(0deg) scale(1);
            box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
          }
          50% {
            transform: rotate(5deg) scale(1.05);
            box-shadow: 0 0 30px 10px rgba(255, 215, 0, 0.5);
          }
          100% {
            transform: rotate(0deg) scale(1);
            box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
          }
        }

        .animate-sparkle {
          animation: sparkle 1s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-grow {
          animation: pulse-grow 2s ease-in-out infinite;
        }

        .animate-explode {
          animation: explode 1.5s ease-out forwards;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        .animate-tear-line {
          animation: tear-line 1s ease-out forwards;
        }

        .animate-tear {
          animation: tear 0.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}