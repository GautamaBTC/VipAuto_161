import { StickyMobileActions } from "@/components/effects/StickyMobileActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { CompareSection } from "@/components/sections/CompareSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-3 focus:py-2"
      >
        Перейти к содержимому
      </a>
      <ScrollProgress />
      <Header />
      <main id="main-content">
        <HeroSection />
        <CompareSection />
        <StatsSection />
        <ServicesSection />
        <AdvantagesSection />
        <ProcessSection />
        <BrandsSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <StickyMobileActions />
      <Footer />
    </>
  );
}
