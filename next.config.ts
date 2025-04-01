import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      }
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 2678400, // 31 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  typescript: {
    // Asegurarnos de que los errores de TypeScript no bloqueen la compilación
    ignoreBuildErrors: true,
  },
  // Evitar que Next.js intente pre-renderizar páginas que usan Firebase
  experimental: {
    serverComponentsExternalPackages: ['firebase'],
  },
};

export default nextConfig;
