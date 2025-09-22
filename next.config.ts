import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '',
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Performance optimizations (swcMinify is deprecated in Next.js 15)
  
  // Note: headers() function doesn't work with output: 'export'
  // These headers should be configured at the hosting provider level (GitHub Pages, Netlify, etc.)
};

export default nextConfig;
