"use client";

import { Modal, Button } from "antd";
import { motion } from "framer-motion";
import CharacterGrid from "@/app/accounts/[id]/components/CharacterGrid";
import { getModalRarityClasses as getRarityClasses } from "@/app/utils";

export default function SkinRevealModal({
  isOpen,
  onClose,
  onContinueTearing,
  onGoToOrders,
  account,
}: {
  isOpen: boolean;
  onClose: () => void;
  onContinueTearing: () => void;
  onGoToOrders: () => void;
  account: any;
}) {
  // Extract character skins from the account
  const characterSkins = account?.characterSkins || [];
  
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="95%"
      centered
      className="skin-reveal-modal"
      styles={{
        body: {
          padding: 0,
          background: "linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%)",
          borderRadius: "1.5rem",
          overflow: "hidden",
          position: "relative",
        }
      }}
      closeIcon={
        <div className="text-white hover:text-gray-300 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      }
    >
      {/* Fireworks and Celebration Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Initial Celebration Burst */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 1.5 }}
        >
          <div className="relative w-32 h-32">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`burst-${i}`}
                className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-t from-yellow-400 to-pink-500 rounded-full origin-bottom"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ 
                  duration: 1.5,
                  delay: 0.1 * i,
                }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Firework Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#ffeb3b', '#ff9800', '#f44336', '#9c27b0', '#2196f3', '#4caf50'][Math.floor(Math.random() * 6)],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ 
              scale: 0, 
              opacity: 0,
              x: 0,
              y: 0,
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200],
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 1,
              repeat: Infinity,
              repeatDelay: 2 + Math.random() * 3,
            }}
          />
        ))}
        
        {/* Sparkle Effects */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{ 
              duration: 1 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: 1 + Math.random() * 3,
            }}
          />
        ))}
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`float-${i}`}
            className="absolute w-3 h-3 rounded-full opacity-70"
            style={{
              backgroundColor: ['#ffeb3b', '#ff9800', '#f44336', '#9c27b0', '#2196f3'][Math.floor(Math.random() * 5)],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ 
              y: [0, -30, 0],
              x: [0, (Math.random() - 0.5) * 20, 0],
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Celebration Confetti */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`confetti-${i}`}
            className="absolute w-2 h-2"
            style={{
              backgroundColor: ['#ffeb3b', '#ff9800', '#f44336', '#9c27b0', '#2196f3', '#4caf50'][Math.floor(Math.random() * 6)],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              clipPath: [
                'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle
                'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // Diamond
                'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', // Trapezoid
                'circle(50%)', // Circle
              ][Math.floor(Math.random() * 4)],
            }}
            initial={{ 
              y: -20,
              opacity: 0,
              rotate: 0,
            }}
            animate={{ 
              y: [0, window.innerHeight + 20],
              opacity: [0, 1, 1, 0],
              rotate: [0, 360],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{ 
              duration: 3 + Math.random() * 5,
              delay: Math.random() * 5,
              repeat: Infinity,
              repeatDelay: 2 + Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <div className="p-6 flex flex-col items-center w-full relative z-10">
        {/* Header with Celebration Animation */}
        <div className="text-center mb-8 w-full">
          <motion.h2 
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Skin Đặc Biệt Trong Tài Khoản
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-gray-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Khám phá những skin hiếm có trong tài khoản bạn vừa mở
          </motion.p>
        </div>

        {/* Skin Grid - Centered with Glow Effect */}
        <div className="flex justify-center w-full px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full max-w-6xl relative"
          >
            {/* Glow Effect Behind Grid */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-2xl -z-10"></div>
            <CharacterGrid 
              items={characterSkins} 
              getRarityClasses={getRarityClasses} 
            />
          </motion.div>
        </div>

        {/* Footer Buttons with Enhanced Animations */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 w-full px-4">
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="large"
              onClick={onClose}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 w-full relative overflow-hidden"
            >
              <span className="text-white relative z-10">
                <motion.span
                  animate={{ 
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  ĐÓNG
                </motion.span>
              </span>
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/30 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="large"
              onClick={onContinueTearing}
              className="bg-gradient-to-r from-purple-600 to-indigo-700 border-0 px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300 w-full relative overflow-hidden"
            >
              <span className="text-white relative z-10">
                <motion.span
                  animate={{ 
                    textShadow: [
                      "0 0 2px rgba(255,255,255,0.3)",
                      "0 0 10px rgba(139,92,246,0.8)",
                      "0 0 2px rgba(255,255,255,0.3)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  TIẾP TỤC XÉ
                </motion.span>
              </span>
              {/* Button Pulse Effect */}
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 animate-pulse"></div>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              size="large"
              onClick={onGoToOrders}
              className="bg-gradient-to-r from-green-600 to-emerald-700 border-0 px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 w-full relative overflow-hidden"
            >
              <span className="text-white relative z-10">
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
                  }}
                >
                  ĐI ĐẾN ĐƠN HÀNG
                </motion.span>
              </span>
              {/* Button Shine Effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx global>{`
        .skin-reveal-modal .ant-modal-content {
          overflow: hidden;
          border-radius: 1.5rem;
        }
        
        .skin-reveal-modal .ant-modal-close {
          top: 20px;
          right: 20px;
          z-index: 20;
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
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes twinkle {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0);
          }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .shine-animation {
          animation: shine 2s infinite;
        }
        
        .twinkle-animation {
          animation: twinkle 1.5s infinite;
        }
      `}</style>
    </Modal>
  );
}