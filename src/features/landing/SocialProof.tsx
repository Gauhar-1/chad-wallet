'use client';

// =============================================================================
// SocialProof — Trust signals and social proof section
// =============================================================================

export default function SocialProof() {
  return (
    <section className="py-20 px-4 sm:px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Trusted by <span className="text-amber-400">Thousands</span> of Traders
          </h2>
          <p className="text-gray-500 text-sm">
            Join the growing community of Solana traders who chose ChadWallet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Finally a trading app that doesn't look like it was built in 2019. The charts are crispy and swaps are instant.",
              name: 'DeFi Degen',
              handle: '@defidegen',
              avatar: '🚀',
            },
            {
              quote: "Switched from three different apps to just ChadWallet. Live trending, charts, and swaps all in one place. Absolute game changer.",
              name: 'Sol Maxi',
              handle: '@solmaxi',
              avatar: '☀️',
            },
            {
              quote: "The top holders feed gives me alpha I can't get anywhere else. Seeing what whales are doing in real-time is incredible.",
              name: 'Alpha Hunter',
              handle: '@alphahunter',
              avatar: '🐺',
            },
          ].map((testimonial) => (
            <div
              key={testimonial.handle}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
            >
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonial.handle}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
