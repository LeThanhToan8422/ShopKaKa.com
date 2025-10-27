"use client";

import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Spin,
  Alert,
  Row,
  Col,
  Empty,
} from "antd";
import { motion } from "framer-motion";
import useBlindBoxes from "./hooks/useBlindBoxes";
import useBlindBoxAccounts from "./hooks/useBlindBoxAccounts";
import useBlindBoxPage from "./hooks/useBlindBoxPage";
import BlindBoxOpening from "./components/BlindBoxOpening";
import SkinRevealModal from "./components/SkinRevealModal";

const { Title, Text } = Typography;

export default function BlindBoxPage() {
  const [selectedBlindBox, setSelectedBlindBox] = useState<any>(null);
  const [showAccounts, setShowAccounts] = useState(false);
  
  const {
    data: blindBoxes,
    loading: blindBoxesLoading,
    error: blindBoxesError,
    fetchBlindBoxes,
  } = useBlindBoxes();
  
  const {
    // State
    selectedAccount,
    isBoxOpened,
    openedAccount,
    showSkinReveal,
    accounts,
    loading: pageLoading,
    error: pageError,
    
    // Functions
    setSelectedAccount,
    setIsBoxOpened,
    setOpenedAccount,
    setShowSkinReveal,
    setAccountsFromBlindBox,
    handleAccountSelection,
    handlePurchaseConfirm,
    refreshBlindBoxData,
    setLoading: setPageLoading,
  } = useBlindBoxPage();

  // Handle blind box selection
  const handleBlindBoxSelect = async (blindBox: any) => {
    setSelectedBlindBox(blindBox);
    setShowAccounts(true);
    setPageLoading(true);
    
    try {
      // Call getBlindBoxById to get the latest data
      const response = await refreshBlindBoxData(blindBox.id);
      if (response) {
        // Update the selected blind box with fresh data
        setSelectedBlindBox(response);
        
        // Set accounts from the blind box's saleAccounts array
        if (response.saleAccounts && Array.isArray(response.saleAccounts)) {
          setAccountsFromBlindBox(response.saleAccounts);
        } else {
          setAccountsFromBlindBox([]);
        }
      } else {
        // Fallback to original data if API call fails
        if (blindBox.saleAccounts && Array.isArray(blindBox.saleAccounts)) {
          setAccountsFromBlindBox(blindBox.saleAccounts);
        } else {
          setAccountsFromBlindBox([]);
        }
      }
    } catch (error) {
      console.error("Error fetching blind box details:", error);
      // Fallback to original data if API call fails
      if (blindBox.saleAccounts && Array.isArray(blindBox.saleAccounts)) {
        setAccountsFromBlindBox(blindBox.saleAccounts);
      } else {
        setAccountsFromBlindBox([]);
      }
    } finally {
      setPageLoading(false);
    }
  };

  // Create a wrapper function for handlePurchaseConfirm that also refreshes the blind box data
  const handlePurchaseConfirmWithRefresh = async () => {
    // Call the original purchase confirm function
    handlePurchaseConfirm();
    
    // Refresh the blind box data from API to get the latest state
    await refreshBlindBoxAndAccounts();
  };

  // Create a function to handle modal close with refresh
  const handleCloseWithRefresh = async () => {
    setShowSkinReveal(false);
    
    // Refresh the blind box data from API to get the latest state
    await refreshBlindBoxAndAccounts();
  };

  // Shared function to refresh blind box data and accounts
  const refreshBlindBoxAndAccounts = async () => {
    if (selectedBlindBox) {
      const updatedBlindBox = await refreshBlindBoxData(selectedBlindBox.id);
      if (updatedBlindBox) {
        // Update the selected blind box with fresh data
        setSelectedBlindBox(updatedBlindBox);
        
        // Update the accounts list with the fresh data
        if (updatedBlindBox.saleAccounts && Array.isArray(updatedBlindBox.saleAccounts)) {
          setAccountsFromBlindBox(updatedBlindBox.saleAccounts);
        } else {
          setAccountsFromBlindBox([]);
        }
      }
    }
  };

  // Handle back to blind boxes list
  const handleBackToBlindBoxes = () => {
    setShowAccounts(false);
    setSelectedBlindBox(null);
  };

  // Render blind boxes list
  const renderBlindBoxes = () => (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8">
        <Title level={2} className="text-2xl font-bold text-white mb-6">
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
            Chọn túi mù bạn muốn mở
          </motion.span>
        </Title>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        <Text className="text-gray-300 mb-6 block text-lg">
          <motion.span
            animate={{ 
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity
            }}>
            Mỗi túi mù chứa nhiều tài khoản với các đặc điểm khác nhau. Chọn một túi mù để xem các tài khoản bên trong!
          </motion.span>
        </Text>
      </motion.div>
      
      {blindBoxesError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8">
          <Alert
            message="Lỗi"
            description={blindBoxesError}
            type="error"
            showIcon
            className="rounded-2xl"
          />
        </motion.div>
      )}
      
      {blindBoxesLoading && (
        <div className="flex justify-center my-12">
          <motion.div
            className="relative"
            animate={{ 
              rotate: 360
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}>
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-500 border-b-transparent rounded-full animate-spin" style={{ animationDuration: "1.5s" }}></div>
          </motion.div>
          <motion.p 
            className="text-white text-xl ml-4 self-center"
            animate={{ 
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}>
            Đang tải các túi mù...
          </motion.p>
        </div>
      )}
      
      {!blindBoxesLoading && blindBoxes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <Row gutter={[24, 24]}>
            {blindBoxes.map((blindBox, index) => (
              <Col key={blindBox.id} xs={24} sm={12} lg={8} xl={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -15 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer"
                  onClick={() => handleBlindBoxSelect(blindBox)}>
                  <div className="group bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:border-yellow-400/70 hover:scale-105 relative z-0">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-pulse"></div>
                    
                    {/* Pulsing outer ring */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-md animate-pulse transition-opacity duration-500"></div>
                    
                    {/* Floating particles */ }
                    <div className="absolute inset-0">
                      <div
                        className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float"
                        style={{ animationDelay: "0s" }}></div>
                      <div
                        className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-white/40 rounded-full animate-float"
                        style={{ animationDelay: "0.5s" }}></div>
                      <div
                        className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/35 rounded-full animate-float"
                        style={{ animationDelay: "1s" }}></div>
                      <div
                        className="absolute top-1/3 right-3/4 w-2 h-2 bg-white/25 rounded-full animate-float"
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
                        className="relative w-36 h-36 flex items-center justify-center"
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}>
                        {/* Outer glow */ }
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 opacity-70 blur-md animate-pulse"></div>

                        {/* Main box */ }
                        <div className="relative w-28 h-28 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/40">
                          {/* Box pattern */ }
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 left-0 w-full h-1/3 bg-white/40"></div>
                            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white/40"></div>
                            <div className="absolute top-1/3 left-0 w-full h-px bg-white/60"></div>
                            <div className="absolute top-2/3 left-0 w-full h-px bg-white/60"></div>
                          </div>

                          {/* Box lid with ribbon */ }
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-t-lg flex items-center justify-center shadow-lg">
                            <div className="w-14 h-1.5 bg-yellow-300 rounded-full"></div>
                          </div>

                          {/* Shine effect */ }
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                          {/* Question mark */ }
                          <span className="text-5xl text-white font-bold relative z-10 drop-shadow-lg">
                            ?
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Shine Effect */ }
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Content */ }
                    <div className="p-5 bg-black/30 backdrop-blur-sm relative z-10">
                      <div className="flex justify-between items-center mb-3">
                        <motion.h3 
                          className="text-white font-bold text-xl truncate"
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
                          {blindBox.name}
                        </motion.h3>
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-green-500"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity 
                          }}
                        />
                      </div>

                      <motion.p 
                        className="text-gray-200 text-sm block mb-4"
                        animate={{ 
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity
                        }}>
                        {blindBox.saleAccounts?.length || 0} tài khoản
                      </motion.p>

                      <div className="flex justify-between items-center">
                        <motion.span 
                          className="text-gray-300 text-xs"
                          animate={{ 
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity
                          }}>
                          Click để xem chi tiết
                        </motion.span>
                        <motion.div
                          className="text-yellow-400"
                          animate={{ 
                            x: [0, 8, 0],
                            textShadow: [
                              "0 0 2px rgba(255,255,255,0.3)",
                              "0 0 8px rgba(255,215,0,0.6)",
                              "0 0 2px rgba(255,255,255,0.3)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}>
                          👉
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Sparkle effects on hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
                      <div className="absolute top-1/2 left-8 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      )}
      
      {!blindBoxesLoading && blindBoxes.length === 0 && !blindBoxesError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12">
          <Empty
            description={
              <div className="text-center">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                  className="text-6xl mb-4">
                  🎁
                </motion.div>
                <Text className="text-gray-300 text-lg font-medium">
                  Không tìm thấy túi mù nào
                </Text>
                <motion.p 
                  className="text-gray-400 mt-2"
                  animate={{ 
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity
                  }}>
                  Vui lòng quay lại sau
                </motion.p>
              </div>
            }>
          </Empty>
        </motion.div>
      )}
    </div>
  );

  // Render accounts within selected blind box
  const renderAccounts = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative">
          <Button 
            onClick={handleBackToBlindBoxes}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 text-white hover:from-purple-700 hover:to-indigo-700 px-6 py-3 text-lg font-bold rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300 flex items-center group">
            <motion.span
              className="mr-2"
              animate={{ 
                x: [-2, 2, -2]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity
              }}>
              ←
            </motion.span>
            <motion.span
              animate={{ 
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}>
              Quay lại
            </motion.span>
          </Button>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300 -z-10"></div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center flex-1">
          <Title level={2} className="text-2xl font-bold text-white mb-0">
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
              Tài khoản trong túi mù "{selectedBlindBox?.name}"
            </motion.span>
          </Title>
        </motion.div>
        
        <div className="w-[120px]"></div> {/* Spacer to balance layout */}
      </div>
      
      {pageError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8">
          <Alert
            message="Lỗi"
            description={pageError}
            type="error"
            showIcon
            className="rounded-2xl"
          />
        </motion.div>
      )}
      
      {pageLoading && (
        <div className="flex justify-center my-12">
          <motion.div
            className="relative"
            animate={{ 
              rotate: 360
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}>
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-500 border-b-transparent rounded-full animate-spin" style={{ animationDuration: "1.5s" }}></div>
          </motion.div>
          <motion.p 
            className="text-white text-xl ml-4 self-center"
            animate={{ 
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}>
            Đang tải các tài khoản...
          </motion.p>
        </div>
      )}
      
      {!pageLoading && accounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <Title level={3} className="text-xl font-bold text-white mb-6">
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Chọn tài khoản bạn muốn mua
              </motion.span>
            </Title>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}>
            <Text className="text-gray-300 mb-6 block text-lg">
              <motion.span
                animate={{ 
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity
                }}>
                Tất cả tài khoản dưới đây đều thuộc túi mù "{selectedBlindBox?.name}". Hãy chọn một tài khoản để xem chi tiết và mua ngay!
              </motion.span>
            </Text>
          </motion.div>
          
          <Row gutter={[24, 24]}>
            {accounts.map((acc, index) => {
              return (
                <Col key={acc.id} xs={24} sm={12} lg={8} xl={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -15 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative cursor-pointer"
                    id={`account-${acc.id}`}
                    onClick={() => handleAccountSelection(acc.id, selectedBlindBox.id)}>
                    <div className="group bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:border-yellow-400/70 hover:scale-105 relative z-0">
                      {/* Sparkle effect container */ }
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse delay-300"></div>
                        <div className="absolute top-1/2 left-8 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse delay-500"></div>
                      </div>

                      {/* Mysterious Card Front */ }
                      <div className="relative h-80 overflow-hidden">
                        {/* Animated background */ }
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-pulse"></div>
                        
                        {/* Pulsing outer ring */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-md animate-pulse transition-opacity duration-500"></div>

                        {/* Floating particles */ }
                        <div className="absolute inset-0">
                          <div
                            className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float"
                            style={{ animationDelay: "0s" }}></div>
                          <div
                            className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-white/40 rounded-full animate-float"
                            style={{ animationDelay: "0.5s" }}></div>
                          <div
                            className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/35 rounded-full animate-float"
                            style={{ animationDelay: "1s" }}></div>
                          <div
                            className="absolute top-1/3 right-3/4 w-2 h-2 bg-white/25 rounded-full animate-float"
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
                            className="relative w-36 h-36 flex items-center justify-center"
                            animate={{
                              rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}>
                        {/* Outer glow */ }
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 opacity-70 blur-md animate-pulse"></div>

                        {/* Main box */ }
                        <div className="relative w-28 h-28 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/40">
                          {/* Box pattern */ }
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 left-0 w-full h-1/3 bg-white/40"></div>
                            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-white/40"></div>
                            <div className="absolute top-1/3 left-0 w-full h-px bg-white/60"></div>
                            <div className="absolute top-2/3 left-0 w-full h-px bg-white/60"></div>
                          </div>

                          {/* Box lid with ribbon */ }
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-t-lg flex items-center justify-center shadow-lg">
                            <div className="w-14 h-1.5 bg-yellow-300 rounded-full"></div>
                          </div>

                          {/* Shine effect */ }
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                          {/* Question mark */ }
                          <span className="text-5xl text-white font-bold relative z-10 drop-shadow-lg">
                            ?
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Shine Effect */ }
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                      </div>

                      {/* Content */ }
                      <div className="p-5 bg-black/30 backdrop-blur-sm relative z-10">
                        <div className="flex justify-between items-center mb-3">
                          <motion.h3 
                            className="text-white font-bold text-xl"
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
                            Tài khoản #{index + 1}
                          </motion.h3>
                          <motion.div 
                            className="w-3 h-3 rounded-full bg-green-500"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity 
                            }}
                          />
                        </div>

                        <motion.p 
                          className="text-gray-200 text-sm block mb-4"
                          animate={{ 
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity
                          }}>
                          Tài khoản Liên Quân Mobile
                        </motion.p>

                        <div className="flex justify-between items-center">
                          <motion.span 
                            className="text-gray-300 text-xs"
                            animate={{ 
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity
                            }}>
                            Click để xem chi tiết
                          </motion.span>
                          <motion.div
                            className="text-yellow-400"
                            animate={{ 
                              x: [0, 8, 0],
                              textShadow: [
                                "0 0 2px rgba(255,255,255,0.3)",
                                "0 0 8px rgba(255,215,0,0.6)",
                                "0 0 2px rgba(255,255,255,0.3)"
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}>
                            👉
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Additional sparkle effects on hover */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
                        <div className="absolute top-1/2 left-8 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </motion.div>
      )}
      
      {!pageLoading && accounts.length === 0 && !pageError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12">
          <Empty
            description={
              <div className="text-center">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                  className="text-6xl mb-4">
                  ❓
                </motion.div>
                <Text className="text-gray-300 text-lg font-medium">
                  Không tìm thấy tài khoản nào trong túi mù này
                </Text>
                <motion.p 
                  className="text-gray-400 mt-2"
                  animate={{ 
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity
                  }}>
                  Hãy chọn một túi mù khác
                </motion.p>
              </div>
            }>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleBackToBlindBoxes}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 text-white hover:from-purple-700 hover:to-indigo-700 px-6 py-3 text-lg font-bold rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300 flex items-center mx-auto group">
                <motion.span
                  className="mr-2"
                  animate={{ 
                    x: [-2, 2, -2]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity
                  }}>
                  ←
                </motion.span>
                <motion.span
                  animate={{ 
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}>
                  Quay lại danh sách túi mù
                </motion.span>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300 -z-10"></div>
              </Button>
            </motion.div>
          </Empty>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced visual effects */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative">
          {/* Animated background elements */ }
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}></div>
            <div
              className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}></div>
          </div>

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.8 
            }}
            className="relative z-10">
            <Title
              level={1}
              className="text-4xl md:text-7xl font-bold text-white mb-6 relative z-10">
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 drop-shadow-[0_5px_15px_rgba(255,140,0,0.5)]"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundImage: "linear-gradient(90deg, #fbbf24, #f97316, #ec4899, #f97316, #fbbf24)",
                  backgroundSize: "300% 300%"
                }}>
                XÉ TÚI MÙ LIÊN QUÂN
              </motion.span>
            </Title>
            
            <motion.div
              className="inline-block ml-4"
              animate={{ 
                rotate: [0, 20, -20, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}>
              <motion.span 
                className="text-5xl"
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
                🎁
              </motion.span>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-3xl mx-auto">
            <motion.p 
              className="text-xl md:text-3xl text-gray-200 font-medium"
              animate={{ 
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity
              }}>
              Trải nghiệm cảm giác hồi hộp khi mở túi mù! Chọn túi mù và nhận ngẫu nhiên một tài khoản chất lượng cao.
            </motion.p>
          </motion.div>

          {/* Decorative elements */ }
          <div className="flex justify-center mt-8 space-x-6">
            <motion.div
              className="text-4xl"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                delay: 0,
                ease: "easeInOut"
              }}>
              ⭐
            </motion.div>
            <motion.div
              className="text-4xl"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -10, 0]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                delay: 0.5,
                ease: "easeInOut"
              }}>
              🌟
            </motion.div>
            <motion.div
              className="text-4xl"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                delay: 1,
                ease: "easeInOut"
              }}>
              ✨
            </motion.div>
            <motion.div
              className="text-4xl"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -10, 0]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                delay: 1.5,
                ease: "easeInOut"
              }}>
              🎇
            </motion.div>
          </div>
        </motion.div>

        {/* Blind Box Opening */ }
        {selectedBlindBox && isBoxOpened && (
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

        {/* Error Message */ }
        {pageError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8">
            <Alert
              message="Lỗi"
              description={pageError}
              type="error"
              showIcon
              className="rounded-2xl"
            />
          </motion.div>
        )}

        {/* Loading Spinner */ }
        {pageLoading && (
          <div className="flex justify-center my-12">
            <Spin size="large" className="text-white" />
          </div>
        )}
        
        {/* Main Content */ }
        {!showAccounts ? renderBlindBoxes() : renderAccounts()}

        {/* Skin Reveal Modal */ }
        <SkinRevealModal
          isOpen={showSkinReveal}
          onClose={handleCloseWithRefresh}
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
          onConfirm={handlePurchaseConfirmWithRefresh}
        />

        {/* Custom Styles */ }
        <style jsx global>{`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
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
              transform: scale(0.5);
              opacity: 0;
            }
          }

          @keyframes explode {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(var(--tx), var(--ty)) scale(0);
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
            }
            25% {
              transform: rotate(5deg) scale(0.95);
            }
            50% {
              transform: rotate(-5deg) scale(0.9);
            }
            75% {
              transform: rotate(3deg) scale(0.95);
            }
            100% {
              transform: rotate(0deg) scale(1);
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
              opacity: 0.7;
            }
            50% {
              transform: scale(1.5);
              opacity: 0.4;
            }
            100% {
              transform: scale(1);
              opacity: 0.7;
            }
          }

          @keyframes animate-pulse-glow {
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

          .animate-sparkle {
            animation: sparkle 1s ease-out forwards;
          }

          .animate-explode {
            --tx: ${Math.random() * 100 - 50}px;
            --ty: ${Math.random() * 100 - 50}px;
            animation: explode 1s ease-out forwards;
          }

          .animate-tear-line {
            animation: tear-line 1s ease-out forwards;
          }

          .animate-tear {
            animation: tear 0.5s ease-in-out;
          }

          .animate-float {
            animation: float 4s ease-in-out infinite;
          }

          .animate-pulse-grow {
            animation: pulse-grow 3s ease-in-out infinite;
          }

          .animate-pulse-glow {
            animation: animate-pulse-glow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}