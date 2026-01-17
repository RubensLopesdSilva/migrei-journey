import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Clock, Target, Sparkles } from "lucide-react";
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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge - Social proof mais específico */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              +2.000 profissionais já fizeram sua transição
            </motion.div>

            {/* Headline - Resultado tangível em 30 segundos */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Descubra sua nova carreira{" "}
              <span className="text-primary">em 90 dias.</span>
            </motion.h1>

            {/* Subheadline - Benefício concreto + como funciona */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Saia da paralisia de não saber o próximo passo. 
              O Migrei te guia do autoconhecimento à ação com um <strong>plano personalizado</strong> e <strong>IA que te acompanha 24/7</strong>.
            </motion.p>

            {/* Quick Win Promise - O que ganha em 5 minutos */}
            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="flex items-center gap-2 bg-primary/10 text-foreground px-4 py-2 rounded-full border border-primary/20">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium"><strong>5 min</strong> para seu 1º diagnóstico</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 text-foreground px-4 py-2 rounded-full border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium"><strong>IA</strong> que te acompanha 24/7</span>
              </div>
            </motion.div>

            {/* CTAs - Mais específicos */}
            <motion.div
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg group"
                onClick={() => navigate("/auth")}
              >
                Fazer meu diagnóstico grátis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                onClick={() => scrollToSection("como-funciona")}
              >
                <Play className="mr-2 h-5 w-5" />
                Ver o método em 2 min
              </Button>
            </motion.div>

            {/* Trust badges - Mais relevantes */}
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Resultado em 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Plano grátis para sempre</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Migrei Wheel */}
          <motion.div 
            className="flex justify-center lg:justify-center order-1 lg:order-2 relative w-full h-full min-h-[400px] lg:min-h-[500px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <HeroMigreiWheel />
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
