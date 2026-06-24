// =============================================================================
// Site Config — Metadata, SEO, and branding configuration
// =============================================================================

export const siteConfig = {
  name: 'ChadWallet',
  description:
    'Trade Solana tokens like a Chad. Lightning-fast swaps, real-time charts, and social trading — all in one premium interface.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://chadwallet.xyz',
  ogImage: '/images/og-image.png',
  keywords: [
    'Solana',
    'DEX',
    'crypto trading',
    'Jupiter swap',
    'Solana wallet',
    'DeFi',
    'token trading',
    'ChadWallet',
    'meme coins',
    'crypto',
  ],
  links: {
    ios: 'https://apps.apple.com/us/app/chadwallet/id6757367474',
    android: 'https://play.google.com/store/apps/details?id=xyz.chadwallet.www',
    twitter: 'https://twitter.com/chadwallet',
    discord: '#',
    telegram: '#',
  },
  creator: 'ChadWallet Team',
} as const;
