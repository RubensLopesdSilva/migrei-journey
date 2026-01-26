import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Play, CheckCircle2, Lock } from "lucide-react";

interface PhaseData {
  id: string;
  name: string;
  description: string;
  bgColor: string;
  icon: React.ElementType;
  route: string;
  phaseNumber: number;
}

interface PhaseActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase: PhaseData | null;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
}

export function PhaseActionModal({ 
  open, 
  onOpenChange, 
  phase, 
  status, 
  progress 
}: PhaseActionModalProps) {
  const navigate = useNavigate();

  if (!phase) return null;

  const IconComponent = phase.icon;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  const isAvailable = status === 'available';

  const handleAction = () => {
    onOpenChange(false);
    navigate(phase.route);
  };

  const getStatusLabel = () => {
    if (isCompleted) return "Fase concluída";
    if (isInProgress) return "Em andamento";
    if (isAvailable) return "Disponível para iniciar";
    return "Fase bloqueada";
  };

  const getButtonLabel = () => {
    if (isCompleted) return "Revisar fase";
    if (isInProgress) return "Continuar jornada";
    if (isAvailable) return "Iniciar fase";
    return "Bloqueada";
  };

  const getButtonIcon = () => {
    if (isCompleted) return CheckCircle2;
    if (isInProgress) return ArrowRight;
    if (isAvailable) return Play;
    return Lock;
  };

  const ButtonIcon = getButtonIcon();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-0 rounded-2xl">
        {/* Header com cor da fase */}
        <motion.div 
          className="relative p-6 pb-10"
          style={{ backgroundColor: phase.bgColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Decoração de fundo */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-20"
              style={{ backgroundColor: 'white' }}
            />
            <div 
              className="absolute -left-5 -bottom-5 w-24 h-24 rounded-full opacity-10"
              style={{ backgroundColor: 'white' }}
            />
          </div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3">
              <motion.div 
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <IconComponent className="h-6 w-6 text-white" strokeWidth={2} />
              </motion.div>
              <div className="flex-1">
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <span className="text-white/70 text-sm font-medium">
                    Fase {phase.phaseNumber}
                  </span>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm"
                  >
                    {getStatusLabel()}
                  </span>
                </motion.div>
                <DialogTitle className="text-xl font-bold text-white mt-0.5">
                  {phase.name}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
        </motion.div>

        {/* Conteúdo do modal */}
        <motion.div 
          className="p-6 pt-4 -mt-4 bg-card rounded-t-2xl relative z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {phase.description}
          </p>

          {/* Barra de progresso (se em andamento ou concluída) */}
          {(isInProgress || isCompleted) && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Progresso da fase
                </span>
                <span 
                  className="text-xs font-bold"
                  style={{ color: phase.bgColor }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ backgroundColor: phase.bgColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          {/* Botão de ação */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              className="w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all"
              style={{ 
                backgroundColor: isLocked ? 'hsl(var(--muted))' : phase.bgColor,
                color: isLocked ? 'hsl(var(--muted-foreground))' : 'white'
              }}
              disabled={isLocked}
              onClick={handleAction}
            >
              <ButtonIcon className="mr-2 h-5 w-5" />
              {getButtonLabel()}
            </Button>
          </motion.div>

          {/* Mensagem adicional para fase bloqueada */}
          {isLocked && (
            <motion.p 
              className="text-xs text-center text-muted-foreground mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Complete a fase anterior para desbloquear
            </motion.p>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
