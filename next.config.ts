import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许本地网络访问
  allowedDevOrigins: ['localhost', '127.0.0.1'],
};

export default nextConfig;
