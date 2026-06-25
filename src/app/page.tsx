import HeroSection from '@/features/landing/HeroSection';
import StatsBar from '@/features/landing/StatsBar';
import FeatureCards from '@/features/landing/FeatureCards';
import DownloadCTA from '@/features/landing/DownloadCTA';
import SocialProof from '@/features/landing/SocialProof';
import Footer from '@/components/layout/Footer';
import TokenBanner from '@/components/common/TokenBanner';
import AuthModal from '@/components/auth/AuthModal';
import { Suspense } from 'react';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ login?: string }>;
}) {
  const resolvedParams = await searchParams;
  const showLogin = resolvedParams?.login === 'true';

  return (
    <>
      <HeroSection />
      {/* Top token banner */}
          <TokenBanner direction="left" speed="fast" />
      <StatsBar />
      <FeatureCards />
      <SocialProof />
      <DownloadCTA />
      <Footer />
      
      {showLogin && (
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      )}
    </>
  );
}
