import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Users, ArrowRight, Check, Lock, Calendar, Star, MessageCircle, Lightbulb, Search, Wrench, Rocket, Trophy, Settings, Plus, User, Sparkles, TrendingUp, CheckCircle, Linkedin, Briefcase, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroMigreiWheel } from "./HeroMigreiWheel";
import { ScrollToNextButton } from "./ScrollToNextButton";

// Phase data for the wheel
const phases = [{
  name: "Despertar",
  description: "Reconheça a necessidade de mudança e abrace o início da jornada.",
  color: "#F59E0B",
  icon: Trophy
}, {
  name: "Descobrir",
  description: "Explore suas habilidades, valores e o que te motiva de verdade.",
  color: "#10B981",
  icon: Search
}, {
  name: "Decidir",
  description: "Escolha um caminho com base em clareza, não em pressão.",
  color: "#3B82F6",
  icon: Target
}, {
  name: "Desenvolver",
  description: "Construa as competências necessárias para sua nova carreira.",
  color: "#8B5CF6",
  icon: Settings
}, {
  name: "Deslanchar",
  description: "Entre em ação e conquiste suas primeiras oportunidades.",
  color: "#EC4899",
  icon: Rocket
}, {
  name: "Desfrutar",
  description: "Celebre suas conquistas e prepare-se para o próximo ciclo.",
  color: "#EF4444",
  icon: Star
}];

// Mockup: Interactive Roda Migrei - using HeroMigreiWheel component
const CycleMockup = () => {
  return <div className="flex items-center justify-center h-[420px] relative">
      <HeroMigreiWheel />
    </div>;
};

