import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroMigreiWheel } from "./HeroMigreiWheel";
import avatar1 from "@/assets/avatars/avatar-1.jpg";
import avatar2 from "@/assets/avatars/avatar-2.jpg";
import avatar3 from "@/assets/avatars/avatar-3.jpg";
import avatar4 from "@/assets/avatars/avatar-4.jpg";

export const LandingHero = () => {
  const navigate = useNavigate();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20 pb-8 bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        {/* Mobile Layout - Stacked vertically */}
        <div className="flex flex-col items-center text-center lg:hidden">
          {/* Eyebrow badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 max-w-full" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex -space-x-2 flex-shrink-0">
              <img src={avatar1} alt="" className="w-6 h-6 rounded-full border-2 border-background object-cover" />
              <img src={avatar2} alt="" className="w-6 h-6 rounded-full border-2 border-background object-cover" />
            </div>
            <span className="text-[11px] font-medium text-primary whitespace-nowrap">51% consideram mudar de carreira</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Facilite a sua{" "}
            <span className="relative inline-block text-primary">
              transição
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" aria-hidden="true">
                <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{" "}
            de carreira
          </motion.h1>

          {/* Subheadline - Above wheel */}
          <motion.p 
            className="text-sm sm:text-base text-muted-foreground max-w-xs mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            O Ciclo Migrei te guia em 6 fases simples.
          </motion.p>

          {/* Migrei Wheel - Clean and centered */}
          <motion.div 
            className="relative -mt-28 -mb-24"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="scale-[0.50] origin-center">
              <HeroMigreiWheel hideTooltip />
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 text-base rounded-full group shadow-lg shadow-primary/20" onClick={() => navigate("/auth?tab=signup")}>
              Começar grátis
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-5 py-5 text-base rounded-full" onClick={() => scrollToSection("ciclo-migrei")}>
              Ver como funciona
            </Button>
          </motion.div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Text Content */}
          <div className="text-left">
            {/* Eyebrow with avatars */}
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex -space-x-2">
                <img src={avatar1} alt="" className="w-7 h-7 rounded-full border-2 border-background object-cover" />
                <img src={avatar2} alt="" className="w-7 h-7 rounded-full border-2 border-background object-cover" />
                <img src={avatar3} alt="" className="w-7 h-7 rounded-full border-2 border-background object-cover" />
                <img src={avatar4} alt="" className="w-7 h-7 rounded-full border-2 border-background object-cover" />
              </div>
              <span className="text-sm font-medium text-primary">51% dos profissionais consideram fazer transição de carreira</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Facilite a sua{" "}
              <span className="relative inline-block text-primary">
                transição
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" aria-hidden="true">
                  <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              de carreira
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              O Ciclo Migrei te guia em 6 fases simples.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group shadow-lg shadow-primary/20" onClick={() => navigate("/auth?tab=signup")}>
                Começar grátis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="px-6 py-6 text-lg rounded-full" onClick={() => scrollToSection("ciclo-migrei")}>
                Ver como funciona
              </Button>
            </motion.div>

          </div>

          {/* Migrei Wheel */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="scale-90 xl:scale-100">
              <HeroMigreiWheel />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Transition to next section */}
      <motion.div className="absolute bottom-0 left-0 right-0 pb-8" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.8
    }}>
        <div className="container mx-auto px-6 text-center">
          
          <motion.button onClick={() => scrollToSection("como-funciona")} className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-muted-foreground/20 bg-background/50 backdrop-blur-sm hover:bg-muted/50 transition-colors" animate={{
          y: [0, 6, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }}>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>
      </motion.div>
    </section>;
};