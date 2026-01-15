import { Target, CheckCircle2, Circle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedProgress } from "@/components/ui/animated-container";
import { focusRingClasses } from "@/components/ui/focus-ring";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import { useMemo } from "react";

interface Mission {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  xp: number;
  type: 'daily' | 'phase' | 'special';
}

// Missions per phase - contextual and relevant
const phaseMissions: Record<string, Mission[]> = {
  despertar: [
    { id: "d1", title: "Complete seu perfil", description: "Adicione sua foto e bio", completed: false, xp: 20, type: 'phase' },
    { id: "d2", title: "Faça o teste de prontidão", description: "Avalie sua situação atual", completed: false, xp: 25, type: 'phase' },
    { id: "d3", title: "Mapeie suas dores", description: "Identifique o que te incomoda", completed: false, xp: 15, type: 'phase' },
    { id: "d4", title: "Declare seu compromisso", description: "Assine sua declaração", completed: false, xp: 30, type: 'phase' },
  ],
  descobrir: [
    { id: "ds1", title: "Preencha a Roda da Carreira", description: "Avalie 8 dimensões profissionais", completed: false, xp: 30, type: 'phase' },
    { id: "ds2", title: "Monte sua linha do tempo", description: "Documente sua trajetória", completed: false, xp: 25, type: 'phase' },
    { id: "ds3", title: "Faça um diagnóstico", description: "Descubra seu perfil", completed: false, xp: 20, type: 'phase' },
    { id: "ds4", title: "Explore profissões", description: "Veja recomendações para você", completed: false, xp: 25, type: 'phase' },
  ],
  decidir: [
    { id: "dc1", title: "Compare rotas possíveis", description: "Analise suas opções", completed: false, xp: 30, type: 'phase' },
    { id: "dc2", title: "Mapeie lacunas", description: "Identifique gaps a desenvolver", completed: false, xp: 25, type: 'phase' },
    { id: "dc3", title: "Defina meta SMART", description: "Crie um objetivo claro", completed: false, xp: 35, type: 'phase' },
    { id: "dc4", title: "Monte seu plano 90 dias", description: "Estruture os próximos passos", completed: false, xp: 40, type: 'phase' },
  ],
  desenvolver: [
    { id: "dv1", title: "Otimize seu LinkedIn", description: "Complete o checklist", completed: false, xp: 30, type: 'phase' },
    { id: "dv2", title: "Crie seu pitch", description: "Prepare sua apresentação", completed: false, xp: 25, type: 'phase' },
    { id: "dv3", title: "Atualize seu currículo", description: "Use o builder", completed: false, xp: 30, type: 'phase' },
    { id: "dv4", title: "Monte seu portfólio", description: "Documente projetos", completed: false, xp: 35, type: 'phase' },
  ],
  deslanchar: [
    { id: "dl1", title: "Registre uma oportunidade", description: "Acompanhe candidaturas", completed: false, xp: 20, type: 'phase' },
    { id: "dl2", title: "Pratique uma entrevista", description: "Use o simulador", completed: false, xp: 30, type: 'phase' },
    { id: "dl3", title: "Complete networking semanal", description: "Faça 3 conexões", completed: false, xp: 25, type: 'phase' },
    { id: "dl4", title: "Faça check-in semanal", description: "Reflita sobre seu progresso", completed: false, xp: 15, type: 'phase' },
  ],
  desfrutar: [
    { id: "df1", title: "Avalie seus resultados", description: "Compare antes e depois", completed: false, xp: 30, type: 'phase' },
    { id: "df2", title: "Celebre conquistas", description: "Reconheça sua jornada", completed: false, xp: 25, type: 'phase' },
    { id: "df3", title: "Gere seu relatório final", description: "Documente aprendizados", completed: false, xp: 40, type: 'phase' },
    { id: "df4", title: "Planeje próximo ciclo", description: "Continue evoluindo", completed: false, xp: 35, type: 'phase' },
  ],
};

const phaseNumberToSlug: Record<number, string> = {
  1: "despertar",
  2: "descobrir",
  3: "decidir",
  4: "desenvolver",
  5: "deslanchar",
  6: "desfrutar",
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export function MissionCard() {
  const { userProgress, phases } = useProgress();
  
  const currentPhase = phases?.find(p => p.id === userProgress?.current_phase_id);
  const phaseSlug = currentPhase?.phase_number 
    ? phaseNumberToSlug[currentPhase.phase_number] 
    : "despertar";

  const missions = useMemo(() => {
    return phaseMissions[phaseSlug] || phaseMissions.despertar;
  }, [phaseSlug]);

  const completedCount = missions.filter(m => m.completed).length;
  const totalXP = missions.filter(m => m.completed).reduce((acc, m) => acc + m.xp, 0);
  const potentialXP = missions.reduce((acc, m) => acc + m.xp, 0);
  const progressPercent = (completedCount / missions.length) * 100;

  const phaseDisplayName = currentPhase?.name || "Despertar";
  const phaseLink = currentPhase?.phase_number 
    ? `/fase${currentPhase.phase_number}-${phaseSlug}` 
    : "/fase1-despertar";

  return (
    <motion.div 
      className="card-elevated overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 sm:p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base text-foreground">
                  Missões: {phaseDisplayName}
                </h3>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                  <Sparkles className="h-2.5 w-2.5" />
                  Fase {currentPhase?.phase_number || 1}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {completedCount}/{missions.length} completas • +{totalXP}/{potentialXP} XP
              </p>
            </div>
          </div>
          <Link 
            to={phaseLink}
            className={cn(
              "text-primary hover:text-primary/80 transition-colors p-2 -m-2 rounded-lg",
              focusRingClasses
            )}
            aria-label="Ver todas as missões da fase"
          >
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 sm:mt-4">
          <AnimatedProgress value={progressPercent} className="h-1.5 sm:h-2" />
        </div>
      </div>
      
      {/* Missions list */}
      <motion.div 
        className="p-3 sm:p-4 space-y-1.5 sm:space-y-2"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            variants={itemVariants}
          >
            <Link
              to={phaseLink}
              className={cn(
                "w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 text-left group",
                focusRingClasses,
                mission.completed 
                  ? 'bg-primary/5 hover:bg-primary/10' 
                  : 'hover:bg-muted'
              )}
            >
              <motion.div
                initial={mission.completed ? { scale: 0 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {mission.completed ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                )}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-xs sm:text-sm font-medium truncate",
                  mission.completed 
                    ? 'text-muted-foreground line-through' 
                    : 'text-foreground group-hover:text-primary transition-colors'
                )}>
                  {mission.title}
                </p>
                {mission.description && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {mission.description}
                  </p>
                )}
              </div>
              <span className={cn(
                "text-[10px] sm:text-xs font-medium flex-shrink-0",
                mission.completed 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              )}>
                +{mission.xp} XP
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
