'use client';

// =============================================================================
// Header — Ultra-Minimalist Cinematic Layout (fomo.family style)
// =============================================================================

import Link from 'next/link';
import AuthButton from '@/features/auth/AuthButton';
import { cn } from '@/lib/utils';

export default function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        // Absolute positioning ensures it overlays perfectly on the cinematic hero image
        // without pushing the image down.
        'absolute top-0 left-0 right-0 z-50 w-full',
        // A very subtle gradient from the top down ensures the text is always readable 
        // regardless of how bright your background image is.
        'bg-gradient-to-b from-black/70 via-black/20 to-transparent pt-6 pb-12',
        className
      )}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        {/* Matching the bold, lowercase, typography-only style of fomo */}
        <Link href="/" className="group flex items-center">
          <span className="text-[2rem] font-extrabold tracking-tighter text-white drop-shadow-lg transition-transform group-hover:scale-105">
            chad
          </span>
        </Link>

        {/* Right Side: App Links + Auth */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Desktop App Links - Mimicking the fomo layout exactly */}
          <nav className="hidden md:flex items-center gap-3 mr-2">
            <a
              href="https://apps.apple.com/us/app/chadwallet/id6757367474"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-sm font-semibold text-white backdrop-blur-md transition-all duration-300"
            >
              {/* Apple Icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.48.06 2.65.65 3.42 1.69-2.31 1.25-1.92 4.41.34 5.39-.77 2.1-1.95 4.31-2.43 5.85zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-sm font-semibold text-white backdrop-blur-md transition-all duration-300"
            >
              {/* Google Play Icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 20.5v-17c0-.55.45-1 1-1 .28 0 .53.11.71.29l11.5 11.5c.2.2.2.51 0 .71L4.71 21.21c-.18.18-.43.29-.71.29-.55 0-1-.45-1-1zM4.5 4.91v14.18l7.09-7.09L4.5 4.91zM18.79 12.5l-2.08 2.08-2.5-2.5 2.5-2.5 2.08 2.08c.2.2.2.51 0 .71z"/>
              </svg>
              Google Play
            </a>
          </nav>

          {/* Login/Auth Button */}
          {/* Note: Make sure the AuthButton component itself uses a sleek design (like text-only or a thin white border) to fit this aesthetic. */}
          <div className="relative z-10">
            <AuthButton />
          </div>
          
        </div>
      </div>
    </header>
  );
}