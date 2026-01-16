import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Target, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Brain,
  ChevronDown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface PhaseIntroData {
  phaseNumber: number;
  phaseName: string;
  phaseSubtitle: string;
  phaseColor: string;
  phaseIcon: React.ReactNode;
  learnings: string[];
  benefits: string[];
  deliverables: string[];
  aiCapabilities?: string[];
  progressPercentage: number;
  isComplete?: boolean;
}

interface PhaseIntroBlockProps {
  data: PhaseIntroData;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Hook para controle de primeira visita por fase
const useFirstVisit = (phaseNumber: number) => {
  const storageKey = `migrei_phase_${phaseNumber}_visited`;
  
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(storageKey) !== 'true';
  });

  useEffect(() => {
    if (isFirstVisit) {
      // Marca como visitado após um pequeno delay para dar tempo do usuário ver
      const timer = setTimeout(() => {
        localStorage.setItem(storageKey, 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, storageKey]);

  return isFirstVisit;
};

interface ClarityCardProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  phaseColor: string;
  isDeliverable?: boolean;
  defaultOpen: boolean;
}

function ClarityCard({ title, icon, items, phaseColor, isDeliverable, defaultOpen }: ClarityCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card 
      className={cn(
        "h-full border-l-4 hover:shadow-md transition-all cursor-pointer",
        isDeliverable && "bg-gradient-to-br from-background to-muted/30"
      )} 
      style={{ borderLeftColor: phaseColor }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${phaseColor}20` }}
            >
              {icon}
            </div>
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.ul 
              className="space-y-1.5 mt-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  {isDeliverable ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
                  ) : (
                    <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" style={{ color: phaseColor }} />
                  )}
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export function PhaseIntroBlock({ data, className }: PhaseIntroBlockProps) {
  const {
    phaseNumber,
    phaseName,
    phaseSubtitle,
    phaseColor,
    phaseIcon,
    learnings,
    benefits,
    deliverables,
    aiCapabilities,
    progressPercentage,
    isComplete
  } = data;

  const isFirstVisit = useFirstVisit(phaseNumber);

  return (
    <motion.div 
      className={cn("space-y-6", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Phase Header com Progress */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: phaseColor }}
            >
              {phaseIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Fase {phaseNumber}: {phaseName}
                </h1>
                {isComplete && (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completa
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{phaseSubtitle}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="text-base px-3 py-1.5"
            style={{ borderColor: phaseColor, color: phaseColor }}
          >
            {progressPercentage}% concluído
          </Badge>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className="h-2"
          style={{ 
            '--progress-color': phaseColor 
          } as React.CSSProperties}
        />
      </motion.div>

      {/* 3 Blocos de Clareza - Colapsáveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <ClarityCard
            title="O que você vai aprender"
            icon={<BookOpen className="h-4 w-4" style={{ color: phaseColor }} />}
            items={learnings}
            phaseColor={phaseColor}
            defaultOpen={isFirstVisit}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ClarityCard
            title="Para que isso serve"
            icon={<Target className="h-4 w-4" style={{ color: phaseColor }} />}
            items={benefits}
            phaseColor={phaseColor}
            defaultOpen={isFirstVisit}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ClarityCard
            title="O que você terá pronto"
            icon={<CheckCircle2 className="h-4 w-4" style={{ color: phaseColor }} />}
            items={deliverables}
            phaseColor={phaseColor}
            isDeliverable
            defaultOpen={isFirstVisit}
          />
        </motion.div>
      </div>

      {/* Indicador de IA - Transparência */}
      {aiCapabilities && aiCapabilities.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">IA como sua aliada nesta fase</h3>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Potencializada por IA
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A IA organiza o caminho. As decisões continuam sendo suas.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {aiCapabilities.map((capability, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-primary/10 hover:bg-primary/20"
                      >
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}