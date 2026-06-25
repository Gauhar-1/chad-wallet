import HeroSection from '@/features/landing/HeroSection';
import StatsBar from '@/features/landing/StatsBar';
import FeatureCards from '@/features/landing/FeatureCards';
import DownloadCTA from '@/features/landing/DownloadCTA';
import SocialProof from '@/features/landing/SocialProof';
import Footer from '@/components/layout/Footer';
import TokenBanner from '@/components/common/TokenBanner';

export default function HomePage() {
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
    </>
  );
}
