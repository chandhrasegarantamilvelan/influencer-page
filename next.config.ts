import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow remote images from common sources for portfolio items
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
