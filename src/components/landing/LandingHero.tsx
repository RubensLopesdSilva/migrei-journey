import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroMigreiWheel } from "./HeroMigreiWheel";
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
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-muted/30">
      
      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-left order-2 lg:order-1">
            {/* Pain Point Hook */}
            <motion.p className="text-sm md:text-base text-primary font-medium mb-4" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.4
          }}>
              Para quem sabe que precisa mudar, mas não sabe por onde começar
            </motion.p>

            {/* Headline - Benefit focused */}
            <motion.h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }}>
              Saia da paralisia e tenha{" "}
              <span className="relative inline-block">
                clareza
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              <span className="text-primary">na transição de carreira.</span>
            </motion.h1>

            {/* Subheadline - What + How */}
            <motion.p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }}>O .Ciclo Migrei é uma metodologia em 6 fases que te guia na transição de carreira.<strong className="text-foreground">Ciclo Migrei</strong> é uma metodologia em 6 fases que te guia da confusão à ação — com ferramentas práticas, IA e uma comunidade de apoio.
            </motion.p>

            {/* CTAs */}
            <motion.div className="flex flex-col sm:flex-row items-start gap-4" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group shadow-lg shadow-primary/20" onClick={() => navigate("/auth?tab=signup")}>
                Começar grátis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="px-6 py-6 text-lg rounded-full" onClick={() => scrollToSection("como-funciona")}>
                Ver como funciona
              </Button>
            </motion.div>

            {/* Trust indicator */}
            <motion.p className="text-sm text-muted-foreground mt-6" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.5
          }}>✓ Gratuito para começar  ·  ✓ Fases iniciais do Ciclo Migrei</motion.p>
          </div>

          {/* Right: Migrei Wheel */}
          <motion.div className="flex justify-center lg:justify-center order-1 lg:order-2" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }}>
            <div className="relative scale-75 md:scale-80 lg:scale-90 xl:scale-100">
              <HeroMigreiWheel />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{
      y: [0, 10, 0]
    }} transition={{
      duration: 2,
      repeat: Infinity
    }}>
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
        </div>
      </motion.div>
    </section>;
};