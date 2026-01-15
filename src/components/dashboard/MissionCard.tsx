import { Target, Circle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
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

  const phaseDisplayName = currentPhase?.name || "Despertar";
  const phaseLink = currentPhase?.phase_number 
    ? `/fase${currentPhase.phase_number}-${phaseSlug}` 
    : "/fase1-despertar";

  return (
    <motion.div 
      className="bg-card rounded-2xl border border-border overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      {/* Header compact */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground">
                Missões: {phaseDisplayName}
              </h3>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                <Sparkles className="h-2.5 w-2.5" />
                Fase {currentPhase?.phase_number || 1}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
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
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
      
      {/* Missions list - show only first 3 */}
      <motion.div 
        className="p-3 space-y-1"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {missions.slice(0, 3).map((mission) => (
          <motion.div
            key={mission.id}
            variants={itemVariants}
          >
            <Link
              to={phaseLink}
              className={cn(
                "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left group",
                focusRingClasses,
                mission.completed 
                  ? 'bg-primary/5' 
                  : 'hover:bg-muted/50'
              )}
            >
              <Circle className={cn(
                "h-4 w-4 flex-shrink-0 transition-colors",
                mission.completed ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )} />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  mission.completed 
                    ? 'text-muted-foreground line-through' 
                    : 'text-foreground'
                )}>
                  {mission.title}
                </p>
                {mission.description && (
                  <p className="text-[10px] text-muted-foreground truncate">
                    {mission.description}
                  </p>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium flex-shrink-0",
                mission.completed ? 'text-primary' : 'text-muted-foreground'
              )}>
                +{mission.xp} XP
              </span>
            </Link>
          </motion.div>
        ))}
        
        {/* Link to see more missions */}
        {missions.length > 3 && (
          <motion.div variants={itemVariants}>
            <Link
              to={phaseLink}
              className={cn(
                "w-full flex items-center justify-center gap-2 p-2.5 rounded-xl transition-all duration-200 text-center",
                "text-primary hover:bg-primary/5",
                focusRingClasses
              )}
            >
              <span className="text-xs font-medium">
                +{missions.length - 3} missões • Ver fase completa
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
