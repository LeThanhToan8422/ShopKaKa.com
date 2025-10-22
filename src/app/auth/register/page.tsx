"use client";

import { Alert, Button, Card, Form, Input, Typography, Divider } from "antd";
import Link from "next/link";
import useRegister, { RegisterFormValues } from "./hooks/useRegister";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { loading, error, ok, onFinish } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card 
            className="shadow-2xl rounded-2xl border-0 overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f8f9fa)'
            }}
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2
                }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4"
              >
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                  />
                </svg>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Typography.Title 
                  level={2} 
                  className="!mb-2 !text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  Tạo tài khoản mới
                </Typography.Title>
                <Typography.Paragraph className="!mb-6 text-gray-600">
                  Đăng ký để bắt đầu trải nghiệm
                </Typography.Paragraph>
              </motion.div>
            </div>

            {ok ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  type="success"
                  message="Đăng ký thành công!"
                  description="Tài khoản của bạn đã được tạo. Bạn sẽ được chuyển hướng đến trang đăng nhập."
                  className="!mb-6 rounded-lg border-0 shadow-sm"
                />
              </motion.div>
            ) : null}

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  type="error" 
                  message={error} 
                  className="!mb-6 rounded-lg border-0 shadow-sm" 
                />
              </motion.div>
            )}

            <Form
              layout="vertical"
              onFinish={onFinish}
              disabled={ok}
              autoComplete="off">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Form.Item
                  name="name"
                  label={
                    <span className="font-medium text-gray-700">Họ và tên</span>
                  }
                  rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
                  <Input 
                    placeholder="Nhập họ và tên" 
                    size="large" 
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Form.Item
                  name="username"
                  label={
                    <span className="font-medium text-gray-700">Tên đăng nhập</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập" },
                    { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
                  ]}
                  hasFeedback>
                  <Input 
                    placeholder="Nhập tên đăng nhập" 
                    size="large" 
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Form.Item
                  name="password"
                  label={
                    <span className="font-medium text-gray-700">Mật khẩu</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                  ]}
                  hasFeedback>
                  <Input.Password 
                    placeholder="Nhập mật khẩu" 
                    size="large" 
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Form.Item
                  name="confirmPassword"
                  label={
                    <span className="font-medium text-gray-700">Xác nhận mật khẩu</span>
                  }
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
                  <Input.Password 
                    placeholder="Nhập lại mật khẩu" 
                    size="large" 
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                    className="rounded-lg h-12 font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                  </Button>
                </Form.Item>
              </motion.div>
            </Form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Divider className="!my-6">
                <span className="text-gray-500">Hoặc</span>
              </Divider>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-3 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-3 rounded-lg border border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-3 rounded-lg border border-gray-300 hover:border-gray-700 hover:bg-gray-100 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </motion.button>
              </div>

              <div className="text-center">
                <Typography.Text type="secondary">
                  Đã có tài khoản?{" "}
                  <Link 
                    href="/auth/login" 
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300"
                  >
                    Đăng nhập ngay
                  </Link>
                </Typography.Text>
              </div>
            </motion.div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <Typography.Text type="secondary" className="text-sm">
            © {new Date().getFullYear()} LQ Shop. Tất cả quyền được bảo lưu.
          </Typography.Text>
        </motion.div>
      </motion.div>
    </div>
  );
}