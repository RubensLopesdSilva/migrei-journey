import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Target, Users, ArrowRight, Check, Lock, Calendar, Star, MessageCircle, Lightbulb, Search, Wrench, Rocket, Trophy, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import lumiAvatar from "@/assets/agents/lumi.png";

// Mockup: Interactive Roda Migrei - Style matching reference image exactly
const CycleMockup = () => {
  // Colors matching the reference wheel exactly (clockwise from top-right)
  const segments = [
    { color: "#F59E0B", icon: Lightbulb }, // Despertar - Amber
    { color: "#10B981", icon: Search }, // Descobrir - Emerald
    { color: "#3B82F6", icon: Target }, // Decidir - Blue
    { color: "#8B5CF6", icon: Wrench }, // Desenvolver - Violet
    { color: "#EC4899", icon: Rocket }, // Deslanchar - Pink
    { color: "#EF4444", icon: Trophy }, // Desfrutar - Red
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 h-56 flex items-center justify-center relative overflow-hidden">
      {/* Elliptical shadow under the wheel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-36 h-6 bg-black/15 dark:bg-black/30 rounded-[100%] blur-md" />
      
      {/* Main wheel container */}
      <div className="relative w-48 h-48">
        {/* SVG Wheel with white outer ring */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
          <defs>
            {/* Define gradients for each segment */}
            {segments.map((seg, i) => (
              <linearGradient key={`grad-${i}`} id={`segment-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={seg.color} stopOpacity="1" />
                <stop offset="100%" stopColor={seg.color} stopOpacity="0.9" />
              </linearGradient>
            ))}
            {/* White ring filter */}
            <filter id="ring-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
            </filter>
          </defs>
          
          {/* White outer ring background */}
          <circle cx="100" cy="100" r="97" fill="white" filter="url(#ring-shadow)" className="dark:fill-slate-700" />
          
          {segments.map((segment, index) => {
            const numSegments = 6;
            const segmentAngle = 360 / numSegments;
            const gapAngle = 4; // Gap between segments
            const startAngle = index * segmentAngle - 90 + gapAngle / 2;
            const endAngle = (index + 1) * segmentAngle - 90 - gapAngle / 2;
            
            const outerRadius = 92;
            const innerRadius = 44;
            
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const x1 = 100 + outerRadius * Math.cos(startRad);
            const y1 = 100 + outerRadius * Math.sin(startRad);
            const x2 = 100 + outerRadius * Math.cos(endRad);
            const y2 = 100 + outerRadius * Math.sin(endRad);
            const x3 = 100 + innerRadius * Math.cos(endRad);
            const y3 = 100 + innerRadius * Math.sin(endRad);
            const x4 = 100 + innerRadius * Math.cos(startRad);
            const y4 = 100 + innerRadius * Math.sin(startRad);
            
            // Icon position (middle of segment)
            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle * Math.PI) / 180;
            const iconRadius = (outerRadius + innerRadius) / 2;
            const iconX = 100 + iconRadius * Math.cos(midRad);
            const iconY = 100 + iconRadius * Math.sin(midRad);
            
            const Icon = segment.icon;
            
            return (
              <g key={index}>
                {/* Segment path */}
                <path
                  d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
                  fill={`url(#segment-gradient-${index})`}
                  className="transition-all duration-300 hover:opacity-90"
                />
                {/* Semi-transparent circle behind icon */}
                <circle
                  cx={iconX}
                  cy={iconY}
                  r="12"
                  fill="rgba(255,255,255,0.3)"
                />
                {/* Icon */}
                <foreignObject
                  x={iconX - 8}
                  y={iconY - 8}
                  width="16"
                  height="16"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        
        {/* Center avatar circle with actual image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-lg border-4 border-white dark:border-slate-700 flex items-center justify-center overflow-hidden">
          <img 
            src={lumiAvatar} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

// Mockup: Plano de 90 Dias
const Plan90Mockup = () => {
  const months = [
    { name: "Mês 1", theme: "Fundação", progress: 85, tasks: 4, completed: 3 },
    { name: "Mês 2", theme: "Construção", progress: 40, tasks: 4, completed: 2 },
    { name: "Mês 3", theme: "Lançamento", progress: 0, tasks: 4, completed: 0 },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-5 h-56 flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Plano de Transição</p>
            <p className="text-[10px] text-muted-foreground">42 dias restantes</p>
          </div>
        </div>
        <div className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
          Semana 6
        </div>
      </div>

      {/* Monthly progress cards */}
      <div className="flex gap-2 mt-3">
        {months.map((month, index) => (
          <div 
            key={month.name}
            className={`flex-1 bg-white dark:bg-slate-800 rounded-lg p-2.5 border transition-all ${
              index === 0 
                ? "border-primary/30 shadow-sm" 
                : index === 1 
                  ? "border-blue-200 dark:border-blue-800/50"
                  : "border-slate-200 dark:border-slate-700 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-foreground">{month.name}</span>
              {index === 0 && <Check className="h-3 w-3 text-green-500" />}
              {index === 2 && <Lock className="h-3 w-3 text-muted-foreground" />}
            </div>
            <p className="text-[9px] text-muted-foreground mb-2">{month.theme}</p>
            
            {/* Progress bar */}
            <div className="h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${month.progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[8px] text-muted-foreground">{month.completed}/{month.tasks} tarefas</span>
              <span className="text-[8px] font-medium text-primary">{month.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Current task */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-2.5 border border-primary/20 mt-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-foreground truncate">Finalizar análise de competências</p>
            <p className="text-[8px] text-muted-foreground">Prazo: Hoje • +50 XP</p>
          </div>
          <ArrowRight className="h-3 w-3 text-primary" />
        </div>
      </div>
    </div>
  );
};

// Mockup: Networking Prático
const NetworkingMockup = () => {
  const todayActions = [
    { type: 'comment', target: 'Post sobre liderança', completed: true },
    { type: 'connect', target: 'Maria Santos - RH', completed: true },
    { type: 'message', target: 'Carlos - Mentor', completed: false },
  ];

  const suggestedActions = [
    { type: 'comment', description: 'Comente em um post do seu setor' },
    { type: 'connect', description: 'Conecte-se com alguém da área' },
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageCircle className="h-3 w-3" />;
      case 'connect': return <Users className="h-3 w-3" />;
      case 'message': return <ArrowRight className="h-3 w-3" />;
      default: return null;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'comment': return 'bg-blue-500/10 text-blue-500';
      case 'connect': return 'bg-green-500/10 text-green-500';
      case 'message': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-muted';
    }
  };

  const completedCount = todayActions.filter(a => a.completed).length;
  const progressPercent = (completedCount / todayActions.length) * 100;

  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-xl p-5 h-56 flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Rotina de Networking</p>
            <p className="text-[10px] text-muted-foreground">10 min/dia</p>
          </div>
        </div>
        <div className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
          +15 XP
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-2.5 mt-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium text-foreground">Progresso de Hoje</span>
          <span className="text-[9px] text-muted-foreground">{completedCount}/{todayActions.length} ações</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Today's Actions */}
      <div className="space-y-1.5 mt-2">
        {todayActions.map((action, index) => (
          <div 
            key={index}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              action.completed ? 'bg-green-500/10' : 'bg-white/80 dark:bg-slate-800/80'
            }`}
          >
            <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
              action.completed ? 'bg-green-500 text-white' : 'border-2 border-muted-foreground/30'
            }`}>
              {action.completed && <Check className="h-2.5 w-2.5" />}
            </div>
            <div className={`h-5 w-5 rounded flex items-center justify-center ${getActionColor(action.type)}`}>
              {getActionIcon(action.type)}
            </div>
            <span className={`text-[10px] flex-1 truncate ${action.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {action.target}
            </span>
          </div>
        ))}
      </div>

      {/* Suggested Action */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-2 mt-1.5 border border-dashed border-primary/30">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-amber-500/10 flex items-center justify-center">
            <Star className="h-3 w-3 text-amber-500" />
          </div>
          <span className="text-[9px] text-muted-foreground flex-1">Sugestão: {suggestedActions[0].description}</span>
          <div className="h-4 w-4 rounded bg-primary/10 flex items-center justify-center">
            <Plus className="h-2.5 w-2.5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Mockup: Comunidade & Mentoria
const CommunityMockup = () => {
  const mentors = [
    { name: "Ana Paula", title: "Ex-Head de RH", avatar: "🧑‍💼", rating: 5 },
    { name: "Carlos", title: "Career Coach", avatar: "👨‍💻", rating: 5 },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-5 h-56 flex flex-col justify-between relative overflow-hidden">
      {/* Header with community stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-800">👩</div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-800">👨</div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-800">👩‍💻</div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-foreground">+2.5k membros</p>
            <p className="text-[8px] text-muted-foreground">ativos esta semana</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] font-medium px-2 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Online agora
        </div>
      </div>

      {/* Mentor cards */}
      <div className="space-y-2 mt-3">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Mentores disponíveis</p>
        <div className="grid grid-cols-2 gap-2">
          {mentors.map((mentor) => (
            <div 
              key={mentor.name}
              className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm">
                  {mentor.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-foreground truncate">{mentor.name}</p>
                  <p className="text-[8px] text-muted-foreground truncate">{mentor.title}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-2 w-2 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Calendar className="h-3 w-3 text-primary group-hover:scale-110 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community activity */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-2.5 border border-slate-200 dark:border-slate-700 mt-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-foreground truncate">
              <span className="font-medium">Fernanda</span> compartilhou uma vitória na Fase 3
            </p>
          </div>
          <span className="text-[8px] text-muted-foreground">2min</span>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: Brain,
    title: "Ciclo de Transição",
    description: "Acompanhe sua jornada através das 6 fases do Ciclo Migrei com visualização clara do seu progresso.",
    illustration: <CycleMockup />,
  },
  {
    icon: Target,
    title: "Plano de 90 Dias",
    description: "Metas SMART e cronograma personalizado para sua transição com acompanhamento passo a passo.",
    illustration: <Plan90Mockup />,
  },
  {
    icon: Users,
    title: "Networking Prático",
    description: "Rotina diária de 10 minutos para construir conexões estratégicas que abrem portas na sua carreira.",
    illustration: <NetworkingMockup />,
  },
  {
    icon: Users,
    title: "Comunidade & Mentoria",
    description: "Conecte-se com profissionais em transição e receba orientação de mentores especializados.",
    illustration: <CommunityMockup />,
  },
];

export const LandingFeatures = () => {
  const navigate = useNavigate();

  return (
    <section id="recursos" className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Recursos para sua jornada
            </h2>
            <p className="text-muted-foreground">
              Ferramentas práticas que te ajudam a sair da dúvida e entrar em ação com clareza e confiança.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full group"
              onClick={() => navigate("/auth")}
            >
              Começar agora
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="p-0 overflow-hidden bg-card border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full group">
                {/* Illustration */}
                <div className="p-4">
                  {feature.illustration}
                </div>
                
                {/* Content */}
                <div className="p-6 pt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
