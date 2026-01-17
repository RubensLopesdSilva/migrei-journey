import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Target, Users, ArrowRight, Check, Lock, Calendar, Star, MessageCircle, Lightbulb, Search, Wrench, Rocket, Trophy, Settings, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroMigreiWheel } from "./HeroMigreiWheel";

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
  return <div className="flex items-center justify-center min-h-[400px] relative">
      <HeroMigreiWheel />
    </div>;
};

// Mockup: Plano de 90 Dias - Realistic design
const Plan90Mockup = () => {
  const months = [{
    name: "Mês 1",
    theme: "Fundação",
    progress: 85,
    tasks: 4,
    completed: 3,
    active: true
  }, {
    name: "Mês 2",
    theme: "Construção",
    progress: 40,
    tasks: 4,
    completed: 2,
    active: false
  }, {
    name: "Mês 3",
    theme: "Lançamento",
    progress: 0,
    tasks: 4,
    completed: 0,
    locked: true
  }];
  return <motion.div className="backdrop-blur-xl rounded-2xl shadow-lg border border-primary/20 p-6 w-full max-w-md mx-auto bg-gradient-to-br from-primary/5 to-transparent" initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5
  }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Plano de Transição</p>
            <p className="text-xs text-muted-foreground">42 dias restantes</p>
          </div>
        </div>
        <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
          Semana 6
        </div>
      </div>

      {/* Monthly progress cards */}
      <div className="bg-primary/5 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          {months.map((month, index) => <div key={month.name} className={`bg-primary/5 rounded-lg p-3 border-2 transition-all ${month.active ? "border-primary/40 shadow-sm" : month.locked ? "border-muted/20 opacity-50" : "border-muted/10"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground">{month.name}</span>
                {month.active && <Check className="h-4 w-4 text-green-500" />}
                {month.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">{month.theme}</p>
              
              {/* Progress bar */}
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                <motion.div className="h-full bg-primary rounded-full" initial={{
              width: 0
            }} whileInView={{
              width: `${month.progress}%`
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.8,
              delay: index * 0.2
            }} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{month.completed}/{month.tasks} tarefas</span>
                <span className="text-[10px] font-semibold text-primary">{month.progress}%</span>
              </div>
            </div>)}
        </div>
      </div>

      {/* Current task */}
      <div className="bg-primary/5 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Finalizar análise de competências</p>
            <p className="text-xs text-muted-foreground">Prazo: Hoje • +50 XP</p>
          </div>
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </div>
    </motion.div>;
};

// Mockup: Networking Prático - Realistic design
const NetworkingMockup = () => {
  const todayActions = [{
    type: 'comment',
    target: 'Post sobre liderança',
    completed: true,
    platform: 'LinkedIn'
  }, {
    type: 'connect',
    target: 'Maria Santos - RH',
    completed: true,
    platform: 'LinkedIn'
  }, {
    type: 'message',
    target: 'Carlos - Mentor',
    completed: false,
    platform: 'WhatsApp'
  }];
  const weeklyStats = {
    connections: 12,
    messages: 8,
    posts: 3
  };
  const completedCount = todayActions.filter(a => a.completed).length;
  return <motion.div className="backdrop-blur-xl rounded-2xl shadow-lg border border-violet-500/20 p-6 w-full max-w-md mx-auto bg-gradient-to-br from-violet-500/5 to-transparent" initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5
  }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Rotina de Networking</p>
            <p className="text-xs text-muted-foreground">10 min/dia • 5 dias seguidos 🔥</p>
          </div>
        </div>
        <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Ativo
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{weeklyStats.connections}</p>
          <p className="text-[10px] text-muted-foreground">Conexões</p>
        </div>
        <div className="bg-purple-500/10 dark:bg-purple-500/20 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{weeklyStats.messages}</p>
          <p className="text-[10px] text-muted-foreground">Mensagens</p>
        </div>
        <div className="bg-amber-500/10 dark:bg-amber-500/20 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{weeklyStats.posts}</p>
          <p className="text-[10px] text-muted-foreground">Interações</p>
        </div>
      </div>

      {/* Today's Actions */}
      <div className="bg-violet-500/5 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-foreground">Ações de Hoje</span>
          <span className="text-xs text-muted-foreground">{completedCount}/{todayActions.length}</span>
        </div>
        
        <div className="space-y-2">
          {todayActions.map((action, index) => <motion.div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${action.completed ? 'bg-green-500/10' : 'bg-violet-500/5'}`} initial={{
          opacity: 0,
          x: -10
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.3,
          delay: index * 0.1
        }}>
              <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${action.completed ? 'bg-green-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600'}`}>
                {action.completed && <Check className="h-3 w-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${action.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {action.target}
                </p>
                <p className="text-[10px] text-muted-foreground">{action.platform}</p>
              </div>
              {!action.completed && <ArrowRight className="h-4 w-4 text-primary" />}
            </motion.div>)}
        </div>
      </div>
    </motion.div>;
};

