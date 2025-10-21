"use client";

import { Alert, Button, Card, Form, Input, Typography, Divider } from "antd";
import Link from "next/link";
import useRegister, { RegisterFormValues } from "./hooks/useRegister";

export default function RegisterPage() {
  const { loading, error, ok, onFinish } = useRegister();

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="shadow-lg">
        <Typography.Title level={3} className="!mb-2 text-center">
          Đăng ký
        </Typography.Title>
        <Typography.Paragraph className="!mb-6 text-center" type="secondary">
          Tạo tài khoản mới
        </Typography.Paragraph>

        {ok ? (
          <Alert
            type="success"
            message="Đăng ký thành công!"
            description="Tài khoản của bạn đã được tạo. Bạn sẽ được chuyển hướng đến trang đăng nhập."
            className="!mb-4"
          />
        ) : null}

        {error && <Alert type="error" message={error} className="!mb-4" />}

        <Form
          layout="vertical"
          onFinish={onFinish}
          disabled={ok}
          autoComplete="off">
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
            <Input placeholder="Nhập họ và tên" size="large" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập" },
              { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
            ]}
            hasFeedback>
            <Input placeholder="Nhập tên đăng nhập" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
            hasFeedback>
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}>
            <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}>
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </Form.Item>
        </Form>

        <Divider>Hoặc</Divider>

        <div className="text-center">
          <Typography.Text type="secondary">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">
              Đăng nhập ngay
            </Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}