import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Target, Users, Sparkles, Brain, MessageCircle, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollToNextButton } from "./ScrollToNextButton";

// Abstract Illustration: Ciclo Migrei
const CycleIllustration = () => (
  <div className="relative w-full h-64 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl overflow-hidden">
    {/* Abstract shapes representing the cycle */}
    <motion.div 
      className="absolute top-8 left-8 w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
    />
    <motion.div 
      className="absolute top-6 left-28 w-12 h-12 rounded-full bg-accent/30"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    />
    <motion.div 
      className="absolute top-4 right-12"
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      <ArrowRight className="w-6 h-6 text-primary/60 rotate-45" />
    </motion.div>
    
    {/* Center card */}
    <motion.div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-xl px-5 py-4 shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      <p className="text-primary-foreground font-semibold text-sm">Ciclo Migrei</p>
      <p className="text-primary-foreground/80 text-xs">6 Fases | Estruturado</p>
    </motion.div>
    
    {/* Bottom circles */}
    <motion.div 
      className="absolute bottom-8 left-12 w-14 h-14 rounded-full bg-muted border-4 border-primary/20"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
    />
    <motion.div 
      className="absolute bottom-10 left-28 w-10 h-10 rounded-full bg-primary/40"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
    />
    <motion.div 
      className="absolute bottom-6 right-16 w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.7 }}
    >
      <MessageCircle className="w-6 h-6 text-accent" />
    </motion.div>
  </div>
);

// Abstract Illustration: Plano 90 Dias
const PlanIllustration = () => (
  <div className="relative w-full h-64 bg-gradient-to-br from-primary/5 to-muted rounded-2xl overflow-hidden">
    {/* Top decorative elements */}
    <motion.div 
      className="absolute top-6 left-6 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
    >
      <Calendar className="w-5 h-5 text-primary/60" />
    </motion.div>
    
    {/* Center card */}
    <motion.div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-xl px-6 py-5 shadow-lg min-w-[180px]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
          <Target className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
      <p className="text-primary-foreground font-semibold">Plano de 90 Dias</p>
      <p className="text-primary-foreground/80 text-sm">3 Meses | 12 Semanas</p>
    </motion.div>
    
    {/* Bar chart visualization */}
    <motion.div 
      className="absolute bottom-8 left-8 right-8 flex items-end justify-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
    >
      <div className="w-6 h-10 bg-primary/30 rounded-t" />
      <div className="w-6 h-14 bg-primary/40 rounded-t" />
      <div className="w-6 h-20 bg-primary/60 rounded-t" />
      <div className="w-6 h-16 bg-primary/50 rounded-t" />
      <div className="w-6 h-12 bg-primary/35 rounded-t" />
    </motion.div>
  </div>
);

// Abstract Illustration: Mentoria
const MentoringIllustration = () => (
  <div className="relative w-full h-64 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl overflow-hidden">
    {/* Donut chart */}
    <motion.div 
      className="absolute top-6 right-8"
      initial={{ opacity: 0, rotate: -90 }}
      whileInView={{ opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="30" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <circle 
          cx="40" 
          cy="40" 
          r="30" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="8" 
          strokeDasharray="113 188" 
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
        <circle 
          cx="40" 
          cy="40" 
          r="30" 
          fill="none" 
          stroke="hsl(var(--accent))" 
          strokeWidth="8" 
          strokeDasharray="75 188" 
          strokeDashoffset="-113"
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-xs font-medium text-muted-foreground">60%</span>
      </div>
    </motion.div>
    
    <motion.div 
      className="absolute top-8 right-24 text-xs text-muted-foreground"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
    >
      40%
    </motion.div>
    
    {/* Icon cards */}
    <motion.div 
      className="absolute top-24 right-12 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      <TrendingUp className="w-5 h-5 text-primary" />
    </motion.div>
    
    <motion.div 
      className="absolute bottom-20 right-16 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center"
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
    >
      <Users className="w-4 h-4 text-accent" />
    </motion.div>
    
    <motion.div 
      className="absolute bottom-12 right-8 w-12 h-12 rounded-xl bg-muted flex items-center justify-center border"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
    >
      <BarChart3 className="w-5 h-5 text-primary" />
    </motion.div>
    
    {/* Left side cards */}
    <motion.div 
      className="absolute top-12 left-6 space-y-3"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-32 h-6 bg-muted rounded-md" />
      <div className="w-24 h-4 bg-muted/60 rounded-md" />
    </motion.div>
    
    <motion.div 
      className="absolute bottom-24 left-6 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
    >
      <Sparkles className="w-4 h-4 text-primary" />
    </motion.div>
    
    <motion.div 
      className="absolute bottom-8 left-6 space-y-2"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
    >
      <div className="w-20 h-4 bg-muted rounded-md" />
      <div className="w-28 h-3 bg-muted/50 rounded-md" />
    </motion.div>
  </div>
);

const features = [
  {
    title: "Ciclo Migrei",
    description: "Percorra as 6 fases estruturadas da transição de carreira com atividades práticas e acompanhamento visual do seu progresso.",
    illustration: <CycleIllustration />,
  },
  {
    title: "Plano de 90 Dias",
    description: "Cronograma semanal personalizado com metas SMART. Saiba exatamente o que fazer cada semana para avançar.",
    illustration: <PlanIllustration />,
  },
  {
    title: "Mentoria Especializada",
    description: "Orientação personalizada de mentores que já realizaram transições de carreira bem-sucedidas.",
    illustration: <MentoringIllustration />,
  },
];

export const LandingFeatures = () => {
  const navigate = useNavigate();
  
  return (
    <section id="recursos" className="relative overflow-hidden py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Header Row */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <div className="lg:max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Recursos que{" "}
              <span className="text-primary">você pode usar</span>
            </h2>
          </div>
          
          {/* Description + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 lg:max-w-xl">
            <p className="text-muted-foreground text-lg leading-relaxed flex-1">
              Oferecemos recursos práticos e exclusivos que vão te ajudar a aumentar sua produtividade e gerenciar sua transição de carreira com facilidade.
            </p>
            <Button 
              className="btn-primary-gradient rounded-full shrink-0"
              onClick={() => navigate("/auth?tab=signup")}
            >
              Começar agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Illustration Card */}
              <div className="mb-6 rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                {feature.illustration}
              </div>
              
              {/* Text Content */}
              <h3 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Scroll to next section */}
      <div id="funcionalidades" className="pt-8">
        <ScrollToNextButton targetId="ciclo-migrei" />
      </div>
    </section>
  );
};