// Mockup: Comunidade & Mentoria - Realistic design
const CommunityMockup = () => {
  const mentors = [{
    name: "Ana Paula",
    title: "Ex-Head de RH",
    specialty: "Transição de carreira",
    rating: 5,
    sessions: 48
  }, {
    name: "Carlos M.",
    title: "Career Coach",
    specialty: "Tech & Startups",
    rating: 5,
    sessions: 32
  }];
  const nextSession = {
    mentor: "Ana Paula",
    date: "Qui, 18 Jan",
    time: "14:00",
    topic: "Preparação para entrevista"
  };
  return <motion.div className="backdrop-blur-xl rounded-2xl shadow-lg border border-emerald-500/20 p-6 w-full max-w-md mx-auto bg-gradient-to-br from-emerald-500/5 to-transparent" initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5
  }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Mentoria & Comunidade</p>
            <p className="text-xs text-muted-foreground">+2.5k membros ativos</p>
          </div>
        </div>
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-900">👩</div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-900">👨</div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-900">+</div>
        </div>
      </div>

      {/* Next Session Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 mb-4 border border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">Próxima Sessão</span>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Calendar className="h-3.5 w-3.5" />
            {nextSession.date}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
            👩‍💼
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{nextSession.mentor}</p>
            <p className="text-xs text-muted-foreground">{nextSession.topic}</p>
          </div>
          <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg">
            {nextSession.time}
          </div>
        </div>
      </div>

      {/* Mentors Available */}
      <div className="bg-emerald-500/5 rounded-xl p-4">
        <p className="text-xs font-semibold text-foreground mb-3">Mentores Disponíveis</p>
        <div className="space-y-3">
          {mentors.map((mentor, index) => <motion.div key={mentor.name} className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10 flex items-center gap-3" initial={{
          opacity: 0,
          y: 10
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.3,
          delay: index * 0.1
        }}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg">
                {index === 0 ? '👩‍💼' : '👨‍💻'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">{mentor.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">{mentor.title} • {mentor.sessions} sessões</p>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] px-2 rounded-lg">
                <Calendar className="h-3 w-3 mr-1" />
                Agendar
              </Button>
            </motion.div>)}
        </div>
      </div>
    </motion.div>;
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
  return <div className={`relative py-16 md:py-24 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
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
      <div className="py-16 md:py-24 bg-muted/20">
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
              Tudo que você precisa para sua{" "}
              <span className="text-primary">transição de carreira</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">Ferramentas práticas, metodologia testada e práticas de networking. 
Descubra cada recurso que vai te ajudar a conquistar sua nova carreira.</p>
          </motion.div>
        </div>
      </div>
      
      {/* Sequential Feature Sections */}
      {features.map((feature, index) => <FeatureSection key={index} feature={feature} index={index} isReversed={index % 2 === 1} />)}
      
      {/* Final CTA */}
      <div className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div className="text-center" initial={{
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
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pronto para começar sua transformação?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Junte-se a milhares de profissionais que já estão construindo carreiras mais alinhadas com seus valores.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full group shadow-lg shadow-primary/25" onClick={() => navigate("/auth?tab=signup")}>
              Começar agora — é grátis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>;
};