// Mockup: Plano de 90 Dias - Matching actual Plan90Days component
const Plan90Mockup = () => {
  const months = [
    {
      number: 1,
      name: "Mês 1: Fundação",
      description: "Estruturar bases e primeiros passos",
      progress: 100,
      tasks: 4,
      completed: 4,
      expanded: false
    },
    {
      number: 2,
      name: "Mês 2: Construção",
      description: "Desenvolver habilidades e networking",
      progress: 75,
      tasks: 4,
      completed: 3,
      expanded: true,
      weeklyTasks: [
        { week: 1, tasks: [{ title: "Atualizar LinkedIn", done: true }, { title: "Mapear empresas-alvo", done: true }] },
        { week: 2, tasks: [{ title: "Preparar pitch pessoal", done: true }, { title: "Contatar 5 pessoas", done: false }] },
      ]
    },
    {
      number: 3,
      name: "Mês 3: Lançamento",
      description: "Aplicar ativamente e colher resultados",
      progress: 0,
      tasks: 4,
      completed: 0,
      expanded: false
    }
  ];

  const overallProgress = 58;

  return (
    <motion.div
      className="backdrop-blur-xl rounded-2xl shadow-lg border border-primary/20 p-5 w-full max-w-sm mx-auto bg-gradient-to-br from-primary/5 to-transparent h-[420px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Plano Migrei de 90 Dias</p>
          <p className="text-xs text-muted-foreground">Divida sua meta em 3 meses estratégicos</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-foreground">Progresso Geral</span>
          <span className="text-sm font-bold text-primary">{overallProgress}%</span>
        </div>
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${overallProgress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Months */}
      <div className="space-y-2 flex-1 overflow-hidden">
        {months.map((month, index) => (
          <motion.div
            key={month.number}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-lg border ${month.expanded ? 'ring-1 ring-primary border-primary/30' : 'border-muted/20'} overflow-hidden`}
          >
            {/* Month Header */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  month.progress === 100
                    ? 'bg-green-500 text-white'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {month.progress === 100 ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    month.number
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{month.name}</p>
                  <p className="text-[10px] text-muted-foreground">{month.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[10px] font-medium text-foreground">{month.progress}%</p>
                  <p className="text-[9px] text-muted-foreground">{month.completed}/{month.tasks}</p>
                </div>
                {month.expanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-3 pb-2">
              <div className="h-1 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${month.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                />
              </div>
            </div>

            {/* Expanded Content - Weekly Tasks */}
            {month.expanded && month.weeklyTasks && (
              <div className="px-3 pb-3 space-y-2">
                {month.weeklyTasks.map((week) => (
                  <div key={week.week} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                        Semana {week.week}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground">
                        {week.tasks.filter(t => t.done).length}/{week.tasks.length} concluídas
                      </span>
                    </div>
                    <div className="space-y-0.5 pl-1">
                      {week.tasks.map((task, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-1.5 text-[10px] ${task.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                        >
                          <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                            task.done ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                          }`}>
                            {task.done && <Check className="w-2 h-2 text-primary-foreground" />}
                          </div>
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Mockup: Networking Prático - Design similar to actual page
const NetworkingMockup = () => {
  const scripts = [
    { icon: '📱', title: 'Networking Digital', desc: 'LinkedIn, grupos e redes', count: 3 },
    { icon: '🎤', title: 'Networking Presencial', desc: 'Eventos, meetups e workshops', count: 3 },
    { icon: '☕', title: 'Conversas 1:1', desc: 'Coffee chats e indicações', count: 3 }
  ];

  const challenges = [
    { title: 'Comente em 3 posts', xp: 30, flames: 1 },
    { title: 'Envie 2 conexões personalizadas', xp: 50, flames: 2 }
  ];

  return (
    <motion.div 
      className="w-full max-w-sm mx-auto space-y-3 h-[420px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Mission Card */}
      <div className="backdrop-blur-xl rounded-2xl shadow-lg border border-primary/20 p-4 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Missão da Semana</span>
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">📱 Digital</Badge>
            </div>
            <h4 className="text-sm font-semibold text-foreground">Inicie 3 conversas</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Converse com profissionais da sua área-alvo.</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              150 XP
            </div>
            <p className="text-[9px] text-muted-foreground">⏱ 5 dias</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium text-foreground">1 / 3</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        {/* Scripts Section */}
        <div className="bg-card rounded-xl border p-3 space-y-2.5">
          <div>
            <h5 className="text-xs font-semibold text-foreground">Scripts prontos</h5>
            <p className="text-[9px] text-muted-foreground">Copie, adapte e use</p>
          </div>
          
          {scripts.map((script, index) => (
            <motion.div
              key={script.title}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm">
                {script.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-foreground truncate">{script.title}</p>
                <p className="text-[8px] text-muted-foreground truncate">{script.desc}</p>
              </div>
              <Badge variant="outline" className="text-[8px] px-1.5 py-0 shrink-0">
                {script.count} scripts
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Challenges Section */}
        <div className="bg-card rounded-xl border p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🔥</span>
              <h5 className="text-xs font-semibold text-foreground">Desafios</h5>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-primary font-medium">
              <Sparkles className="h-2.5 w-2.5" />
              75/255
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium text-foreground">1/4</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-primary rounded-full" />
            </div>
          </div>

          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.title}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px]">
                📋
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  {[...Array(challenge.flames)].map((_, i) => (
                    <span key={i} className="text-[8px]">🔥</span>
                  ))}
                  <span className="text-[9px] font-medium text-primary">+{challenge.xp}</span>
                </div>
                <p className="text-[9px] text-foreground truncate">{challenge.title}</p>
              </div>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Mockup: Comunidade & Mentoria - Design similar to actual mentoring page
const CommunityMockup = () => {
  const mentors = [{
    name: "Ana Paula",
    initials: "AP",
    title: "Ex-Head de RH",
    yearsExperience: 12,
    expertise: ["Carreira", "Liderança"]
  }, {
    name: "Carlos M.",
    initials: "CM",
    title: "Gerente de Projetos",
    yearsExperience: 10,
    expertise: ["Gestão", "Agile"]
  }];

  return (
    <motion.div 
      className="w-full max-w-sm mx-auto space-y-3"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Card */}
      <div className="backdrop-blur-xl rounded-2xl shadow-lg border border-primary/20 p-4 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">
              <Sparkles className="h-2.5 w-2.5" />
              Essencial
            </span>
            <h3 className="text-lg font-bold text-primary mb-1">
              Mentoria com Especialistas
            </h3>
            <p className="text-[10px] text-muted-foreground mb-2">
              Acelere sua transição com orientação de quem já passou por isso.
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="h-2.5 w-2.5 text-primary/70" />
                Orientação personalizada
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5 text-primary/70" />
                Acelere sua transição
              </span>
            </div>
          </div>
          
          {/* Premium Card */}
          <div className="bg-card rounded-lg p-2.5 border shadow-sm min-w-[120px]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-3 w-3 text-primary" />
              </div>
              <div>
                <p className="text-[9px] font-semibold text-foreground">Orientação direcionada</p>
                <p className="text-[7px] text-muted-foreground">De quem fez transição</p>
              </div>
            </div>
            <div className="space-y-0.5 text-[8px] text-muted-foreground mb-1.5">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-2 w-2 text-primary" />
                1 sessão por mês
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-2 w-2 text-primary" />
                Acesso a mentores
              </div>
            </div>
            <Button size="sm" className="w-full h-5 text-[8px] btn-primary-gradient">
              <Sparkles className="h-2 w-2 mr-1" />
              Desbloquear
            </Button>
          </div>
        </div>
      </div>

      {/* Mentors Available Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-foreground" />
            <h4 className="text-xs font-semibold text-foreground">Mentores Disponíveis</h4>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1 text-[9px] text-muted-foreground">
            <Search className="h-2.5 w-2.5" />
            Buscar...
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              className="bg-card rounded-lg p-3 border shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Mentor Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="relative shrink-0">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-background shadow-sm">
                    <span className="text-xs font-semibold text-primary">{mentor.initials}</span>
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold text-foreground truncate">{mentor.name}</p>
                    <Linkedin className="h-3 w-3 text-muted-foreground shrink-0" />
                  </div>
                  <p className="text-[9px] text-muted-foreground truncate">{mentor.title}</p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground mb-2">
                <Briefcase className="h-2.5 w-2.5 text-primary/70" />
                <span>{mentor.yearsExperience}+ anos</span>
              </div>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {mentor.expertise.map((skill) => (
                  <span 
                    key={skill}
                    className="text-[8px] px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full h-6 text-[9px]"
              >
                <Calendar className="h-2.5 w-2.5 mr-1" />
                Agendar
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
const features = [{
  icon: Brain,
  title: "Ciclo de Transição",
  subtitle: "Visualize sua jornada completa",
  description: "Acompanhe sua evolução através das 6 fases do Ciclo Migrei. Cada fase foi desenhada para te guiar do despertar até a conquista do seu novo momento profissional.",
  highlights: ["6 fases estruturadas com objetivos claros", "Progresso visual que te mantém motivado", "Atividades práticas em cada etapa"],
  illustration: <CycleMockup />,
  gradient: "from-amber-500/10 via-transparent to-emerald-500/10",
  accentColor: "text-amber-500"
}, {
  icon: Target,
  title: "Plano de 90 Dias",
  subtitle: "Sua transição com prazo e foco",
  description: "Metas SMART e cronograma personalizado dividido em 3 meses. Cada semana você sabe exatamente o que fazer para avançar na sua transição de carreira.",
  highlights: ["Cronograma semanal personalizado", "Metas mensuráveis e alcançáveis", "Acompanhamento de progresso em tempo real"],
  illustration: <Plan90Mockup />,
  gradient: "from-blue-500/10 via-transparent to-indigo-500/10",
  accentColor: "text-blue-500"
}, {
  icon: Users,
  title: "Networking Prático",
  subtitle: "Conexões que abrem portas",
  description: "Rotina diária de 10 minutos que transforma sua rede de contatos. Ações simples e consistentes que constroem relacionamentos profissionais genuínos.",
  highlights: ["Rotina diária de apenas 10 minutos", "Sugestões inteligentes de ações", "Acompanhamento de conexões feitas"],
  illustration: <NetworkingMockup />,
  gradient: "from-violet-500/10 via-transparent to-purple-500/10",
  accentColor: "text-violet-500"
}, {
  icon: Users,
  title: "Mentoria Especializada",
  subtitle: "Você não está sozinho nessa",
  description: "Receba orientação personalizada de mentores experientes que já realizaram transições de carreira bem-sucedidas. Sessões individuais para acelerar seus resultados.",
  highlights: ["Mentores especializados disponíveis", "Agende no seu tempo a mentoria", "50 minutos de orientação"],
  illustration: <CommunityMockup />,
  gradient: "from-emerald-500/10 via-transparent to-teal-500/10",
  accentColor: "text-emerald-500"
}];

// Feature Section Component for sequential layout
const FeatureSection = ({
  feature,
  index,
  isReversed
}: {
  feature: typeof features[0];
  index: number;
  isReversed: boolean;
}) => {
  const navigate = useNavigate();
  return <div className={`relative py-20 md:py-28 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-50`} />
      
      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
          {/* Content */}
          <motion.div className={isReversed ? 'lg:col-start-2' : ''} initial={{
          opacity: 0,
          x: isReversed ? 40 : -40
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true,
          margin: "-100px"
        }} transition={{
          duration: 0.6,
          ease: "easeOut"
        }}>
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg`}>
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent max-w-20" />
              
            </div>
            
            {/* Title & Subtitle */}
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className={`text-lg font-medium ${feature.accentColor} mb-4`}>
              {feature.subtitle}
            </p>
            
            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {feature.description}
            </p>
            
            {/* Highlights */}
            <ul className="space-y-3 mb-8">
              {feature.highlights.map((highlight, i) => <motion.li key={i} className="flex items-center gap-3" initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.4,
              delay: 0.2 + i * 0.1
            }}>
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground">{highlight}</span>
                </motion.li>)}
            </ul>
            
            {/* CTA */}
            <Button variant="outline" className="rounded-full group border-primary/30 hover:border-primary hover:bg-primary/5" onClick={() => navigate("/auth?tab=signup")}>
              Explorar recurso
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          {/* Illustration */}
          <motion.div className={isReversed ? 'lg:col-start-1 lg:row-start-1' : ''} initial={{
          opacity: 0,
          x: isReversed ? -40 : 40,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          x: 0,
          scale: 1
        }} viewport={{
          once: true,
          margin: "-100px"
        }} transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: 0.1
        }}>
            <div className="relative">
              {/* Decorative elements - only for non-cycle features */}
              {index !== 0 && <>
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl blur-xl" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                </>}
              
              {/* Mockup container - skip for cycle (index 0) */}
              {index === 0 ? <div className="relative">
                  {feature.illustration}
                </div> : <div className="relative rounded-2xl p-6 transform hover:scale-[1.02] transition-transform duration-500">
                  <div className="transform scale-110 origin-center">
                    {feature.illustration}
                  </div>
                </div>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
};
export const LandingFeatures = () => {
  const navigate = useNavigate();
  return <section id="recursos" className="relative overflow-hidden">
      {/* Section Header */}
      <div className="py-20 md:py-28 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center max-w-3xl mx-auto" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Lightbulb className="h-4 w-4" />
              Recursos exclusivos
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Recursos para a sua{" "}
              <span className="text-primary">transição de carreira</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">Ferramentas práticas, metodologia testada e práticas de networking. 
Descubra cada recurso que vai te ajudar a conquistar sua nova carreira.</p>
          </motion.div>
        </div>
      </div>
      
      {/* Sequential Feature Sections */}
      {features.map((feature, index) => <FeatureSection key={index} feature={feature} index={index} isReversed={index % 2 === 1} />)}
      
      {/* Scroll to next section */}
      <div id="funcionalidades" className="pb-4 bg-muted/30">
        <ScrollToNextButton targetId="ciclo-migrei" />
      </div>
    </section>;
};