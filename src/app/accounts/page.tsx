"use client";

import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Select,
  Pagination,
  Empty,
  Space,
  Typography,
  Alert,
  App,
} from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import useAccounts from "./hooks/useAccounts";
import { RANK_OPTIONS, getRankLabel } from "@/lib/ranks";
import Image from "next/image";
import QuickPurchaseButton from "./components/QuickPurchaseButton";

function AccountsContent() {
  const searchParams = useSearchParams();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const {
    form,
    data,
    total,
    page,
    pageSize,
    loading,
    setPage,
    setPageSize,
    onSearch,
  } = useAccounts();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "access-denied") {
      setShowAccessDenied(true);
      // Hide the alert after 5 seconds
      setTimeout(() => setShowAccessDenied(false), 5000);
    }
  }, [searchParams]);

  return (
    <div className="px-4 py-10 relative">
      {/* Header with animated title */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          DANH SÁCH TÀI KHOẢN
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Khám phá các tài khoản Liên Quân Mobile chất lượng cao với nhiều tướng
          và skin độc đáo
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center mt-6 space-x-4">
          <div
            className="text-3xl animate-bounce"
            style={{ animationDelay: "0s" }}>
            ⭐
          </div>
          <div
            className="text-3xl animate-bounce"
            style={{ animationDelay: "0.5s" }}>
            🌟
          </div>
          <div
            className="text-3xl animate-bounce"
            style={{ animationDelay: "1s" }}>
            ✨
          </div>
        </div>
      </div>
      {/* Access Denied Alert */}
      {showAccessDenied && (
        <Alert
          type="warning"
          message="Truy cập bị từ chối"
          description="Bạn không có quyền truy cập vào trang quản trị. Chỉ có admin mới có thể truy cập."
          showIcon
          closable
          onClose={() => setShowAccessDenied(false)}
          className="mb-4"
        />
      )}
      {/* Search Form with enhanced styling */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
        {/* Decorative border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/20 via-pink-500/20 to-purple-500/20 opacity-30 pointer-events-none"></div>
        <div className="relative z-10">
          <Form form={form} layout="vertical" onFinish={onSearch}>
            <Row gutter={[16, 12]} align="bottom" className="items-end">
              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item
                  name="q"
                  label={
                    <span className="text-gray-800 dark:text-white font-semibold">Từ khóa</span>
                  }
                  className="!mb-0">
                  <Input
                    placeholder="Mô tả, từ khóa..."
                    size="large"
                    className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={4}>
                <Form.Item
                  name="rank"
                  label={<span className="text-gray-800 dark:text-white font-semibold">Rank</span>}
                  className="!mb-0">
                  <Select
                    allowClear
                    placeholder="Chọn rank"
                    size="large"
                    options={RANK_OPTIONS}
                    className="rounded-xl"
                    popupClassName="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6}>
                <Form.Item
                  label={<span className="text-gray-800 dark:text-white font-semibold">Giá</span>}
                  className="!mb-0">
                  <Space.Compact className="!w-full">
                    <Form.Item name="minPrice" noStyle>
                      <InputNumber
                        className="!w-full bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-l-xl"
                        min={0}
                        placeholder="Từ"
                        size="large"
                        formatter={(v) =>
                          `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(v?: string) =>
                          v ? Number(v.replace(/,/g, "")) : 0
                        }
                        addonAfter={<span className="text-gray-800 dark:text-white">₫</span>}
                      />
                    </Form.Item>
                    <Form.Item name="maxPrice" noStyle>
                      <InputNumber
                        className="!w-full bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-r-xl"
                        min={0}
                        placeholder="Đến"
                        size="large"
                        formatter={(v) =>
                          `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(v?: string) =>
                          v ? Number(v.replace(/,/g, "")) : 0
                        }
                        addonAfter={<span className="text-gray-800 dark:text-white">₫</span>}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={3}>
                <Form.Item
                  name="minHeroes"
                  label={
                    <span className="text-gray-800 dark:text-white font-semibold">Tướng ≥</span>
                  }
                  className="!mb-0">
                  <InputNumber
                    className="!w-full bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl"
                    min={0}
                    placeholder="0"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={3}>
                <Form.Item
                  name="minSkins"
                  label={
                    <span className="text-gray-800 dark:text-white font-semibold">Skin ≥</span>
                  }
                  className="!mb-0">
                  <InputNumber
                    className="!w-full bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl"
                    min={0}
                    placeholder="0"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6} lg={3} className="flex items-end">
                <Space size="middle" className="w-full">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 border-0 rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                    Lọc
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      onSearch();
                    }}
                    size="large"
                    className="flex-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-xl font-bold hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300 transform hover:scale-105">
                    Xóa
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>

      <div className="mt-8">
        {data && data.length === 0 ? (
          <Card className="shadow-lg border-0 rounded-2xl">
            <Empty
              description={
                <span className="text-gray-600 dark:text-gray-300">
                  Không tìm thấy tài khoản nào phù hợp
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {data && data.map((acc, index) => {
              // Use the new images field directly
              const images: string[] = Array.isArray(acc.images) ? acc.images : [];
              const cover = images[0];

              // Compute badge colors by status
              const status = (acc.status || "available").toLowerCase();

              // Determine VIP by SSS rarity in characterSkins
              type CharacterSkinLite = { rarity?: string };
              let isVip = false;
              try {
                const raw: unknown = acc.characterSkins;
                const parsed: unknown = Array.isArray(raw)
                  ? raw
                  : raw
                  ? JSON.parse(
                      typeof raw === "string" ? raw : JSON.stringify(raw)
                    )
                  : [];
                const skinsArray = (parsed as CharacterSkinLite[]) || [];
                isVip = skinsArray.some((s) =>
                  String(s?.rarity || "")
                    .toUpperCase()
                    .includes("SSS")
                );
              } catch {
                isVip = false;
              }

              return (
                <Col key={acc.id || index} xs={24} sm={12} lg={8} xl={6}>
                  {/* Enhanced Gradient Frame with Animated Border */}
                  <div className="relative rounded-3xl p-[3px] bg-gradient-to-br from-amber-400/70 via-pink-500/70 to-blue-500/70 hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 group">
                    {/* Animated border effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-500 to-blue-500 opacity-70 blur-md animate-pulse"></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-500 to-blue-500 opacity-30 group-hover:opacity-50 transition-all duration-500"></div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
                    </div>

                    {/* Enhanced Card with Advanced Animations */}
                    <div
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl transform-gpu border border-white/20 dark:border-gray-700/20 backdrop-blur-sm relative"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: "fadeInUp 0.6s ease-out forwards",
                      }}>
                      {/* Top Section - Image with Zoom Effect */}
                      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700">
                        {cover ? (
                          <Image
                            src={cover}
                            alt={acc.rank || "acc"}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-500 transition-colors duration-300 group-hover:text-gray-100">
                            <Typography.Text className="text-lg font-bold">
                              Không có ảnh
                            </Typography.Text>
                          </div>
                        )}
                        {/* Overlay gradient to ensure text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Rank badge with glow effect */}
                        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30">
                          {getRankLabel(acc.rank)}
                        </div>

                        {/* VIP badge with animation */}
                        {isVip && (
                          <div className="absolute top-3 left-28 z-10 px-3 py-1 rounded-lg text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg animate-pulse shadow-yellow-500/50">
                            👑 VIP
                          </div>
                        )}

                        {/* Status ribbon with enhanced styling */}
                        <div
                          className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-lg text-sm font-bold shadow-lg ${
                            status === "sold"
                              ? "bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-gray-500/30"
                              : status === "reserved"
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30"
                              : "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/30"
                          }`}>
                          {status === "sold"
                            ? "Đã bán"
                            : status === "reserved"
                            ? "Giữ chỗ"
                            : "Có sẵn"}
                        </div>

                        {/* Floating price tag with enhanced styling */}
                        <div className="absolute bottom-3 left-3 z-10 rounded-xl px-4 py-2 backdrop-blur-md bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 text-white shadow-xl ring-1 ring-white/30 animate-pulse">
                          <span className="text-xl font-extrabold drop-shadow-sm tracking-tight">
                            {new Intl.NumberFormat("vi-VN").format(acc.price)}₫
                          </span>
                        </div>
                      </div>

                      {/* Bottom Section - Enhanced with gradient background */}
                      <div className="p-3 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/40 dark:via-gray-300/20 to-transparent"></div>

                        {/* Account Title with enhanced styling */}
                        <Typography.Paragraph
                          ellipsis={{ rows: 2, tooltip: true }}
                          className="!mb-2 text-gray-800 dark:text-gray-200 font-bold text-base transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white">
                          Acc #{(acc.id || '').slice(0, 8)}
                        </Typography.Paragraph>

                        {/* Rank with enhanced styling */}
                        <Typography.Text className="text-gray-600 dark:text-gray-400 text-sm block mb-3 transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          Rank:{" "}
                          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                            {getRankLabel(acc.rank)}
                          </span>
                        </Typography.Text>

                        {/* Stats with enhanced chips and icons */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-purple-700 dark:text-purple-300 ring-1 ring-purple-400/30 dark:ring-purple-600/30 flex items-center">
                            <span className="mr-1">✨</span> Trang phục:{" "}
                            {acc.skinsCount}
                          </span>
                          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/30 dark:ring-emerald-600/30 flex items-center">
                            <span className="mr-1">🛡️</span> Tướng:{" "}
                            {acc.heroesCount}
                          </span>
                        </div>

                        {/* Enhanced Buttons - Side by Side Layout with better styling */}
                        <div className="flex gap-3">
                          {/* View Details Button */}
                          <button
                            className="flex-1 rounded-xl shadow-md transition-all duration-300 ease-out group-hover:shadow-lg group-hover:scale-105 relative overflow-hidden border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-white dark:bg-gray-700 py-2.5 font-bold text-sm flex items-center justify-center"
                            onClick={() => {
                              window.location.href = `/accounts/${acc.id}`;
                            }}>
                            <span className="relative z-10 transition-all duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center">
                              <span className="mr-1.5">👁️</span> Chi tiết
                            </span>
                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-blue-100/50 dark:via-blue-500/20 to-transparent"></div>
                          </button>

                          {/* Buy Now Button */}
                          <QuickPurchaseButton 
                            accountId={acc.id} 
                            price={acc.price} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} tài khoản`
          }
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
      </div>

      {/* Custom CSS for Keyframe Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .group:hover .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default function AccountsPage() {
  return (
    <App>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Suspense
            fallback={
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <Typography.Text className="mt-4 block text-gray-800 dark:text-white">
                  Đang tải...
                </Typography.Text>
              </div>
            }>
            <AccountsContent />
          </Suspense>
        </div>
      </div>
    </App>
  );
}