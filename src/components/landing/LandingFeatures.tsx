import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Target, Users, Sparkles, Brain, Check, Star, TrendingUp, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollToNextButton } from "./ScrollToNextButton";

// Mockup Illustration: Ciclo Migrei
const CycleIllustration = () => {
  const phases = [
    { name: "Despertar", color: "bg-amber-500", progress: 100 },
    { name: "Descobrir", color: "bg-emerald-500", progress: 75 },
    { name: "Decidir", color: "bg-blue-500", progress: 40 },
  ];

  return (
    <div className="relative w-full h-72 bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-2xl overflow-hidden p-1">
      {/* Decorative shapes */}
      <motion.div 
        className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      />
      <motion.div 
        className="absolute top-6 left-20 w-8 h-8 rounded-full bg-accent/20"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      />
      <motion.div 
        className="absolute bottom-6 left-6 w-10 h-10 rounded-full border-4 border-primary/20 bg-background"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      />
      <motion.div 
        className="absolute bottom-8 left-20 w-6 h-6 rounded-full bg-primary/40"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      />
      
      {/* Main mockup card */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-card rounded-xl shadow-xl border overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Card header */}
        <div className="bg-primary px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground font-semibold text-sm">Ciclo Migrei</p>
            <p className="text-primary-foreground/70 text-xs">Sua jornada de transição</p>
          </div>
        </div>
        
        {/* Card content */}
        <div className="p-4 space-y-3">
          {phases.map((phase, index) => (
            <motion.div 
              key={phase.name}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className={`w-3 h-3 rounded-full ${phase.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{phase.name}</span>
                  <span className="text-[10px] text-muted-foreground">{phase.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${phase.color}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${phase.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Floating badge */}
      <motion.div 
        className="absolute bottom-4 right-4 bg-card rounded-lg px-3 py-2 shadow-lg border flex items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check className="w-3 h-3 text-emerald-500" />
        </div>
        <span className="text-xs font-medium text-foreground">6 fases</span>
      </motion.div>
    </div>
  );
};

// Mockup Illustration: Plano 90 Dias
const PlanIllustration = () => {
  const months = [
    { name: "Mês 1", tasks: 4, completed: 4, progress: 100 },
    { name: "Mês 2", tasks: 4, completed: 3, progress: 75 },
    { name: "Mês 3", tasks: 4, completed: 0, progress: 0 },
  ];

  return (
    <div className="relative w-full h-72 bg-gradient-to-br from-blue-500/5 via-background to-primary/5 rounded-2xl overflow-hidden p-1">
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <Calendar className="w-5 h-5 text-blue-500/60" />
      </motion.div>
      
      {/* Main mockup card */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-card rounded-xl shadow-xl border overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Card header */}
        <div className="bg-primary px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-primary-foreground font-semibold text-sm">Plano de 90 Dias</p>
              <p className="text-primary-foreground/70 text-xs">58% concluído</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground font-bold text-lg">58%</p>
          </div>
        </div>
        
        {/* Card content */}
        <div className="p-4 space-y-2.5">
          {months.map((month, index) => (
            <motion.div 
              key={month.name}
              className={`flex items-center gap-3 p-2 rounded-lg ${index === 1 ? 'bg-primary/5 ring-1 ring-primary/20' : 'bg-muted/30'}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                month.progress === 100 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {month.progress === 100 ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{month.name}</span>
                  <span className="text-[10px] text-muted-foreground">{month.completed}/{month.tasks}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${month.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Floating elements */}
      <motion.div 
        className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      />
      <motion.div 
        className="absolute bottom-8 left-14 w-5 h-5 rounded bg-primary/30"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      />
    </div>
  );
};

// Mockup Illustration: Mentoria
const MentoringIllustration = () => {
  const mentors = [
    { initials: "AP", name: "Ana Paula", title: "Ex-Head RH" },
    { initials: "CM", name: "Carlos M.", title: "Gerente Projetos" },
  ];

  return (
    <div className="relative w-full h-72 bg-gradient-to-br from-accent/5 via-background to-primary/5 rounded-2xl overflow-hidden p-1">
      {/* Donut chart decoration */}
      <motion.div 
        className="absolute top-4 right-4"
        initial={{ opacity: 0, rotate: -90 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="22" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle 
            cx="30" 
            cy="30" 
            r="22" 
            fill="none" 
            stroke="hsl(var(--primary))" 
            strokeWidth="6" 
            strokeDasharray="83 138" 
            strokeLinecap="round"
            transform="rotate(-90 30 30)"
          />
          <circle 
            cx="30" 
            cy="30" 
            r="22" 
            fill="none" 
            stroke="hsl(var(--accent))" 
            strokeWidth="6" 
            strokeDasharray="55 138" 
            strokeDashoffset="-83"
            strokeLinecap="round"
            transform="rotate(-90 30 30)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-medium text-muted-foreground">60%</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute top-6 right-[72px] text-[10px] text-muted-foreground font-medium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        40%
      </motion.div>
      
      {/* Icon decorations */}
      <motion.div 
        className="absolute top-20 right-6 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <TrendingUp className="w-4 h-4 text-primary" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-16 right-8 w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center"
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <MessageCircle className="w-4 h-4 text-accent" />
      </motion.div>
      
      {/* Main mockup card */}
      <motion.div 
        className="absolute top-1/2 left-6 -translate-y-1/2 w-[70%] bg-card rounded-xl shadow-xl border overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, x: -20 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Card header */}
        <div className="bg-primary px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-primary-foreground font-semibold text-sm">Mentoria</p>
            <p className="text-primary-foreground/70 text-xs">Especialistas disponíveis</p>
          </div>
        </div>
        
        {/* Mentors list */}
        <div className="p-3 space-y-2">
          {mentors.map((mentor, index) => (
            <motion.div 
              key={mentor.initials}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">{mentor.initials}</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{mentor.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{mentor.title}</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-2.5 h-2.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="px-3 pb-3">
          <div className="bg-primary/10 rounded-lg px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Agendar sessão</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

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
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
            >
              {/* Illustration Card */}
              <div className="mb-6 rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10">
                {feature.illustration}
              </div>
              
              {/* Text Content */}
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
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
