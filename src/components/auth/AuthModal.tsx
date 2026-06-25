'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthModal() {
  const { login, ready, authenticated } = usePrivy();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle mounting and strict scroll-locking
  useEffect(() => {
    setMounted(true);
    
    // Lock the background scrolling securely
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle authenticated redirect
  useEffect(() => {
    if (ready && authenticated && searchParams.get('login') === 'true') {
      handleClose('/trade');
    }
  }, [ready, authenticated, router, searchParams]);

  // Smooth unmount handler
  const handleClose = (redirectPath = '/') => {
    setIsClosing(true);
    setTimeout(() => {
      router.push(redirectPath);
    }, 300); 
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0 font-sans">
      
      {/* 1. The Backdrop: Deep space-dark blur masking the hero section */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ease-out",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        onClick={() => {
          if (searchParams.get('login') === 'true') handleClose('/');
        }}
      />

      {/* 2. The Modal Card: Chad Green ambient glow, pure neutral darks, fomo spacing */}
      <div 
        className={cn(
          "relative w-full max-w-[420px] bg-[#09090b]/95 backdrop-blur-3xl border border-white/[0.08] rounded-[32px] p-10 shadow-[0_0_120px_-20px_rgba(74,222,128,0.25),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-300 ease-out",
          isClosing 
            ? "opacity-0 scale-95 translate-y-2" 
            : "opacity-100 scale-100 translate-y-0"
        )}
      >
        
        {/* Distinctive Circular Close Button (Fomo style, neutral dark) */}
        <button 
          onClick={() => {
            if (searchParams.get('login') === 'true') handleClose('/');
          }}
          className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 bg-[#18181b] border border-white/[0.08] text-[#a1a1aa] hover:text-white hover:bg-[#27272a] hover:scale-105 active:scale-95 transition-all rounded-full z-10"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          
          {/* Brand Header */}
          <h2 className="text-[34px] font-extrabold text-white tracking-tighter lowercase mb-2">
            chad<span className="text-[#4ade80]">Wallet.</span>
          </h2>
          <p className="text-[15px] text-[#a1a1aa] font-medium tracking-tight mb-10 max-w-[260px] leading-snug">
            Login or create an account to start trading.
          </p>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3.5">
            
            {/* Apple Button: High Contrast Primary Draw */}
            <button
              onClick={() => login()}
              className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-[16px] font-semibold text-[15px] tracking-tight transition-all duration-200 bg-white text-black hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]"
            >
              <svg className="w-[18px] h-[18px] mb-[2px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.641-.026 2.62-1.48 3.595-2.91 1.13-1.636 1.595-3.218 1.623-3.3-.035-.018-3.08-1.173-3.112-4.717-.026-2.96 2.42-4.382 2.531-4.454-1.378-2.016-3.498-2.28-4.24-2.327-1.558-.083-3.155 1.044-3.96 1.044zm-1.066-2.735c.854-1.04 1.429-2.484 1.272-3.918-1.222.049-2.723.82-3.6 1.854-.783.896-1.43 2.36-1.258 3.766 1.365.106 2.73-.703 3.586-1.702z" />
              </svg>
              Continue with Apple
            </button>

            {/* Google Button: Subtle Dark Secondary Draw */}
            <button
              onClick={() => login()}
              className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-[16px] font-semibold text-[15px] tracking-tight transition-all duration-200 bg-[#0a0a0a] text-white border border-white/[0.1] hover:bg-[#18181b] hover:border-white/[0.15] active:scale-[0.98]"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Legal Footer */}
          <p className="mt-8 text-[12px] text-[#71717a] font-medium tracking-tight leading-relaxed">
            By signing up, you agree to our Terms of Service <br />
            and Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
}