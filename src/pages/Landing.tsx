import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSocialProof } from "@/components/landing/LandingSocialProof";
import { LandingSolution } from "@/components/landing/LandingSolution";
import { LandingFeatures } from "@/components/landing/LandingFeatures";

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
        <LandingSocialProof />
        <LandingSolution />
        <LandingFeatures />
        <LandingCycle />
        
        <LandingPricing />
        <LandingFAQ />
      </main>
      
      <LandingFooter />
    </div>
  );
};

export default Landing;
