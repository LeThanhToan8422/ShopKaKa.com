"use client";

import Link from "next/link";
import { Button, Card, Typography } from "antd";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 mt-8">
          <Title
            level={1}
            className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
              LQ SHOP
            </span>
          </Title>
          <Paragraph className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Cửa hàng tài khoản Liên Quân uy tín, chất lượng hàng đầu Việt Nam
          </Paragraph>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/accounts">
              <Button
                size="large"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white px-8 py-5 text-lg font-bold rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
                MUA TÀI KHOẢN
              </Button>
            </Link>
            <Link href="/blindbox">
              <Button
                size="large"
                className="bg-gradient-to-r from-pink-500 to-purple-600 border-0 text-white px-8 py-5 text-lg font-bold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300">
                XÉ TÚI MÙ
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16">
          <Title
            level={2}
            className="text-3xl font-bold text-white text-center mb-12">
            Tính năng nổi bật
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-lg border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🛡️</div>
                <Title level={4} className="text-white mb-3">
                  Tài khoản chất lượng
                </Title>
                <Paragraph className="text-gray-300">
                  Tất cả tài khoản đều được kiểm tra kỹ lưỡng, đảm bảo an toàn
                  tuyệt đối cho người mua
                </Paragraph>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="text-center p-6">
                <div className="text-5xl mb-4">⚡</div>
                <Title level={4} className="text-white mb-3">
                  Giao hàng nhanh chóng
                </Title>
                <Paragraph className="text-gray-300">
                  Tài khoản được giao ngay lập tức sau khi thanh toán thành công
                </Paragraph>
              </div>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🎁</div>
                <Title level={4} className="text-white mb-3">
                  Xé túi mù hấp dẫn
                </Title>
                <Paragraph className="text-gray-300">
                  Trải nghiệm cảm giác hồi hộp khi mở túi mù với giá cực kỳ ưu
                  đãi
                </Paragraph>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Blind Box Promo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}>
          <Card className="bg-gradient-to-r from-purple-800/50 to-pink-700/50 backdrop-blur-lg border-0 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8 p-8">
              <div className="flex-1 text-center md:text-left">
                <Title level={2} className="text-white mb-4">
                  Trải nghiệm xé túi mù
                </Title>
                <Paragraph className="text-gray-200 text-lg mb-6">
                  Mua tài khoản theo hình thức xé túi mù với giá cực kỳ ưu đãi.
                  Nhận ngẫu nhiên tài khoản chất lượng cao!
                </Paragraph>
                <Link href="/blindbox">
                  <Button
                    size="large"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 border-0 text-white px-8 py-5 text-lg font-bold rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-300">
                    TRẢI NGHIỆM NGAY
                  </Button>
                </Link>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl transform rotate-12 animate-pulse"></div>
                  <div className="absolute inset-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl transform -rotate-12 flex items-center justify-center">
                    <span className="text-6xl">🎁</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
