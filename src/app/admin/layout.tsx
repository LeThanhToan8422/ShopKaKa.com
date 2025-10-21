"use client";

import { Spin, Alert } from "antd";
import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    // We'll fetch the user profile from the API to verify the role
    const checkAdminAccess = async () => {
      try {
        // First check if user is authenticated by checking for access token
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return;
        }
        
        // Fetch user profile from API to verify role
        const response = await userAPI.getProfile();
        const userData = response.data;
        
        // Check if user has admin role (case insensitive)
        const isAdmin = userData.role && userData.role.trim().toLowerCase() === 'admin';
        
        if (isAdmin) {
          setAuthorized(true);
        } else {
          // Redirect to accounts page with error
          if (typeof window !== 'undefined') {
            window.location.href = '/accounts?error=access-denied';
          }
        }
      } catch (err) {
        console.error('Error checking admin access:', err);
        setError('Failed to verify user permissions');
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAccess();
  }, []);

  // Show loading while checking authorization
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show error if there was an issue
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Alert
            type="error"
            message="Lỗi xác thực"
            description={error}
            showIcon
          />
        </div>
      </div>
    );
  }

  // If user is authorized, render the children
  if (authorized) {
    return <>{children}</>;
  }

  // This shouldn't happen due to redirect, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500">Truy cập bị từ chối</p>
      </div>
    </div>
  );
}