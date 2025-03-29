import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // السماح لأي موقع خارجي
      },
    ],
  },
};

export default nextConfig;
