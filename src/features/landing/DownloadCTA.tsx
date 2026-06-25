'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

// asset references for the memes
const MEME_ASSETS = [
  { id: 1, src: '/assets/doge.jpg', alt: 'Doge meme' },
  { id: 2, src: '/assets/penguin.jpg', alt: 'Penguin meme' },
  { id: 3, src: '/assets/pepe.jpg', alt: 'Pepe meme' },
  { id: 4, src: '/assets/rocket.jpg', alt: 'Rocket meme' },
  // Add more as needed
];

// Number of memes to spawn
const NUM_MEMES = 12;

export default function DownloadCTAWithMemes() {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Store particle physics data separately from React state for performance
  const particles = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    vr: number;
    width: number;
    height: number;
  }>>([]);

  useEffect(() => {
    setIsMounted(true);
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Initialize particles with random positions and velocities
    particles.current = Array.from({ length: NUM_MEMES }).map(() => ({
      x: Math.random() * (containerWidth - 100), // Account for rough size
      y: Math.random() * (containerHeight - 100),
      vx: (Math.random() - 0.5) * 6, // Velocity X
      vy: (Math.random() - 0.5) * 6, // Velocity Y
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 2, // Velocity Rotation
      width: 100, // Approximate size
      height: 100,
    }));

    let animationFrameId: number;

    const animateMemes = () => {
      const currentContainerWidth = container.offsetWidth;
      const currentContainerHeight = container.offsetHeight;

      particles.current.forEach((particle, index) => {
        const ref = particleRefs.current[index];
        if (!ref) return;

        // Update Position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.vr;

        // Boundary Collision Detection (simple bouncing)
        // Adjust padding as needed based on image size/aspect
        const padding = 20;
        
        // Right/Left wall bounce
        if (particle.x + particle.width > currentContainerWidth - padding || particle.x < padding) {
          particle.vx *= -1;
        }

        // Top/Bottom wall bounce
        if (particle.y + particle.height > currentContainerHeight - padding || particle.y < padding) {
          particle.vy *= -1;
        }

        // Direct DOM update for performance inside animation loop
        ref.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`;
      });

      animationFrameId = requestAnimationFrame(animateMemes);
    };

    animationFrameId = requestAnimationFrame(animateMemes);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section id="download" className="relative w-full py-32 px-4 bg-[#050505] font-sans overflow-hidden border-t border-white/[0.02] z-30">
      
      {/* 1. LAYER 1: Dynamic Meme Background Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
        {isMounted && Array.from({ length: NUM_MEMES }).map((_, index) => {
          const asset = MEME_ASSETS[Math.floor(Math.random() * MEME_ASSETS.length)];
          
          return (
            <div
              key={index}
              ref={(el) => { particleRefs.current[index] = el; }}
              className="absolute w-24 md:w-32 aspect-square transition-transform duration-100 ease-linear"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.4))',
              }}
            >
              <img
                src={asset.src}
                alt={asset.alt}
                className="w-full h-full object-contain"
              />
            </div>
          );
        })}
        {/* Subtle dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none" />
      </div>

      {/* 2. LAYER 2: Foreground Content (Z-index 10) */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Fomo-style Typography: lowercase, tight tracking */}
        <h2 className="text-4xl md:text-[5rem] font-bold text-white mb-6 tracking-tighter leading-none">
          trade anywhere, <span className="bg-gradient-to-b from-[#f59e0b] to-[#b47108] bg-clip-text text-[#4ade80]">anytime.</span>
        </h2>
        
        <p className="text-[#a1a1aa] text-lg md:text-xl font-medium max-w-xl mx-auto mb-16 tracking-tight leading-relaxed">
          download chadwallet on your phone and never miss a trade. available on ios and android.
        </p>

        {/* 3. App Store Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto px-6 sm:px-0">
          
          {/* App Store button */}
          <a
            href="https://apps.apple.com/app/chadwallet" // Replace with real link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-8 py-5 bg-[#0a0a0a] border border-white/[0.04] rounded-2xl transition-all hover:bg-white/[0.05] hover:border-white/[0.08] hover:scale-105 group"
          >
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-[11px] text-[#a1a1aa] uppercase tracking-[0.2em] leading-tight font-bold">Download on the</div>
              <div className="text-base font-semibold text-white leading-tight tracking-tight">App Store</div>
            </div>
          </a>

          {/* Play Store button */}
          <a
            href="https://play.google.com/store/apps/details?id=io.chadwallet" // Replace with real link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-8 py-5 bg-[#0a0a0a] border border-white/[0.04] rounded-2xl transition-all hover:bg-white/[0.05] hover:border-white/[0.08] hover:scale-105 group"
          >
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.32 12l2.378-2.492zM5.864 2.658L16.801 8.99l-2.302 2.302-8.635-8.634z" />
            </svg>
            <div className="text-left">
              <div className="text-[11px] text-[#a1a1aa] uppercase tracking-[0.2em] leading-tight font-bold">Get it on</div>
              <div className="text-base font-semibold text-white leading-tight tracking-tight">Google Play</div>
            </div>
          </a>

        </div>

        {/* 4. Trust Signals - Updated Typography */}
        <div className="mt-20 flex flex-wrap justify-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em]">
          
          <div className="flex items-center gap-2.5 text-[#a1a1aa] group transition-colors hover:text-white">
            <svg className="w-5 h-5 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            non-custodial
          </div>

          <div className="flex items-center gap-2.5 text-[#a1a1aa] group transition-colors hover:text-white">
            <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            lightning fast
          </div>

          <div className="flex items-center gap-2.5 text-[#a1a1aa] group transition-colors hover:text-white">
            <svg className="w-5 h-5 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            bank-grade security
          </div>

        </div>
      </div>
    </section>
  );
}