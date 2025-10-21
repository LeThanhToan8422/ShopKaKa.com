"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

export type RegisterFormValues = {
  name: string;
  username: string;
  password: string;
  confirmPassword?: string;
};

export default function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    setOk(false);
    
    try {
      // Remove confirmPassword from the payload
      const { confirmPassword: _, ...payload } = values;
      
      // Use the new backend API for registration
      await authAPI.register(payload.username, payload.password, payload.name);
      
      setOk(true);
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/auth/login?message=registration-success");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.response?.status === 409) {
        setError("Tên đăng nhập đã được sử dụng. Vui lòng chọn tên đăng nhập khác.");
      } else {
        setError("Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, ok, onFinish };
}