'use client';

// =============================================================================
// DownloadCTA — App store download section
// =============================================================================

import { APP_LINKS } from '@/lib/constants';

export default function DownloadCTA() {
  return (
    <section id="download" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-amber-950/10 to-[#0a0e1a]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Trade Anywhere,{' '}
          <span className="text-amber-400">Anytime</span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-10">
          Download ChadWallet on your phone and never miss a trade. Available on iOS and Android.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* App Store button */}
          <a
            href={APP_LINKS.ios}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3.5 bg-white/[0.05] border border-white/[0.1] rounded-xl hover:bg-white/[0.08] hover:border-white/[0.15] transition-all group"
          >
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] text-gray-400 leading-tight">Download on the</div>
              <div className="text-sm font-semibold text-white leading-tight">App Store</div>
            </div>
          </a>

          {/* Play Store button */}
          <a
            href={APP_LINKS.android}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3.5 bg-white/[0.05] border border-white/[0.1] rounded-xl hover:bg-white/[0.08] hover:border-white/[0.15] transition-all group"
          >
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.32 12l2.378-2.492zM5.864 2.658L16.801 8.99l-2.302 2.302-8.635-8.634z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] text-gray-400 leading-tight">Get it on</div>
              <div className="text-sm font-semibold text-white leading-tight">Google Play</div>
            </div>
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Non-Custodial
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Lightning Fast
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Bank-Grade Security
          </div>
        </div>
      </div>
    </section>
  );
}
