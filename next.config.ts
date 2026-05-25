/**
 * Next.js Configuration
 * 
 * - Configure webpack to handle pdf.js worker files
 * - Turbopack is default bundler in Next.js 16
 * 
 * git commit: "chore: configure next.config for pdf.js worker support"
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure webpack to handle the pdf.js worker
  webpack: (config) => {
    // Alias for canvas (used by pdfjs-dist but not needed in browser)
    config.resolve.alias.canvas = false;

    // Handle pdf worker files
    config.resolve.alias['pdfjs-dist'] = 'pdfjs-dist/legacy/build/pdf';

    return config;
  },

  // Turbopack config (default bundler in Next.js 16)
  turbopack: {
    resolveAlias: {
      canvas: { browser: '' },
    },
  },
};

export default nextConfig;
