import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Image optimization for external token logos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.codex.io',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
      {
        protocol: 'https',
        hostname: '*.ipfs.nftstorage.link',
      },
      {
        protocol: 'https',
        hostname: 'img.fotofolio.xyz',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      '@tanstack/react-query',
      'lightweight-charts',
    ],
  },
};

// Wrap with Sentry if the package is available
let exportedConfig = nextConfig;

try {
  const { withSentryConfig } = require('@sentry/nextjs');
  exportedConfig = withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
  });
} catch {
  // Sentry not installed yet, use plain config
}

export default exportedConfig;
