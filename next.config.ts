import type { NextConfig } from "next";
import { REDIRECTS } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  // Centralized redirect map: old WordPress URLs -> new Next.js routes
  // See src/lib/redirects.ts for the full list (~130 entries)
  async redirects() {
    return REDIRECTS
  },
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
