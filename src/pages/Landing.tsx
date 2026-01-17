import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSolution } from "@/components/landing/LandingSolution";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingCycle } from "@/components/landing/LandingCycle";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingFAQ } from "@/components/landing/LandingFAQ";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main>
        <LandingHero />
        <LandingSolution />
        <LandingFeatures />
        <LandingCTA />
        <LandingCycle />
        <LandingPricing />
        <LandingFAQ />
      </main>
      
      <LandingFooter />
    </div>
  );
};

export default Landing;
