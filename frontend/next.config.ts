import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://api-gateway:8080/api/v1/:path*'
      }
    ];
  }
};

export default nextConfig;
