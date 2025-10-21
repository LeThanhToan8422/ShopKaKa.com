"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI, userAPI } from "@/lib/api";

export type LoginFormValues = { username: string; password: string };

export default function useLogin(callbackUrl?: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the new backend API for login
      const response = await authAPI.login(values.username, values.password);
      console.log("Login response:", response);
      
      const { accessToken, refreshToken, name } = response.data;
      
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('name', name);
      }

      let redirectUrl = "/accounts";
      
      if (callbackUrl) {
        redirectUrl = callbackUrl;
      }
      
      // Stop loading immediately
      setLoading(false);
      
      window.location.href = redirectUrl;
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      } else {
        setError("Có lỗi xảy ra khi đăng nhập");
      }
      setLoading(false);
    }
  };

  return { loading, error, onFinish };
}