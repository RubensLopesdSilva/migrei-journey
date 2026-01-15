import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Loader2, Bot, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAgent } from "@/hooks/useAgent";
import { useToast } from "@/hooks/use-toast";
import { AIAgent } from "@/types/agent";
import { cn } from "@/lib/utils";

// Import agent avatar images
import agentsSet1 from "@/assets/agents/agents-set-1.png";
import agentsSet2 from "@/assets/agents/agents-set-2.png";
import agentsSet3 from "@/assets/agents/agents-set-3.png";
import agentsSet4 from "@/assets/agents/agents-set-4.png";

// Agent avatar images mapping
const agentAvatars: Record<string, string> = {
  'Lumi': agentsSet1,
  'Noah': agentsSet2,
  'Ema': agentsSet3,
  'Leo': agentsSet4,
  'Maya': agentsSet1,
  'Kai': agentsSet2,
};

export function AgentSettingsCard() {
  const { toast } = useToast();
  const { agents, currentAgent, selectAgent, loading } = useAgent();
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = () => {
    setSelectedAgentId(currentAgent?.id || null);
    setShowChangeModal(true);
  };

  const handleConfirmChange = async () => {
    if (!selectedAgentId || selectedAgentId === currentAgent?.id) {
      setShowChangeModal(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await selectAgent(selectedAgentId);
      toast({
        title: "Agente alterado!",
        description: "Seu novo tutor de IA já está ativo.",
      });
      setShowChangeModal(false);
    } catch (error) {
      toast({
        title: "Erro ao alterar agente",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card-elevated p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-24 bg-muted rounded" />
              <div className="h-4 w-40 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = currentAgent 
    ? agentAvatars[currentAgent.name] || agentsSet1
    : null;

  return (
    <>
      <div className="card-elevated p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Meu Agente de IA
            </h2>
          </div>
        </div>

        {currentAgent ? (
          <div className="flex items-center gap-5">
            {/* Agent Avatar */}
            <div 
              className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0"
              style={{ backgroundColor: currentAgent.background_color }}
            >
              <img 
                src={avatarUrl || ''} 
                alt={currentAgent.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Agent Info */}
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-foreground">
                {currentAgent.name}
              </h3>
              <p className="text-sm font-medium text-primary">
                {currentAgent.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {currentAgent.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Nenhum agente selecionado
            </p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleOpenChange}
        >
          <RefreshCw className="h-4 w-4" />
          Trocar agente de IA
        </Button>
      </div>

      {/* Change Agent Modal */}
      <Dialog open={showChangeModal} onOpenChange={setShowChangeModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Trocar Agente de IA
            </DialogTitle>
            <DialogDescription>
              Escolha um novo tutor para te acompanhar na jornada.
            </DialogDescription>
          </DialogHeader>

          <Alert className="bg-muted/50">
            <AlertDescription className="text-sm">
              Ao trocar de agente, apenas o estilo de orientação muda. Seu progresso permanece intacto.
            </AlertDescription>
          </Alert>

          {/* Agents Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
            {agents.map((agent) => (
              <AgentOptionCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgentId === agent.id}
                isCurrent={currentAgent?.id === agent.id}
                onSelect={() => setSelectedAgentId(agent.id)}
              />
            ))}
          </div>

          {/* Confirm Button */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowChangeModal(false)}
            >
              Cancelar
            </Button>
            <Button
              className="btn-primary-gradient gap-2"
              disabled={!selectedAgentId || selectedAgentId === currentAgent?.id || isSubmitting}
              onClick={handleConfirmChange}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Confirmar troca
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface AgentOptionCardProps {
  agent: AIAgent;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: () => void;
}

function AgentOptionCard({ agent, isSelected, isCurrent, onSelect }: AgentOptionCardProps) {
  const avatarUrl = agentAvatars[agent.name] || agentsSet1;

  return (
    <motion.div
      className={cn(
        "relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200",
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-border/50 bg-card hover:border-primary/50"
      )}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selected indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-1.5 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-md"
          >
            <Check className="h-4 w-4 text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current badge */}
      {isCurrent && (
        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
          Atual
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div 
          className="w-14 h-14 rounded-full mb-2 overflow-hidden"
          style={{ backgroundColor: agent.background_color }}
        >
          <img 
            src={avatarUrl}
            alt={agent.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h4 className="font-medium text-sm text-foreground">
          {agent.name}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {agent.title}
        </p>
      </div>
    </motion.div>
  );
}
