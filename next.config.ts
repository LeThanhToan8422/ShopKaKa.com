import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lienquan.garena.vn",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "qr.sepay.vn",
        port: "",
        pathname: "/img",
      },
    ],
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
