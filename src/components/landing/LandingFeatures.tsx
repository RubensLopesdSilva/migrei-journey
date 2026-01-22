import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Users, ArrowRight, Check, Calendar, Star, Search, Rocket, Trophy, Settings, Sparkles, TrendingUp, CheckCircle, Linkedin, Briefcase, ChevronUp, ChevronDown } from "lucide-react";
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
                   <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
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

const resources = [
  {
    icon: Brain,
    title: "Ciclo Migrei",
    description:
      "6 fases para sair da incerteza e conquistar clareza e ação, com passos práticos em cada etapa.",
    bullets: [
      "6 fases estruturadas com objetivos claros",
      "Progresso visual que te mantém motivado",
      "Atividades práticas em cada etapa",
    ],
    illustration: <CycleMockup />,
  },
  {
    icon: Users,
    title: "Networking",
    description:
      "Rotina diária de 10 minutos com sugestões de ações e desafios para criar conexões que abrem portas.",
    bullets: [
      "Rotina diária de apenas 10 minutos",
      "Sugestões inteligentes de ações",
      "Acompanhamento de conexões feitas",
    ],
    illustration: <NetworkingMockup />,
  },
  {
    icon: Users,
    title: "Mentoria",
    description:
      "Sessões individuais com mentores experientes para acelerar decisões e aumentar sua confiança na transição.",
    bullets: [
      "Mentores especializados disponíveis",
      "Agende no seu tempo a mentoria",
      "50 minutos de orientação",
    ],
    illustration: <CommunityMockup />,
  },
] as const;

const ResourceCard = ({
  resource,
  index,
}: {
  resource: (typeof resources)[number];
  index: number;
}) => {
  return (
    <motion.article
      className="group relative h-full overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
    >
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-60" />
      <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-primary/25 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col p-6">
        {/* mockup */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border bg-background/60 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative flex h-[320px] items-center justify-center p-4 md:h-[340px]">
            <div className="origin-center scale-[0.92] md:scale-[0.98]">{resource.illustration}</div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/60 to-transparent" />
        </div>

        {/* title */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <resource.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-foreground">{resource.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
          </div>
        </div>

        {/* bullets */}
        <div className="mt-5 rounded-2xl bg-muted/40 p-4">
          <ul className="space-y-2">
            {resource.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </span>
                <span className="leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-70" />
      </div>
    </motion.article>
  );
};

export const LandingFeatures = () => {
  const navigate = useNavigate();
  const scrollToPlans = () => {
    const el = document.getElementById("planos");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // fallback
    navigate("/#planos");
  };

  return (
    <section id="recursos" className="relative overflow-hidden bg-muted/20 py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Header (like print) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Recursos que
              <br />
              <span className="text-primary">você pode usar</span>
            </h2>
          </motion.div>

          <motion.div
            className="lg:col-span-7 lg:pl-6"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Oferecemos recursos práticos e exclusivos que vão te ajudar a aumentar sua
                produtividade e gerenciar sua transição de carreira com facilidade.
              </p>
              <Button
                onClick={scrollToPlans}
                className="btn-primary-gradient rounded-full shrink-0"
              >
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-70" />

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {resources.map((r, idx) => (
            <ResourceCard key={r.title} resource={r} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};