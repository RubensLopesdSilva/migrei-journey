import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroMigreiWheel } from "./HeroMigreiWheel";

export const LandingHero = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient - matching Figma style */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/3" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/10 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-left order-2 lg:order-1">
            {/* Headline with underline accent */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Estamos aqui para{" "}
              <span className="relative inline-block">
                guiar sua transição
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>{" "}
              <span className="text-primary">de carreira</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Saia da dúvida e entre em ação com o <strong className="text-foreground">Ciclo Migrei</strong> — um método estruturado com as ferramentas certas para sua jornada profissional.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full group shadow-lg shadow-primary/20"
                onClick={() => navigate("/auth")}
              >
                Começar grátis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="px-6 py-6 text-lg group"
                onClick={() => scrollToSection("como-funciona")}
              >
                <div className="w-10 h-10 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center mr-3 group-hover:border-primary transition-colors">
                  <Play className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-0.5" />
                </div>
                Como funciona
              </Button>
            </motion.div>
          </div>

          {/* Right: Migrei Wheel */}
          <motion.div 
            className="flex justify-center lg:justify-end order-1 lg:order-2 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <HeroMigreiWheel />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};
