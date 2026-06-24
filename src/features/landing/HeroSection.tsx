'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    // Height handles mobile screen heights dynamically, adjusting the minimum height for absolute positioning assets.
    <section className="relative w-full h-[120vh] min-h-[850px] md:min-h-[1000px] flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      
      {/* 2. THE SUN BACKGROUND (Z-index 0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/assets/sun.jpg" 
          alt="Blazing Sun Background" 
          className="w-full h-full object-cover object-left opacity-90"
        />
      </div>

      {/* 3. THE BLUR & SHADOW GRADIENTS (Z-index 10) */}
      {/* Adjusted mobile gradients to ensure text visibility when elements stack vertically */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b md:bg-gradient-to-r from-black/50 via-black/30 to-black/90 md:from-transparent md:via-black/40 md:to-black/90 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/95 pointer-events-none" />

      {/* 4. THE FOREGROUND CHARACTER (Z-index 20) */}
      {/* On mobile: scales to 110% width, stays neatly at right-0 bottom-0 to avoid overflow scrolling. */}
      {/* On desktop (md:): shifts back out to -right-60 and takes up 65% width as intended. */}
      <div className="absolute bottom-0 right-0 md:-right-60 z-20 w-[110%] sm:w-[85%] md:w-[65%] max-w-[1000px] pointer-events-none flex justify-end translate-y-[5%] md:translate-y-0">
        <img 
          src="/assets/hero-character.png" 
          alt="Chad cooking on spaceship balcony" 
          className="w-full h-auto object-contain drop-shadow-[0_-20px_40px_rgba(0,0,0,0.9)]"
        />
      </div>

      {/* 5. THE TYPOGRAPHY & BUTTONS (Z-index 30) */}
      {/* Added responsive top-margin pulling to keep the layout centered perfectly on phone displays */}
      <div className="relative z-30 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-[-20vh] md:mt-[-10vh]">
        
        {/* Main Logo Text - Safely scales from 4.5rem on small displays to 10rem on desktop */}
        <h1 className="text-[4.5rem] sm:text-[7rem] md:text-[10rem] font-extrabold tracking-tighter leading-none mb-2 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
          chad
        </h1>

        {/* Primary Subtitle */}
        <h2 className="text-xl sm:text-3xl md:text-4xl font-medium tracking-tight text-gray-200 mb-3 drop-shadow-md">
          where traders become legends.
        </h2>

        {/* Secondary Subtitle */}
        <p className="text-sm sm:text-lg text-gray-400 font-normal max-w-xl md:max-w-2xl mb-8 drop-shadow">
          From memecoins to viral tokens, trade any crypto in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-6 sm:px-0">
          <Link href="/trade" className="w-full sm:w-auto">
            <button className="flex items-center justify-center w-full sm:min-w-[200px] px-8 py-4 bg-[#4ade80] text-black text-base font-bold rounded-2xl transition-all hover:bg-[#3ac16d] hover:scale-105 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
              Start trading
            </button>
          </Link>
          <a href="#download" className="w-full sm:w-auto">
            <button className="flex items-center justify-center w-full sm:min-w-[200px] px-8 py-4 bg-white/5 text-white text-base font-medium rounded-2xl border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105">
              Download app
            </button>
          </a>
        </div>
      </div>

    </section>
  );
}