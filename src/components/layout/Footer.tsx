'use client';

import Link from 'next/link';

// =============================================================================
// Configuration: Extracting data keeps the component logic clean and maintainable
// =============================================================================
type FooterLink = {
  name: string;
  href: string;
  hoverColor?: string;
};

type FooterSection = {
  header: string;
  links: FooterLink[];
};

const FOOTER_DATA: FooterSection[] = [
  {
    header: 'about',
    links: [
      { name: 'blog', href: '/blog' },
      { name: 'documentation', href: '/docs' },
      { name: 'api reference', href: '/api-docs' },
      { name: 'affiliates', href: '/affiliates' },
    ],
  },
  {
    header: 'social',
    links: [
      { name: 'discord', href: '#', hoverColor: 'hover:text-[#5865F2]' },
      { name: 'x / twitter', href: '#', hoverColor: 'hover:text-white' },
      { name: 'telegram', href: '#', hoverColor: 'hover:text-[#0088cc]' },
      { name: 'youtube', href: '#', hoverColor: 'hover:text-[#FF0000]' },
    ],
  },
  {
    header: 'legal',
    links: [
      { name: 'privacy policy', href: '/privacy' },
      { name: 'terms of service', href: '/terms' },
      { name: 'cookie policy', href: '/cookies' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] border-t border-white/[0.02] pt-24 pb-8 overflow-hidden font-sans selection:bg-[#4ade80] selection:text-black">
      
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#4ade80]/[0.015] blur-[100px] pointer-events-none rounded-full translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Main Flex Layout: Brand on Left, Navigation on Right */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 mb-24">
          
          {/* Brand & Mission Segment */}
          <div className="max-w-md flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 group mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4ade80] to-[#22c55e] flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.2)] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(74,222,128,0.4)]">
                  <img src="/logo/light.png" alt="chadwallet icon" className="font-black text-black rounded-lg text-xl leading-none tracking-tighter" />
                </div>
                <span className="text-3xl font-extrabold text-white tracking-tight lowercase">
                  chad<span className="text-[#4ade80]">Wallet.</span>
                </span>
              </Link>
              <p className="text-[#a1a1aa] text-lg font-medium tracking-tight leading-relaxed">
                where degens become legends. the fastest, most secure terminal for dominating solana trenches.
              </p>
            </div>

            {/* Technical Status Indicator (Loved by Senior Engineers) */}
            <div className="mt-10 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm w-max">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4ade80]"></span>
              </div>
              <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-[0.15em]">
                all systems operational
              </span>
            </div>
          </div>

          {/* Semantic Navigation Grid */}
          <nav aria-label="Footer Navigation" className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-20">
            {FOOTER_DATA.map((section) => (
              <div key={section.header}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-6">
                  {section.header}
                </h3>
                <ul role="list" className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className={`group flex items-center text-[#71717a] font-medium tracking-tight lowercase transition-all duration-300 ${link.hoverColor || 'hover:text-white'}`}
                      >
                        <span className="relative overflow-hidden">
                          {/* Animated underline effect on hover */}
                          <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                            {link.name}
                          </span>
                          <span className="absolute top-0 left-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                            {link.name}
                          </span>
                        </span>
                        {/* Subtle arrow indicator that slides in */}
                        <svg className="w-3 h-3 ml-1 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-[#52525b] font-medium tracking-tight lowercase">
            © {currentYear} chadwallet labs inc.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[13px] text-[#52525b] font-medium tracking-tight lowercase flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              english (us)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}