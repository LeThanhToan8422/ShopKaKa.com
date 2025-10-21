"use client";

import { Alert, Button, Card, Form, Input, Typography, Divider } from "antd";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import useLogin from "./hooks/useLogin";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { loading, error, onFinish } = useLogin(callbackUrl);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "registration-success") {
      setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập vào tài khoản của bạn.");
      // Clear the message after 10 seconds
      setTimeout(() => setSuccessMessage(null), 10000);
    }
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="shadow-lg">
        <Typography.Title level={3} className="!mb-2 text-center">
          Đăng nhập
        </Typography.Title>
        <Typography.Paragraph className="!mb-6 text-center" type="secondary">
          Đăng nhập vào tài khoản của bạn
        </Typography.Paragraph>
        
        {successMessage && (
          <Alert 
            type="success" 
            message={successMessage} 
            className="!mb-4" 
            closable
            onClose={() => setSuccessMessage(null)}
          />
        )}
        {error && <Alert type="error" message={error} className="!mb-4" />}
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập" },
            ]}>
            <Input placeholder="Nhập tên đăng nhập" size="large" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>
        </Form>
        
        <Divider>Hoặc</Divider>
        
        <div className="text-center">
          <Typography.Text type="secondary">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700">
              Đăng ký ngay
            </Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}