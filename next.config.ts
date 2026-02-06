// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enables use cache, ppr, and dynamicIO for Next.js 16
  cacheComponents: true,
  // Ensure we can load video assets from Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;