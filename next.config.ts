import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 301 Redirects: old /raw-netting/* placeholder pages -> new SEO URLs
  async redirects() {
    return [
      { source: '/raw-netting/mosquito-net', destination: '/mosquito-netting/', permanent: true },
      { source: '/raw-netting/no-see-um', destination: '/no-see-um-netting-screen/', permanent: true },
      { source: '/raw-netting/shade-mesh', destination: '/shade-screen-mesh/', permanent: true },
      { source: '/raw-netting/scrim', destination: '/theatre-scrim/', permanent: true },
      { source: '/raw-netting/industrial', destination: '/industrial-mesh/', permanent: true },
      { source: '/industrial-netting', destination: '/industrial-mesh/', permanent: true },
      { source: '/theater-scrims', destination: '/theatre-scrim/', permanent: true },
    ]
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
