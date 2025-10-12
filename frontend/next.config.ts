import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myikas.com',
      },
    ],
  },
};

export default nextConfig;
