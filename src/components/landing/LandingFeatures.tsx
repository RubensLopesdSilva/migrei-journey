import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Target, Users, ArrowRight, Check, Lock, Calendar, Star, MessageCircle, Lightbulb, Search, Wrench, Rocket, Trophy, Settings, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import lumiAvatar from "@/assets/agents/lumi.png";

// Phase data for the wheel
const phases = [
  { 
    name: "Despertar", 
    description: "Reconheça a necessidade de mudança e abrace o início da jornada.",
    color: "#F59E0B", 
    icon: Trophy 
  },
  { 
    name: "Descobrir", 
    description: "Explore suas habilidades, valores e o que te motiva de verdade.",
    color: "#10B981", 
    icon: Search 
  },
  { 
    name: "Decidir", 
    description: "Escolha um caminho com base em clareza, não em pressão.",
    color: "#3B82F6", 
    icon: Target 
  },
  { 
    name: "Desenvolver", 
    description: "Construa as competências necessárias para sua nova carreira.",
    color: "#8B5CF6", 
    icon: Settings 
  },
  { 
    name: "Deslanchar", 
    description: "Entre em ação e conquiste suas primeiras oportunidades.",
    color: "#EC4899", 
    icon: Rocket 
  },
  { 
    name: "Desfrutar", 
    description: "Celebre suas conquistas e prepare-se para o próximo ciclo.",
    color: "#EF4444", 
    icon: Star 
  },
];

