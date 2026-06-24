import HeroSection from '@/features/landing/HeroSection';
import StatsBar from '@/features/landing/StatsBar';
import FeatureCards from '@/features/landing/FeatureCards';
import DownloadCTA from '@/features/landing/DownloadCTA';
import SocialProof from '@/features/landing/SocialProof';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeatureCards />
      <SocialProof />
      <DownloadCTA />
      <Footer />
    </>
  );
}
