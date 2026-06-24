// =============================================================================
// Footer — App footer with links and branding
// =============================================================================

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#060911]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm">
                C
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Chad<span className="text-amber-400">Wallet</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              The premium Solana trading experience. Lightning swaps, live charts, 
              and social trading — built for Chads.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/trade/So11111111111111111111111111111111111111112" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Trade
                </Link>
              </li>
              <li>
                <a href="https://apps.apple.com/us/app/chadwallet/id6757367474" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  iOS App
                </a>
              </li>
              <li>
                <a href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Android App
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Community</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} ChadWallet. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