// Mockup: Interactive Roda Migrei with hover tooltips
const CycleMockup = () => {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8 min-h-[320px] flex items-center justify-center relative overflow-visible">
      {/* Main wheel container */}
      <div className="relative w-64 h-64 md:w-72 md:h-72">
        {/* Elliptical shadow under the wheel */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/10 dark:bg-black/20 rounded-[100%] blur-lg" />
        
        {/* SVG Wheel */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <defs>
            {phases.map((phase, i) => (
              <linearGradient key={`grad-${i}`} id={`segment-gradient-feature-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={phase.color} stopOpacity="1" />
                <stop offset="100%" stopColor={phase.color} stopOpacity="0.85" />
              </linearGradient>
            ))}
            <filter id="wheel-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15"/>
            </filter>
          </defs>
          
          {/* White outer ring */}
          <circle cx="100" cy="100" r="98" fill="white" filter="url(#wheel-shadow)" className="dark:fill-slate-700" />
          
          {phases.map((phase, index) => {
            const numSegments = 6;
            const segmentAngle = 360 / numSegments;
            const gapAngle = 5;
            const startAngle = index * segmentAngle - 90 + gapAngle / 2;
            const endAngle = (index + 1) * segmentAngle - 90 - gapAngle / 2;
            
            const outerRadius = 92;
            const innerRadius = 42;
            
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
            
            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle * Math.PI) / 180;
            const iconRadius = (outerRadius + innerRadius) / 2;
            const iconX = 100 + iconRadius * Math.cos(midRad);
            const iconY = 100 + iconRadius * Math.sin(midRad);
            
            const Icon = phase.icon;
            const isHovered = hoveredPhase === index;
            
            return (
              <g 
                key={index}
                onMouseEnter={(e) => {
                  setHoveredPhase(index);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({ 
                    x: iconX > 100 ? 1 : -1, 
                    y: iconY > 100 ? 1 : -1 
                  });
                }}
                onMouseLeave={() => setHoveredPhase(null)}
                className="cursor-pointer"
              >
                <path
                  d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
                  fill={`url(#segment-gradient-feature-${index})`}
                  className="transition-all duration-300"
                  style={{
                    transform: isHovered ? `scale(1.05)` : 'scale(1)',
                    transformOrigin: `${iconX}px ${iconY}px`,
                    filter: isHovered ? 'brightness(1.1)' : 'none'
                  }}
                />
                <circle
                  cx={iconX}
                  cy={iconY}
                  r="14"
                  fill="rgba(255,255,255,0.35)"
                  className="transition-all duration-300"
                  style={{ opacity: isHovered ? 0.5 : 0.35 }}
                />
                <foreignObject
                  x={iconX - 10}
                  y={iconY - 10}
                  width="20"
                  height="20"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Icon className="w-5 h-5 text-white drop-shadow-sm" strokeWidth={2} />
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        
        {/* Center circle with user icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white dark:bg-slate-800 shadow-xl border-4 border-white dark:border-slate-700 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <User className="w-8 h-8 md:w-10 md:h-10 text-primary/60" strokeWidth={1.5} />
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredPhase !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-20 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-border/50 p-4 max-w-[200px] ${
              tooltipPosition.x > 0 ? 'right-4' : 'left-4'
            } ${
              tooltipPosition.y > 0 ? 'bottom-4' : 'top-4'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: phases[hoveredPhase].color }}
              />
              <span className="font-semibold text-foreground">{phases[hoveredPhase].name}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {phases[hoveredPhase].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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
    subtitle: "Visualize sua jornada completa",
    description: "Acompanhe sua evolução através das 6 fases do Ciclo Migrei. Cada fase foi desenhada para te guiar do despertar até a conquista do seu novo momento profissional.",
    highlights: [
      "6 fases estruturadas com objetivos claros",
      "Progresso visual que te mantém motivado",
      "Atividades práticas em cada etapa"
    ],
    illustration: <CycleMockup />,
    gradient: "from-amber-500/10 via-transparent to-emerald-500/10",
    accentColor: "text-amber-500",
  },
  {
    icon: Target,
    title: "Plano de 90 Dias",
    subtitle: "Sua transição com prazo e foco",
    description: "Metas SMART e cronograma personalizado dividido em 3 meses. Cada semana você sabe exatamente o que fazer para avançar na sua transição de carreira.",
    highlights: [
      "Cronograma semanal personalizado",
      "Metas mensuráveis e alcançáveis",
      "Acompanhamento de progresso em tempo real"
    ],
    illustration: <Plan90Mockup />,
    gradient: "from-blue-500/10 via-transparent to-indigo-500/10",
    accentColor: "text-blue-500",
  },
  {
    icon: Users,
    title: "Networking Prático",
    subtitle: "Conexões que abrem portas",
    description: "Rotina diária de 10 minutos que transforma sua rede de contatos. Ações simples e consistentes que constroem relacionamentos profissionais genuínos.",
    highlights: [
      "Rotina diária de apenas 10 minutos",
      "Sugestões inteligentes de ações",
      "Acompanhamento de conexões feitas"
    ],
    illustration: <NetworkingMockup />,
    gradient: "from-violet-500/10 via-transparent to-purple-500/10",
    accentColor: "text-violet-500",
  },
  {
    icon: Users,
    title: "Comunidade & Mentoria",
    subtitle: "Você não está sozinho nessa",
    description: "Conecte-se com milhares de profissionais em transição e receba orientação de mentores que já trilharam esse caminho. Troque experiências, celebre vitórias juntos.",
    highlights: [
      "Mentores especializados disponíveis",
      "Comunidade ativa e acolhedora",
      "Eventos e encontros exclusivos"
    ],
    illustration: <CommunityMockup />,
    gradient: "from-emerald-500/10 via-transparent to-teal-500/10",
    accentColor: "text-emerald-500",
  },
];

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
  
  return (
    <div className={`relative py-16 md:py-24 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-50`} />
      
      <div className="container mx-auto px-4 relative">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
          {/* Content */}
          <motion.div
            className={isReversed ? 'lg:col-start-2' : ''}
            initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg`}>
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent max-w-20" />
              <span className="text-sm font-medium text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
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
              {feature.highlights.map((highlight, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground">{highlight}</span>
                </motion.li>
              ))}
            </ul>
            
            {/* CTA */}
            <Button
              variant="outline"
              className="rounded-full group border-primary/30 hover:border-primary hover:bg-primary/5"
              onClick={() => navigate("/auth")}
            >
              Explorar recurso
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          {/* Illustration */}
          <motion.div
            className={isReversed ? 'lg:col-start-1 lg:row-start-1' : ''}
            initial={{ opacity: 0, x: isReversed ? -40 : 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl blur-xl" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              
              {/* Mockup container */}
              <div className="relative bg-card rounded-2xl shadow-2xl border border-border/50 p-6 transform hover:scale-[1.02] transition-transform duration-500">
                <div className="transform scale-110 origin-center">
                  {feature.illustration}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const LandingFeatures = () => {
  const navigate = useNavigate();

  return (
    <section id="recursos" className="relative overflow-hidden">
      {/* Section Header */}
      <div className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Lightbulb className="h-4 w-4" />
              Recursos exclusivos
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tudo que você precisa para sua{" "}
              <span className="text-primary">transição de carreira</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ferramentas práticas, metodologia testada e uma comunidade que te apoia. 
              Descubra cada recurso que vai te ajudar a conquistar sua nova carreira.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Sequential Feature Sections */}
      {features.map((feature, index) => (
        <FeatureSection
          key={index}
          feature={feature}
          index={index}
          isReversed={index % 2 === 1}
        />
      ))}
      
      {/* Final CTA */}
      <div className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pronto para começar sua transformação?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Junte-se a milhares de profissionais que já estão construindo carreiras mais alinhadas com seus valores.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full group shadow-lg shadow-primary/25"
              onClick={() => navigate("/auth")}
            >
              Começar agora — é grátis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
