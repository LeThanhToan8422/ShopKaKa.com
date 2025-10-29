"use client";

import { Button, Dropdown, Space } from "antd";
import Link from "next/link";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";
import ShopKaKaLogo from "./ShopKaKaLogo";

export default function Navbar() {
  const [user, setUser] = useState<{
    id?: string;
    username?: string;
    name?: string;
    role?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by checking localStorage for access token
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (token) {
      // Fetch user profile from API to get current user info
      const fetchUserProfile = async () => {
        try {
          const response = await userAPI.getProfile();
          const userData = response.data;
          console.log(userData);
          
          setUser({
            id: userData.id || undefined,
            role: userData.role || undefined,
            username: userData.username || undefined,
            name: userData.name || undefined,
          });
        } catch (error) {
          console.error('Navbar: Error fetching user profile:', error);
          // If there's an error fetching profile, clear auth data and redirect to login
          handleLogout();
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserProfile();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear all auth-related data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('name');
    }
    // Redirect to home page
    window.location.href = '/';
  };

  // Show simplified navbar while loading
  if (loading) {
    return (
      <header className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold">
            <ShopKaKaLogo size="md" variant="combined" />
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/accounts">Tài khoản</Link>
            <Link href="/blindbox">Xé túi mù</Link>
            <Space>
              <Link href="/auth/login">Đăng nhập</Link>
              <Link href="/auth/register">Đăng ký</Link>
            </Space>
          </nav>
        </div>
      </header>
    );
  }

  // Helper function to check if user is admin (case insensitive)
  const isAdmin = (role: string | undefined): boolean => {
    if (!role) return false;
    const normalizedRole = role.trim().toLowerCase();
    
    return normalizedRole === 'admin';
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link href="/profile">Thông tin cá nhân</Link>,
    },
    {
      key: "recharge",
      icon: <WalletOutlined />,
      label: <Link href="/recharge">Nạp tiền</Link>,
    },
    ...(user?.role && isAdmin(user.role)
      ? [
          {
            key: "admin",
            icon: <SettingOutlined />,
            label: <Link href="/admin">Quản trị</Link>,
          },
        ]
      : []),
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          <ShopKaKaLogo size="md" variant="combined" />
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/accounts">Tài khoản</Link>
          <Link href="/blindbox">Xé túi mù</Link>

          {user ? (
            <Space>
              {user?.role && isAdmin(user.role) && (
                <Link href="/admin">
                  <Button type="link" size="small" className="text-red-600">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}>
                <Button type="text" size="small">
                  <Space>
                    <UserOutlined />
                    {user?.name || user?.username || "User"}
                    {user?.role && isAdmin(user.role) && (
                      <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                        ADMIN
                      </span>
                    )}
                  </Space>
                </Button>
              </Dropdown>
            </Space>
          ) : (
            <Space>
              <Link href="/auth/login">Đăng nhập</Link>
              <Link href="/auth/register">Đăng ký</Link>
            </Space>
          )}
        </nav>
      </div>
    </header>
  );
}