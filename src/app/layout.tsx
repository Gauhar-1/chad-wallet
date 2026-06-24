import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppProviders from '@/providers/AppProviders';
import Header from '@/components/layout/Header';
import TokenBanner from '@/components/common/TokenBanner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'ChadWallet — Trade Solana Like a Chad',
    template: '%s | ChadWallet',
  },
  description:
    'Lightning-fast Solana swaps, real-time TradingView charts, and social trading signals — all in one premium interface.',
  keywords: [
    'Solana', 'DEX', 'crypto trading', 'Jupiter swap', 'ChadWallet',
    'Solana wallet', 'DeFi', 'token trading', 'meme coins',
  ],
  authors: [{ name: 'ChadWallet Team' }],
  openGraph: {
    title: 'ChadWallet — Trade Solana Like a Chad',
    description:
      'Lightning-fast Solana swaps, real-time charts, and social trading.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ChadWallet',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChadWallet — Trade Solana Like a Chad',
    description:
      'Lightning-fast Solana swaps, real-time charts, and social trading.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="font-sans bg-[#0a0e1a] text-white antialiased min-h-screen flex flex-col">
        <AppProviders>
          {/* Top token banner */}
          {/* <TokenBanner direction="left" speed="normal" /> */}

          {/* Header */}
          <Header />

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Bottom token banner */}
          <TokenBanner direction="right" speed="slow" />
        </AppProviders>
      </body>
    </html>
  );
}
