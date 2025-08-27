import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true
  },
  images: {
    // Usamos imágenes locales; sin dominios remotos
    unoptimized: true
  },
  reactStrictMode: true
};

export default nextConfig;
