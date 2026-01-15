import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAgent } from "@/hooks/useAgent";
import { useToast } from "@/hooks/use-toast";
import { AIAgent } from "@/types/agent";
import { cn } from "@/lib/utils";

// Import agent avatar images
import lumiAvatar from "@/assets/agents/lumi.png";
import noahAvatar from "@/assets/agents/noah.png";
import emaAvatar from "@/assets/agents/ema.png";
import leoAvatar from "@/assets/agents/leo.png";
import mayaAvatar from "@/assets/agents/maya.png";
import kaiAvatar from "@/assets/agents/kai.png";

// Agent avatar images mapping
const agentAvatars: Record<string, string> = {
  'Lumi': lumiAvatar,
  'Noah': noahAvatar,
  'Ema': emaAvatar,
  'Leo': leoAvatar,
  'Maya': mayaAvatar,
  'Kai': kaiAvatar,
};

export default function AgentSelection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { agents, selectAgent, loading: agentsLoading } = useAgent();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const handleConfirm = async () => {
    if (!selectedAgentId) return;

    setIsSubmitting(true);
    try {
      await selectAgent(selectedAgentId);
      toast({
        title: "Agente escolhido!",
        description: "Seu tutor de IA está pronto para te acompanhar.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao selecionar agente",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (agentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">Carregando agentes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Header - Simplified */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1 
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Escolha seu mentor
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Todos seguem o método Migrei, cada um com seu estilo.
          </motion.p>
        </motion.div>

        {/* Agents Row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {agents.map((agent, index) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgentId === agent.id}
              isHovered={hoveredAgentId === agent.id}
              onSelect={() => setSelectedAgentId(agent.id)}
              onHover={() => setHoveredAgentId(agent.id)}
              onLeave={() => setHoveredAgentId(null)}
              index={index}
            />
          ))}
        </motion.div>

        {/* Selected Agent Preview & CTA */}
        <AnimatePresence mode="wait">
          {selectedAgent && (
            <motion.div
              key="selection-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="sticky bottom-4 md:bottom-8"
            >
              <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-4 md:p-6 max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Selected agent mini preview */}
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20"
                      style={{ backgroundColor: selectedAgent.background_color }}
                    >
                      <img 
                        src={agentAvatars[selectedAgent.name] || lumiAvatar}
                        alt={selectedAgent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Você escolheu</p>
                      <p className="font-display font-semibold text-foreground">
                        {selectedAgent.name}
                        <span className="text-primary ml-2 text-sm font-normal">
                          {selectedAgent.title}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    className="btn-primary-gradient px-6 py-5 text-base gap-2 w-full sm:w-auto shadow-lg shadow-primary/20"
                    disabled={isSubmitting}
                    onClick={handleConfirm}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Começar minha jornada
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state hint */}
        {!selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Star className="h-4 w-4" />
              Clique em um mentor para selecioná-lo
            </p>
          </motion.div>
        )}

        {/* Helper text */}
        <motion.p 
          className="text-center text-muted-foreground/70 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Você pode alterar seu mentor a qualquer momento nas Configurações
        </motion.p>
      </div>
    </div>
  );
}

interface AgentCardProps {
  agent: AIAgent;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  index: number;
}

function AgentCard({ agent, isSelected, isHovered, onSelect, onHover, onLeave, index }: AgentCardProps) {
  const avatarUrl = agentAvatars[agent.name] || lumiAvatar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      className={cn(
        "group relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 overflow-hidden",
        isSelected 
          ? "border-primary bg-gradient-to-br from-primary/5 via-primary/10 to-transparent shadow-lg shadow-primary/10" 
          : "border-border/40 bg-card hover:border-primary/40 hover:shadow-md"
      )}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selected indicator - top right */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute top-2 right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center shadow-md z-10"
          >
            <Check className="h-4 w-4 text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Avatar container */}
        <motion.div
          className="relative mb-3"
          animate={{ 
            scale: isSelected ? 1.05 : isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Avatar */}
          <div 
            className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white/50 dark:ring-gray-800/50 shadow-lg"
            style={{ backgroundColor: agent.background_color }}
          >
            <img 
              src={avatarUrl}
              alt={agent.name}
              className="w-[90%] h-[90%] object-cover rounded-full"
            />
          </div>
          
          {/* Pulse effect when selected */}
          {isSelected && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ 
                border: `2px solid ${agent.background_color}`,
              }}
              animate={{ 
                scale: [1, 1.3, 1.3],
                opacity: [0.6, 0, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Info */}
        <h3 className="font-display text-lg font-bold text-foreground mb-1">
          {agent.name}
        </h3>
        <p className={cn(
          "text-sm font-medium transition-colors",
          isSelected ? "text-primary" : "text-primary/70"
        )}>
          {agent.title}
        </p>

        {/* Bottom indicator line */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: isSelected ? "60%" : isHovered ? "30%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
