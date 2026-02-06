import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images from S3 and YouTube
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.mosquitocurtains.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.mosquitocurtains.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
    // Disable optimization for external images to preserve quality
    unoptimized: true,
  },
};

export default nextConfig;
