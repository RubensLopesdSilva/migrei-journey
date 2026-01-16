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

type ClaritySection = 'learnings' | 'benefits' | 'deliverables';

interface CompactClarityBarProps {
  learnings: string[];
  benefits: string[];
  deliverables: string[];
  phaseColor: string;
  defaultOpen: boolean;
}

function CompactClarityBar({ learnings, benefits, deliverables, phaseColor, defaultOpen }: CompactClarityBarProps) {
  const [activeSection, setActiveSection] = useState<ClaritySection | null>(defaultOpen ? 'learnings' : null);

  const sections = [
    { 
      key: 'learnings' as ClaritySection, 
      title: 'Aprendizados', 
      icon: BookOpen, 
      items: learnings 
    },
    { 
      key: 'benefits' as ClaritySection, 
      title: 'Valor gerado', 
      icon: Target, 
      items: benefits 
    },
    { 
      key: 'deliverables' as ClaritySection, 
      title: 'Entregas', 
      icon: CheckCircle2, 
      items: deliverables,
      isDeliverable: true 
    },
  ];

  const toggleSection = (key: ClaritySection) => {
    setActiveSection(activeSection === key ? null : key);
  };

  return (
    <div className="bg-muted/30 rounded-xl border overflow-hidden">
      {/* Compact Toggle Bar */}
      <div className="flex divide-x divide-border">
        {sections.map(({ key, title, icon: Icon }) => (
          <button
            key={key}
            onClick={() => toggleSection(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-all",
              "hover:bg-muted/50",
              activeSection === key 
                ? "bg-background shadow-sm" 
                : "text-muted-foreground"
            )}
            style={{
              color: activeSection === key ? phaseColor : undefined
            }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{title}</span>
            <ChevronDown 
              className={cn(
                "h-3 w-3 transition-transform",
                activeSection === key && "rotate-180"
              )} 
            />
          </button>
        ))}
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-background border-t">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {sections.find(s => s.key === activeSection)?.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    {activeSection === 'deliverables' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
                    ) : (
                      <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" style={{ color: phaseColor }} />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

      {/* Barra compacta de clareza */}
      <motion.div variants={itemVariants}>
        <CompactClarityBar
          learnings={learnings}
          benefits={benefits}
          deliverables={deliverables}
          phaseColor={phaseColor}
          defaultOpen={isFirstVisit}
        />
      </motion.div>

    </motion.div>
  );
}