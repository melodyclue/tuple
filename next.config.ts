import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // experimental: {
  //   dynamicIO: true,
  // },
  images: {
    remotePatterns: [
      {
        hostname: 'pub-41e4038a06824199970d5ddd4dfdb241.r2.dev',
      },
    ],
  },
};

export default nextConfig;
