import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "standalone",
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001", // พอร์ตของ Backend คุณ
        pathname: "/uploads/**", // อนุญาตเฉพาะ path รูปภาพ
      },
    ],
  },
};

export default nextConfig;
