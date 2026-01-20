import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEOHead } from "@/components/seo";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSolution } from "@/components/landing/LandingSolution";
import { LandingFeatures } from "@/components/landing/LandingFeatures";

import { LandingCycle } from "@/components/landing/LandingCycle";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingFAQ } from "@/components/landing/LandingFAQ";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Landing = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);
  return (
    <>
      <SEOHead
        title="Migrei | Transição de Carreira em 6 Fases - Método Comprovado"
        description="Descubra o Ciclo Migrei: método estruturado em 6 fases para transição de carreira com clareza. Gratuito para começar. 87% relatam mais clareza em 30 dias."
        canonical="https://migrei.com/landing"
      />
      
      <div className="min-h-screen bg-background">
        <LandingHeader />
        
        <main role="main" aria-label="Conteúdo principal">
          <LandingHero />
          <LandingSolution />
          <LandingFeatures />
          <LandingCycle />
          
          <LandingPricing />
          <LandingFAQ />
        </main>
        
        <LandingFooter />
      </div>
    </>
  );
};

export default Landing;
